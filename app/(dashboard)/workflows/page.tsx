import { Plus, ArrowRight, FileText, Mail, Database, Clock, User, MessageCircle } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)]">Automated Tasks</h1>
          <p className="text-[var(--theme-muted)] mt-2">Set up rules to automatically handle repetitive business tasks.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-[var(--theme-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-secondary)] transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </button>
      </div>

      <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Create Task with Simple English</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder='e.g., "When a GST bill is uploaded, extract details and send an email to the CA"'
              className="flex-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-background)] px-4 py-3 text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] focus:border-transparent"
            />
            <button className="inline-flex items-center justify-center rounded-lg bg-[var(--theme-primary)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--theme-secondary)] transition-colors">
              Create Task
            </button>
          </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--theme-text)]">Active Tasks</h2>
        
        {[
          {
            name: 'GST Bill Processing',
            trigger: { icon: FileText, text: 'New Bill Uploaded' },
            actions: [
              { icon: Database, text: 'Extract GST Details' },
              { icon: Mail, text: 'Email CA' }
            ],
            status: 'Active'
          },
          {
            name: 'Payment Reminder',
            trigger: { icon: Clock, text: 'Payment Overdue by 3 Days' },
            actions: [
              { icon: Mail, text: 'Draft Email Reminder' },
              { icon: User, text: 'Wait for My Approval' }
            ],
            status: 'Paused'
          }
        ].map((workflow, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-sm">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h3 className="text-lg font-medium text-[var(--theme-text)]">{workflow.name}</h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  workflow.status === 'Active' ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#6366F1]/15 text-[#6366F1]'
                }`}>
                  {workflow.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-[var(--theme-muted)]">
                <div className="flex items-center space-x-2 bg-[var(--theme-background)] px-3 py-1.5 rounded-md border border-[var(--theme-border)]">
                  <workflow.trigger.icon className="h-4 w-4 text-[var(--theme-muted)]" />
                  <span>{workflow.trigger.text}</span>
                </div>
                
                {workflow.actions.map((action, j) => (
                  <div key={j} className="flex items-center space-x-4">
                    <ArrowRight className="h-4 w-4 text-[var(--theme-muted)]" />
                    <div className="flex items-center space-x-2 bg-[var(--theme-background)] px-3 py-1.5 rounded-md border border-[var(--theme-border)] text-[var(--theme-text)]">
                      <action.icon className="h-4 w-4" />
                      <span>{action.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="ml-6">
              <button className="text-sm font-medium text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


