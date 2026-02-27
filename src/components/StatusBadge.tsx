import { Check, X, Clock, Lock, AlertTriangle } from 'lucide-react';

type StatusType = 'Active' | 'Inactive' | 'Passed' | 'Failed' | 'Pending' | 'Locked' | 'Quota Exceeded' | 'Approved' | 'Denied' | 'Submitted' | 'Graded' | 'Not submitted' | 'Completed' | 'Configured' | 'N/A';

const config: Record<string, { bg: string; text: string; icon?: React.ReactNode }> = {
  'Active': { bg: 'bg-status-active/10', text: 'text-status-active' },
  'Inactive': { bg: 'bg-status-inactive/10', text: 'text-status-inactive' },
  'Passed': { bg: 'bg-status-passed/10', text: 'text-status-passed', icon: <Check className="w-3 h-3" /> },
  'Completed': { bg: 'bg-status-passed/10', text: 'text-status-passed', icon: <Check className="w-3 h-3" /> },
  'Failed': { bg: 'bg-status-failed/10', text: 'text-status-failed', icon: <X className="w-3 h-3" /> },
  'Pending': { bg: 'bg-status-pending/10', text: 'text-status-pending', icon: <Clock className="w-3 h-3" /> },
  'Locked': { bg: 'bg-status-locked/10', text: 'text-status-locked', icon: <Lock className="w-3 h-3" /> },
  'Quota Exceeded': { bg: 'bg-status-quota/10', text: 'text-status-quota', icon: <AlertTriangle className="w-3 h-3" /> },
  'Approved': { bg: 'bg-status-approved/10', text: 'text-status-approved', icon: <Check className="w-3 h-3" /> },
  'Denied': { bg: 'bg-status-denied/10', text: 'text-status-denied', icon: <X className="w-3 h-3" /> },
  'Submitted': { bg: 'bg-secondary/10', text: 'text-secondary' },
  'Graded': { bg: 'bg-status-passed/10', text: 'text-status-passed', icon: <Check className="w-3 h-3" /> },
  'Not submitted': { bg: 'bg-status-inactive/10', text: 'text-status-inactive' },
  'Configured': { bg: 'bg-status-passed/10', text: 'text-status-passed', icon: <Check className="w-3 h-3" /> },
  'N/A': { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export default function StatusBadge({ status }: { status: StatusType | string }) {
  const c = config[status] || config['N/A'];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon}
      {status}
    </span>
  );
}
