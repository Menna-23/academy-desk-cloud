import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'navy' | 'green' | 'orange';
}

const colorMap = {
  blue: 'bg-secondary/10 text-secondary',
  navy: 'bg-primary/10 text-primary',
  green: 'bg-status-active/10 text-status-active',
  orange: 'bg-status-pending/10 text-status-pending',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-5 shadow-card border border-border animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
          {trend && <p className="text-xs text-status-active mt-1">{trend}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
