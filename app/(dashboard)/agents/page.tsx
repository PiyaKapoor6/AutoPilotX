import { } from 'react';
import { Mail, FileSearch, BarChart3, BrainCircuit, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const agents = [
  {
    id: 'calling-agent',
    name: 'Conversational Calling Agent',
    description: 'Real-time voice agent connected to GCP and MCP servers to handle customer inquiries.',
    icon: PhoneCall,
    status: 'Active',
    color: 'bg-[#22C55E]/15 text-[#22C55E]',
    href: '/calling-agent'
  },
  {
    id: 'document-assistant',
    name: 'Bill & Invoice Reader',
    description: 'Extracts GST details, totals, and line items from uploaded bills and receipts automatically.',
    icon: FileSearch,
    status: 'Active',
    color: 'bg-[#6366F1]/15 text-[#6366F1]',
    href: '/dashboard' // Links to dashboard where upload is
  },
  {
    id: 'auto-report-generator',
    name: 'Daily Report Maker',
    description: 'Creates daily sales, inventory, and cash flow reports in easy-to-read formats (Lakhs/Crores).',
    icon: BarChart3,
    status: 'Active',
    color: 'bg-[#4F46E5]/15 text-[#4F46E5]',
    href: '/agents/auto-report-generator'
  },
  {
    id: 'enterprise-memory',
    name: 'Business Records Search',
    description: 'Instantly find old bills, customer details, or company policies by just asking a question.',
    icon: BrainCircuit,
    status: 'Active',
    color: 'bg-[#22C55E]/15 text-[#22C55E]',
    href: '/memory'
  },
  {
    id: 'email-manager',
    name: 'Email Helper',
    description: 'Drafts polite replies to vendors and clients regarding payments, orders, and general queries.',
    icon: Mail,
    status: 'Active',
    color: 'bg-[#94A3B8]/15 text-[#94A3B8]',
    href: '/agents/email-manager'
  },
];

export default function AgentsPage() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)]">Smart Assistants</h1>
        <p className="text-[var(--theme-muted)] mt-2">Manage your automated helpers that save you time and effort.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.name} className="group transform-gpu transition-transform duration-200 hover:scale-105 flex flex-col rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${agent.color}`}>
                <agent.icon className="h-6 w-6" />
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                agent.status === 'Active' ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#6366F1]/15 text-[#6366F1]'
              }`}>
                {agent.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">{agent.name}</h3>
            <p className="mt-2 text-sm text-[var(--theme-muted)] flex-1">{agent.description}</p>
            <div className="mt-6 pt-4 border-t border-[var(--theme-border)]">
              <Link
                href={agent.href}
                className="text-sm font-medium transition-colors text-[var(--theme-primary)] group-hover:text-red-600"
              >
                Open Assistant &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
