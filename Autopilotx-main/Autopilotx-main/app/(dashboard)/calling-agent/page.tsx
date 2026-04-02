"use client";

import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { Mic, MicOff, Phone, PhoneOff, Server, Database, Activity } from 'lucide-react';

// --- RAG KNOWLEDGE BASE (Mock Database) ---
const BUSINESS_DATABASE = [
  { id: 'INV-001', type: 'invoice', content: 'Invoice INV-001 for Acme Corp. Amount: ₹45,000. Status: Unpaid. Due date: 2026-04-15.' },
  { id: 'INV-002', type: 'invoice', content: 'Invoice INV-002 for TechFlow Inc. Amount: ₹12,500. Status: Paid. Paid on: 2026-03-10.' },
  { id: 'CUST-001', type: 'customer', content: 'Customer: Acme Corp. Contact: Rahul Sharma. Phone: +91-9876543210. Lifetime value: ₹2,50,000.' },
  { id: 'CUST-002', type: 'customer', content: 'Customer: TechFlow Inc. Contact: Priya Patel. Phone: +91-9123456789. Lifetime value: ₹75,000.' },
  { id: 'POL-001', type: 'policy', content: 'Return Policy: Items can be returned within 15 days of delivery. Refunds are processed within 5-7 business days.' },
  { id: 'INV-003', type: 'inventory', content: 'Product: Ergonomic Office Chair. SKU: CHR-099. Stock: 45 units. Price: ₹8,500.' },
  { id: 'INV-004', type: 'inventory', content: 'Product: Mechanical Keyboard. SKU: KB-042. Stock: 12 units. Price: ₹3,200.' }
];

const searchDatabase = (query: string) => {
  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(' ').filter(t => t.length > 2);
  
  const results = BUSINESS_DATABASE.filter(record => {
    const lowerContent = record.content.toLowerCase();
    // Match if any significant term is in the content
    return terms.some(term => lowerContent.includes(term));
  });
  
  if (results.length === 0) {
    return "No matching records found in the database.";
  }
  
  return results.map(r => `[${r.type.toUpperCase()}] ${r.content}`).join('\n');
};
// ------------------------------------------

/** Gemini Live expects 16 kHz mono PCM for realtime input. */
const INPUT_PCM_HZ = 16000;
/** Native audio model output is 24 kHz (PCM16 from Live API). */
const OUTPUT_PCM_HZ = 24000;
/** Smaller capture buffer = lower end-to-end latency (valid sizes: 256…16384). */
const CAPTURE_BUFFER_SIZE = 512;
/** Single built-in voice for the entire session (do not change at runtime). */
const VOICE_NAME = "Zephyr";
/** Output headroom before dynamics processing — reduces digital clipping / harsh distortion. */
const PLAYBACK_HEADROOM = 0.88;
/** Mic noise gate (linear, gentle attenuation below threshold). */
const MIC_NOISE_FLOOR = 0.014;

function resampleToRate(
  input: Float32Array,
  inputRate: number,
  outputRate: number
): Float32Array {
  if (inputRate === outputRate) return input;
  const ratio = inputRate / outputRate;
  const outLen = Math.max(1, Math.floor(input.length / ratio));
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const src = i * ratio;
    const i0 = Math.floor(src);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const frac = src - i0;
    out[i] = input[i0] * (1 - frac) + input[i1] * frac;
  }
  return out;
}

function gentleNoiseGateInPlace(samples: Float32Array, floor = MIC_NOISE_FLOOR) {
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    if (Math.abs(s) < floor) samples[i] = s * 0.18;
  }
}

function floatToPcm16Base64(samples: Float32Array): string {
  const pcm16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    pcm16[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
}

function decodePcm16Base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const evenBytes = bytes.byteLength - (bytes.byteLength % 2);
  const pcm16 = new Int16Array(bytes.buffer, bytes.byteOffset, evenBytes / 2);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = Math.max(-1, Math.min(1, pcm16[i] / 32768));
  }
  return float32;
}

