
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number;
  variant?: 'default' | 'primary' | 'success' | 'accent';
  delay?: number;
}

const variantStyles: Record<string, string> = {
  default: 'bg-card',
  primary: 'bg-gradient-to-br from-primary/10 to-primary/5',
  success: 'bg-gradient-to-br from-success/10 to-success/5',
  accent: 'bg-gradient-to-br from-accent/10 to-accent/5',
};

const iconBgStyles: Record<string, string> = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  accent: 'bg-accent/20 text-accent',
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default', 
  delay = 0 
}) => {
  const isPositiveTrend = trend && trend > 0;
  const TrendIcon = trend ? (isPositiveTrend ? TrendingUp : TrendingDown) : Minus;

  return (
    <div 
      className={cn(
        "rounded-2xl p-5 shadow-md transition-all duration-300 hover:shadow-lg animate-slide-up",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            {trend !== undefined && (
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositiveTrend ? "text-success" : "text-destructive"
              )}>
                <TrendIcon className="w-3 h-3" />
                {Math.abs(trend)}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
