'use client';

import { Download, FileText, Table } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

export function ReportDownloader({ content }: { content: string }) {
  if (!content) return null;

  // Find markdown tables
  const tableRegex = /\|(.+)\|\n\|([-:| ]+)\|\n((?:\|.*\|\n?)+)/g;
  const matches = [...content.matchAll(tableRegex)];

  if (matches.length === 0) return null;

  const downloadPDF = (match: RegExpMatchArray, index: number) => {
    const headers = match[1].split('|').map(h => h.trim()).filter(Boolean);
    const rows = match[3].trim().split('\n').map(row => 
      row.split('|').map(c => c.trim()).filter(Boolean)
    );

    const doc = new jsPDF();
    doc.text(`AutoPilotX Report ${index + 1}`, 14, 15);
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
    });
    doc.save(`report-${index + 1}.pdf`);
  };

  const downloadCSV = (match: RegExpMatchArray, index: number) => {
    const headers = match[1].split('|').map(h => h.trim()).filter(Boolean);
    const rows = match[3].trim().split('\n').map(row => 
      row.split('|').map(c => c.trim()).filter(Boolean)
    );
    
    const csv = Papa.unparse([headers, ...rows]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report-${index + 1}.csv`;
    link.click();
  };

  return (
    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Files</p>
      {matches.map((match, i) => (
        <div key={i} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <Table className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 flex-1">Data Table {i + 1}</span>
          <button onClick={() => downloadPDF(match, i)} className="flex items-center space-x-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1.5 rounded transition-colors">
            <FileText className="h-3.5 w-3.5" /> <span>PDF</span>
          </button>
          <button onClick={() => downloadCSV(match, i)} className="flex items-center space-x-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded transition-colors">
            <Download className="h-3.5 w-3.5" /> <span>CSV</span>
          </button>
        </div>
      ))}
    </div>
  );
}
