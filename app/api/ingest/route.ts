import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { addDocument } from '@/lib/vector-store';

export async function POST(req: Request) {
  try {
    const { text, metadata } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    
    // Generate embedding for the document text
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: text,
    });

    if (result.embeddings && result.embeddings[0].values) {
      // Store the text and its embedding in the local JSON database
      await addDocument(text, result.embeddings[0].values, metadata);
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to generate embedding');
    }
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