function mergeFloat32Chunks(chunks: Float32Array[]): Float32Array {
  let len = 0;
  for (const c of chunks) len += c.length;
  const out = new Float32Array(len);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

function isAudioMime(mime: string): boolean {
  const m = mime.toLowerCase();
  return m === "" || m.includes("audio") || m.includes("pcm") || m.includes("l16");
}

/**
 * Collects all inline PCM chunks from a model turn into one buffer so we schedule
 * one contiguous segment per message (avoids part-to-part overlap / phasing).
 */
function collectModelTurnPcm(modelTurn: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string }; thought?: boolean }> } | undefined): Float32Array | null {
  if (!modelTurn?.parts?.length) return null;
  const chunks: Float32Array[] = [];
  for (const part of modelTurn.parts) {
    if (part.thought) continue;
    const inline = part.inlineData;
    if (!inline?.data || !isAudioMime(inline.mimeType ?? "")) continue;
    chunks.push(decodePcm16Base64ToFloat32(inline.data));
  }
  if (chunks.length === 0) {
    const first = modelTurn.parts.find((p) => p.inlineData?.data);
    if (first?.inlineData?.data) {
      return decodePcm16Base64ToFloat32(first.inlineData.data);
    }
    return null;
  }
  return mergeFloat32Chunks(chunks);
}

