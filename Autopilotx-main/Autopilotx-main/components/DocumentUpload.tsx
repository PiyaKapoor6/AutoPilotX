'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from '@google/genai';

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  result?: any;
  error?: string;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(f => ({
      file: f,
      status: 'uploading' as const,
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    for (const newFile of newFiles) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(',')[1];
            
            // Simulate progress
            setFiles(prev => prev.map(f => 
              f.file.name === newFile.file.name ? { ...f, progress: 50 } : f
            ));

            if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
              throw new Error('Gemini API key is not configured. Please add it in the AI Studio settings.');
            }

            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

            const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: [
                {
                  inlineData: {
                    data: base64,
                    mimeType: newFile.file.type
                  }
                },
                {
                  text: `Extract the key information from this document. 
                  If it's an invoice, extract GSTIN, total amount, date, and line items. 
                  If it's a ledger, extract the total balance and key transactions.
                  Return the result as structured JSON.
                  Ensure numbers are formatted according to the Indian numbering system (e.g., 1,00,000).`
                }
              ],
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              }
            });

            if (!response.text) throw new Error('Failed to parse document');
            
            const parsedResult = JSON.parse(response.text!);
            
            // Ingest the extracted data into the vector store
            try {
              await fetch('/api/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: `Document Name: ${newFile.file.name}\nExtracted Data:\n${JSON.stringify(parsedResult, null, 2)}`,
                  metadata: { filename: newFile.file.name, type: newFile.file.type }
                })
              });
            } catch (ingestErr) {
              console.error("Failed to ingest document into vector store", ingestErr);
            }

            setFiles(prev => prev.map(f => 
              f.file.name === newFile.file.name ? { 
                ...f, 
                status: 'success', 
                progress: 100,
                result: parsedResult
              } : f
            ));
          } catch (err: any) {
            setFiles(prev => prev.map(f => 
              f.file.name === newFile.file.name ? { 
                ...f, 
                status: 'error', 
                error: err.message || 'Error parsing document'
              } : f
            ));
          }
        };
        reader.readAsDataURL(newFile.file);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-1">
          {isDragActive ? "Drop files here" : "Tap to upload or drag & drop"}
        </h3>
        <p className="text-sm text-slate-500">
          Upload Invoices, GST Bills, Receipts (PDF, JPG, PNG)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-slate-700">Uploaded Files</h4>
          {files.map((f, idx) => (
            <div key={idx} className="flex flex-col p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{f.file.name}</p>
                    <p className="text-xs text-slate-500">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {f.status === 'uploading' && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    <span className="text-xs text-slate-500">Processing...</span>
                  </div>
                )}
                {f.status === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                {f.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              
              {f.status === 'success' && f.result && (
                <div className="mt-2 p-3 bg-slate-50 rounded-md border border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Extracted Data:</p>
                  <pre className="text-xs text-slate-600 overflow-x-auto">
                    {JSON.stringify(f.result, null, 2)}
                  </pre>
                </div>
              )}
              
              {f.status === 'error' && (
                <p className="text-xs text-red-500">{f.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
