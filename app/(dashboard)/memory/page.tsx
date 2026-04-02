'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/prompts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function MemoryPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Business Records Assistant. You can ask me about your company data, GST reports, or financial summaries in simple English.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const data = await res.json();

      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)]">Business Records Search</h1>
        <p className="text-[var(--theme-muted)] mt-2">Talk to your business data using natural language.</p>
      </div>

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
              placeholder="Ask about your sales, GST reports, or company policies..."
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
    </div>
  );
}
