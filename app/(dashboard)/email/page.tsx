'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GoogleGenAI } from '@google/genai';
import { EMAIL_MANAGER_PROMPT } from '@/lib/prompts';

const ReportDownloader = dynamic(() => import('@/components/ReportDownloader').then(mod => mod.ReportDownloader), { ssr: false });

function DraftSender({ content }: { content: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  // Parse To and Subject from the content
  const subjectMatch = content.match(/Subject:\s*(.*)/i);
  const toMatch = content.match(/To:\s*(.*)/i);
  
  const initialSubject = subjectMatch ? subjectMatch[1].trim() : '';
  let initialTo = toMatch ? toMatch[1].trim() : '';
  
  // Extract email if it's in the format "Name <email@example.com>"
  const emailRegex = /<([^>]+)>/;
  const extractedEmail = initialTo.match(emailRegex);
  if (extractedEmail) {
    initialTo = extractedEmail[1];
  }

  // Remove Subject and To from body if they exist at the top
  let initialBody = content;
  if (subjectMatch) initialBody = initialBody.replace(subjectMatch[0], '');
  if (toMatch) initialBody = initialBody.replace(toMatch[0], '');
  initialBody = initialBody.trim();

  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = async () => {
    setErrorMessage('');
    const missing: string[] = [];
    if (!to) missing.push('recipient (To)');
    if (!subject) missing.push('subject');
    if (!body) missing.push('body');

    if (missing.length > 0) {
      setErrorMessage(`Please provide: ${missing.join(', ')}`);
      setIsEditing(true);
      return;
    }
    
    setStatus('sending');
    try {
      const res = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send email');
      }
      
      setStatus('sent');
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  if (isEditing) {
    return (
      <div className="mt-4 border-t border-[var(--theme-border)] pt-4 space-y-3">
        {errorMessage && (
          <div className="p-2 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
            {errorMessage}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-[var(--theme-muted)] mb-1">To</label>
          <input 
            type="email" 
            value={to} 
            onChange={e => setTo(e.target.value)} 
            className="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] px-3 py-1.5 text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]"
            placeholder="recipient@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--theme-muted)] mb-1">Subject</label>
          <input 
            type="text" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            className="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] px-3 py-1.5 text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--theme-muted)] mb-1">Body</label>
          <textarea 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            rows={6}
            className="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] px-3 py-1.5 text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-sm font-medium text-[var(--theme-muted)] hover:bg-[var(--theme-background)] rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={status === 'sending'}
            className="inline-flex items-center space-x-2 rounded-md bg-[var(--theme-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--theme-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-secondary)] disabled:opacity-50 transition-colors"
          >
            {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span>Send Email</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex justify-end space-x-2 border-t border-[var(--theme-border)] pt-3">
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-1.5 text-sm font-medium text-[var(--theme-muted)] hover:bg-[var(--theme-background)] rounded-md transition-colors"
      >
        Edit Draft
      </button>
      <button
        onClick={handleSend}
        disabled={status === 'sending' || status === 'sent'}
        className={cn(
          "inline-flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
          status === 'idle' || status === 'error' ? "bg-[var(--theme-primary)] hover:bg-[var(--theme-secondary)] focus:ring-[var(--theme-secondary)]" :
          status === 'sending' ? "bg-[var(--theme-muted)] cursor-not-allowed" :
          "bg-[var(--theme-secondary)] hover:bg-[var(--theme-secondary)] focus:ring-[var(--theme-secondary)]"
        )}
      >
        {(status === 'idle' || status === 'error') && (
          <>
            <Send className="h-4 w-4" />
            <span>{status === 'error' ? 'Retry Sending' : 'Send as Reply'}</span>
          </>
        )}
        {status === 'sending' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending...</span>
          </>
        )}
        {status === 'sent' && (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Sent!</span>
          </>
        )}
      </button>
    </div>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function EmailPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Email Manager. Connect your Gmail to fetch recent emails, or tell me what kind of email you need to draft.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gmail State
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchEmails();
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'OAUTH_SUCCESS') {
        setIsGmailConnected(true);
        fetchEmails();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchEmails = async () => {
    setIsFetchingEmails(true);
    try {
      const res = await fetch('/api/gmail/emails');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        setIsGmailConnected(true);
      } else {
        setIsGmailConnected(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingEmails(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      const apiUrl = `${window.location.origin}/api/auth/google/url`;
      const res = await fetch(apiUrl);

      if (!res.ok) {
        const text = await res.text().catch(() => 'Unable to read error body');
        console.error('Auth URL fetch failed', res.status, res.statusText, text);
        alert(`Failed to start OAuth flow: ${res.status} ${res.statusText}`);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.open(data.url, 'oauth', 'width=600,height=700');
      } else {
        console.error('Auth URL missing in response:', data);
        alert('Failed to start OAuth flow: no URL returned. Check server logs.');
      }
    } catch (err) {
      console.error('Network error when fetching auth URL:', err);
      alert('Network error when contacting auth endpoint. Is the dev server running?');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please add it in the AI Studio settings.');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: EMAIL_MANAGER_PROMPT,
          temperature: 0.2,
        },
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || '' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || 'Sorry, I encountered a network error.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      <div className="mb-6 flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-[var(--theme-background)] transition-colors">
          <ArrowLeft className="h-5 w-5 text-[var(--theme-muted)]" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)]">Email Manager</h1>
          <p className="text-[var(--theme-muted)] mt-1">Inbox & Smart Drafts powered by Gemini AI.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex items-start space-x-4", msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "")}>
                <div className={cn(
                  "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                  msg.role === 'assistant' ? "bg-[var(--theme-background)] text-[var(--theme-text)]" : "bg-[var(--theme-primary)] text-white"
                )}>
                  {msg.role === 'assistant' ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl max-w-[80%]",
                  msg.role === 'user' ? "bg-[var(--theme-primary)] text-white rounded-tr-none" : "bg-[var(--theme-background)] text-[var(--theme-text)] rounded-tl-none"
                )}>
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                  {msg.role === 'assistant' && i > 0 && (
                    <DraftSender content={msg.content} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--theme-background)] text-[var(--theme-text)] flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[var(--theme-background)] text-[var(--theme-text)] rounded-tl-none flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--theme-muted)]" />
                  <span className="text-sm text-[var(--theme-muted)]">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--theme-border)] bg-[var(--theme-card)]">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Draft an email or ask about your inbox..."
                className="flex-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-background)] px-4 py-2 text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center justify-center rounded-lg bg-[var(--theme-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Gmail Sidebar */}
        <div className="w-80 flex flex-col bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--theme-border)] bg-[var(--theme-background)] flex justify-between items-center">
            <h3 className="font-semibold text-[var(--theme-text)] flex items-center"><Mail className="w-4 h-4 mr-2 text-[var(--theme-primary)]"/> Inbox</h3>
            {!isGmailConnected && (
              <button onClick={handleConnectGmail} className="text-xs bg-[var(--theme-primary)] text-white px-3 py-1.5 rounded-md hover:bg-[var(--theme-secondary)] transition-colors">
                Connect Gmail
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isFetchingEmails ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[var(--theme-muted)]"/></div>
            ) : emails.length > 0 ? (
              emails.map(email => (
                <div key={email.id} 
                     onClick={() => setInput(`Draft a reply to this email:\n\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.body.substring(0, 500)}...`)}
                     className="p-3 border border-[var(--theme-border)] rounded-lg hover:border-[var(--theme-secondary)] hover:bg-[var(--theme-background)] cursor-pointer transition-colors">
                  <p className="text-xs font-semibold text-[var(--theme-text)] truncate">{email.from.split('<')[0]}</p>
                  <p className="text-xs text-[var(--theme-muted)] font-medium truncate mt-0.5">{email.subject}</p>
                  <p className="text-xs text-[var(--theme-muted)] line-clamp-2 mt-1">{email.snippet}</p>
                </div>
              ))
            ) : isGmailConnected ? (
              <p className="text-sm text-[var(--theme-muted)] text-center py-8">No recent emails found.</p>
            ) : (
              <div className="text-center py-8 px-4">
                <p className="text-sm text-[var(--theme-muted)] mb-4">Connect your Gmail account to select emails directly from your inbox.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
