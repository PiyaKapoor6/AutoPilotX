import { DocumentUpload } from '@/components/DocumentUpload';
import { Activity, FileText, CheckCircle, Clock, MessageCircle, FileSpreadsheet, PhoneCall } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)]">Dashboard</h1>
        <p className="text-[var(--theme-muted)] mt-2">Overview of your business tasks, recent documents, and smart assistant status.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Invoices Processed', value: '1,248', icon: FileText, color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/15' },
          { title: 'Voice Calls Handled', value: '86', icon: PhoneCall, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/15' },
          { title: 'Pending Payments', value: '12', icon: Clock, color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/15' },
          { title: 'GST Ready Docs', value: '98.5%', icon: CheckCircle, color: 'text-[#E2E8F0]', bg: 'bg-[#94A3B8]/15' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--theme-muted)]">{stat.title}</p>
                <p className="text-3xl font-bold text-[var(--theme-text)] mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-text)] mb-6">Upload Bills & Invoices</h2>
          <DocumentUpload />
        </div>

        <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-text)] mb-6">Recent Assistant Actions</h2>
          <div className="space-y-6">
            {[
              { action: 'Generated Daily Sales Report', agent: 'Report Assistant', time: '2 mins ago', status: 'Success' },
              { action: 'Extracted GST details from Invoice #INV-2023-001', agent: 'Document Assistant', time: '15 mins ago', status: 'Success' },
              { action: 'Handled customer inquiry via Voice Call', agent: 'Calling Agent', time: '1 hour ago', status: 'Success' },
              { action: 'Categorized 50 new ledger entries', agent: 'Business Records', time: '3 hours ago', status: 'Success' },
            ].map((log, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`mt-1 h-2 w-2 rounded-full ${log.status === 'Success' ? 'bg-[var(--theme-secondary)]' : 'bg-[#f59e0b]'}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-[var(--theme-text)]">{log.action}</p>
                  <p className="text-xs text-[var(--theme-muted)]">{log.agent} • {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