export default function CallingAgentPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState<{ type: string; message: string; time: string }[]>([]);
  
  const sessionRef = useRef<any>(null);
  const liveSessionRef = useRef<any>(null);
  const isMutedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const highpassRef = useRef<BiquadFilterNode | null>(null);
  const muteGainRef = useRef<GainNode | null>(null);
  const playbackBusRef = useRef<GainNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const activePlaybackSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  /** Serial playback: one chunk at a time — eliminates overlapping AI audio. */
  const pcmQueueRef = useRef<Float32Array[]>([]);
  const playbackSerialBusyRef = useRef(false);
  const playbackTailEndRef = useRef(0);

  const stopAllPlayback = () => {
    const ctx = audioCtxRef.current;
    pcmQueueRef.current = [];
    playbackSerialBusyRef.current = false;
    if (ctx) playbackTailEndRef.current = ctx.currentTime;
    for (const src of [...activePlaybackSourcesRef.current]) {
      try {
        src.stop(0);
        src.disconnect();
      } catch {
        /* already stopped */
      }
    }
    activePlaybackSourcesRef.current = [];
  };

  const tryPlayNextPcm = () => {
    const ctx = audioCtxRef.current;
    const playbackBus = playbackBusRef.current;
    if (!ctx || !playbackBus || playbackSerialBusyRef.current) return;
    const pcm = pcmQueueRef.current.shift();
    if (!pcm || pcm.length === 0) return;

    playbackSerialBusyRef.current = true;
    const audioBuffer = ctx.createBuffer(1, pcm.length, OUTPUT_PCM_HZ);
    audioBuffer.getChannelData(0).set(pcm);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(playbackBus);
    activePlaybackSourcesRef.current.push(source);

    const startAt = Math.max(ctx.currentTime, playbackTailEndRef.current);
    playbackTailEndRef.current = startAt + audioBuffer.duration;

    source.onended = () => {
      playbackSerialBusyRef.current = false;
      const arr = activePlaybackSourcesRef.current;
      const idx = arr.indexOf(source);
      if (idx >= 0) arr.splice(idx, 1);
      tryPlayNextPcm();
    };

    source.start(startAt);
  };

  const enqueuePcmPlayback = (pcm: Float32Array) => {
    pcmQueueRef.current.push(pcm);
    tryPlayNextPcm();
  };

  const addLog = (type: string, message: string) => {
    setLogs(prev => [...prev, { type, message, time: new Date().toLocaleTimeString() }]);
  };

  const startCall = async () => {
    try {
      isMutedRef.current = false;
      setIsMuted(false);
      addLog('system', 'Initializing audio context...');
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext({
        sampleRate: OUTPUT_PCM_HZ,
        latencyHint: "interactive",
      });
      audioCtxRef.current = ctx;
      playbackTailEndRef.current = ctx.currentTime;

      const playbackGain = ctx.createGain();
      playbackGain.gain.value = PLAYBACK_HEADROOM;
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, ctx.currentTime);
      compressor.knee.setValueAtTime(30, ctx.currentTime);
      compressor.ratio.setValueAtTime(8, ctx.currentTime);
      compressor.attack.setValueAtTime(0.002, ctx.currentTime);
      compressor.release.setValueAtTime(0.1, ctx.currentTime);
      playbackGain.connect(compressor);
      compressor.connect(ctx.destination);
      playbackBusRef.current = playbackGain;
      compressorRef.current = compressor;

      addLog('system', 'Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          voiceIsolation: true,
        } as MediaTrackConstraints & { voiceIsolation?: boolean },
      });
      streamRef.current = stream;

      addLog('system', 'Connecting to Gemini Live API...');
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        addLog('error', 'API Key is missing! Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file and restart the server.');
        cleanupAudio();
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
          },
          systemInstruction:
            "You are a highly capable, conversational AI assistant. Speak in one clear, consistent voice at a moderate pace. Be concise and easy to understand. You can query business data via the query_mcp_database tool when relevant.",
          tools: [{
            functionDeclarations: [
              {
                name: 'query_mcp_database',
                description: 'Query the connected GCP/MCP database for customer records, inventory, or business data.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    query: {
                      type: Type.STRING,
                      description: 'The search query to look up in the database.'
                    }
                  },
                  required: ['query']
                }
              }
            ]
          }]
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            addLog('system', 'Connected to Voice Agent.');

            sessionPromise.then((session) => {
              liveSessionRef.current = session;
              if (!audioCtxRef.current || !streamRef.current) return;

              const ctx = audioCtxRef.current;
              const inputRate = ctx.sampleRate;

              sourceRef.current = ctx.createMediaStreamSource(streamRef.current);
              const hp = ctx.createBiquadFilter();
              hp.type = "highpass";
              hp.frequency.value = 85;
              hp.Q.value = 0.707;
              highpassRef.current = hp;
              processorRef.current = ctx.createScriptProcessor(CAPTURE_BUFFER_SIZE, 1, 1);

              sourceRef.current.connect(hp);
              hp.connect(processorRef.current);
              // Do not route mic to speakers — avoids echo and muddies both sides.
              const muteGain = ctx.createGain();
              muteGain.gain.value = 0;
              muteGainRef.current = muteGain;
              processorRef.current.connect(muteGain);
              muteGain.connect(ctx.destination);

              processorRef.current.onaudioprocess = (e) => {
                if (isMutedRef.current) return;

                const inputData = e.inputBuffer.getChannelData(0);
                const resampled = resampleToRate(inputData, inputRate, INPUT_PCM_HZ);
                gentleNoiseGateInPlace(resampled);
                const base64 = floatToPcm16Base64(resampled);

                session.sendRealtimeInput({
                  audio: { data: base64, mimeType: `audio/pcm;rate=${INPUT_PCM_HZ}` },
                });
              };
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            const sc = message.serverContent;
            const ctx = audioCtxRef.current;
            const playbackBus = playbackBusRef.current;

            if (sc?.interrupted && ctx) {
              stopAllPlayback();
              addLog('system', 'Agent interrupted.');
            }

            if (!sc?.interrupted && playbackBus) {
              const pcm = collectModelTurnPcm(sc?.modelTurn);
              if (pcm && pcm.length > 0) {
                enqueuePcmPlayback(pcm);
              }
            }

            // Handle Tool Calls (MCP Simulation)
            if (message.toolCall) {
              const functionCalls = message.toolCall.functionCalls;
              if (functionCalls) {
                const responses = functionCalls.map(call => {
                  if (call.name === 'query_mcp_database') {
                    const args = call.args as any;
                    addLog('mcp', `Querying GCP/MCP Server for: "${args.query}"`);
                    
                    // Perform RAG Search
                    const searchResult = searchDatabase(args.query);
                    addLog('system', `RAG Pipeline found: ${searchResult.substring(0, 50)}...`);
                    
                    return {
                      id: call.id,
                      name: call.name,
                      response: {
                        result: searchResult
                      }
                    };
                  }
                  return { id: call.id, name: call.name, response: { error: 'Unknown function' } };
                });

                sessionPromise.then((session) => {
                  stopAllPlayback();
                  session.sendToolResponse({ functionResponses: responses });
                  addLog('mcp', 'Sent MCP data back to agent.');
                });
              }
            }
          },
          onclose: () => {
            setIsConnected(false);
            addLog('system', 'Call ended.');
            cleanupAudio();
          },
          onerror: (error) => {
            console.error('Live API Error:', error);
            addLog('error', 'Connection error occurred.');
            endCall();
          }
        }
      });

      sessionPromise.catch(err => {
        console.error('Live API Connection Error:', err);
        addLog('error', `Connection failed: ${err.message || 'Network error'}. Please check your API key and internet connection.`);
        setIsConnected(false);
        cleanupAudio();
      });

      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error('Failed to start call:', error);
      addLog('error', 'Failed to access microphone or connect to API.');
      cleanupAudio();
    }
  };

  const cleanupAudio = () => {
    stopAllPlayback();
    if (playbackBusRef.current) {
      playbackBusRef.current.disconnect();
      playbackBusRef.current = null;
    }
    if (compressorRef.current) {
      compressorRef.current.disconnect();
      compressorRef.current = null;
    }
    liveSessionRef.current = null;
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (highpassRef.current) {
      highpassRef.current.disconnect();
      highpassRef.current = null;
    }
    if (muteGainRef.current) {
      muteGainRef.current.disconnect();
      muteGainRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const endCall = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
    cleanupAudio();
    setIsConnected(false);
  };

  const endCallRef = useRef(endCall);
  useEffect(() => {
    endCallRef.current = endCall;
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    return () => {
      endCallRef.current();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)]">Conversational Calling Agent</h1>
        <p className="text-[var(--theme-muted)] mt-2">Real-time voice agent connected to GCP and MCP servers.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Call Interface */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          
          <div className="relative mb-8">
            <div className={`absolute inset-0 rounded-full blur-xl opacity-50 transition-all duration-1000 ${isConnected ? 'bg-[var(--theme-primary)] animate-pulse' : 'bg-[var(--theme-border)]'}`}></div>
            <div className={`relative h-32 w-32 rounded-full flex items-center justify-center border-4 ${isConnected ? 'border-[var(--theme-primary)] bg-[var(--theme-secondary)]/20' : 'border-[var(--theme-border)] bg-[var(--theme-background)]'}`}>
              <Phone className={`h-12 w-12 ${isConnected ? 'text-[var(--theme-primary)]' : 'text-[var(--theme-muted)]'}`} />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-[var(--theme-text)] mb-2">
            {isConnected ? 'Agent is listening...' : 'Ready to connect'}
          </h2>
          <p className="text-[var(--theme-muted)] mb-8 text-center max-w-md">
            {isConnected 
              ? 'Speak into your microphone. The agent will process your voice and fetch data from the MCP server if needed.' 
              : 'Click the button below to start a real-time voice session with the AI agent.'}
          </p>

          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <button 
                onClick={startCall}
                className="inline-flex items-center justify-center rounded-full bg-[var(--theme-primary)] px-8 py-4 text-base font-medium text-white hover:bg-[var(--theme-secondary)] transition-colors shadow-lg hover:shadow-xl"
              >
                <Phone className="mr-2 h-5 w-5" />
                Start Call
              </button>
            ) : (
              <>
                <button 
                  onClick={toggleMute}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-4 text-base font-medium transition-colors shadow-md ${isMuted ? 'bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/25' : 'bg-[var(--theme-background)] text-[var(--theme-text)] hover:bg-[var(--theme-card)]'}`}
                >
                  {isMuted ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button 
                  onClick={endCall}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--theme-accent)] px-8 py-4 text-base font-medium text-white hover:bg-[var(--theme-accent)] transition-colors shadow-lg hover:shadow-xl"
                >
                  <PhoneOff className="mr-2 h-5 w-5" />
                  End Call
                </button>
              </>
            )}
          </div>
        </div>

        {/* Server Status & Logs */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4 flex items-center">
              <Server className="h-5 w-5 mr-2 text-[var(--theme-primary)]" />
              Infrastructure
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-[var(--theme-muted)]">
                  <Activity className="h-4 w-4 mr-2 text-[var(--theme-accent)]" />
                  Gemini Live API
                </div>
                <span className="inline-flex items-center rounded-full bg-[var(--theme-accent)]/15 px-2 py-0.5 text-xs font-medium text-[var(--theme-accent)]">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-[var(--theme-muted)]">
                  <Database className="h-4 w-4 mr-2 text-[var(--theme-secondary)]" />
                  GCP MCP Server
                </div>
                <span className="inline-flex items-center rounded-full bg-[var(--theme-secondary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--theme-secondary)]">Connected</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm h-[320px] flex flex-col">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Activity Log</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {logs.length === 0 ? (
                <p className="text-sm text-[var(--theme-muted)] italic text-center mt-10">No activity yet.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-xs text-[var(--theme-muted)] mr-2">[{log.time}]</span>
                    <span className={
                      log.type === 'error' ? 'text-red-600' : 
                      log.type === 'mcp' ? 'text-[var(--theme-secondary)] font-medium' : 
                      'text-[var(--theme-text)]'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
