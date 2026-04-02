import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { searchDocuments } from '@/lib/vector-store';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

    // 1. Embed the user's query
    const embedResult = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: lastMessage,
    });

    let context = '';
    if (embedResult.embeddings && embedResult.embeddings[0].values) {
      // 2. Search the vector store for relevant company data
      const results = await searchDocuments(embedResult.embeddings[0].values, 3);
      
      if (results.length > 0) {
        context = "Relevant Company Data (from uploaded documents):\n\n" + 
          results.map((r, i) => `[Document ${i+1}]:\n${r.text}`).join('\n\n');
      }
    }

    // 3. Construct the system instruction with the retrieved context
    const systemInstruction = `${DEFAULT_SYSTEM_PROMPT}

You are equipped with a RAG (Retrieval-Augmented Generation) pipeline.
Use the following company data to answer the user's query if relevant. 
If the answer is not in the data, rely on your general knowledge but politely mention that it's not found in the company records.

${context}`;

    // 4. Generate the response
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastMessage,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
