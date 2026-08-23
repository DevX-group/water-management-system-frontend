import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard } from 'lucide-react';

interface QuickLinkWidgetProps {
  label: string;
  description?: string;
  to: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'primary' | 'accent' | 'default';
}

/**
 * Generic quick-link / action widget.
 * Used by all action-type widgets that simply navigate to a section.
 */
export const QuickLinkWidget: React.FC<QuickLinkWidgetProps> = ({
  label,
  description,
  to,
  icon: Icon = CreditCard,
  variant = 'primary',
}) => {
  const navigate = useNavigate();

  const variantStyles: Record<string, string> = {
    primary: 'from-primary/20 to-primary/5 hover:from-primary/30 border-primary/20 text-primary',
    accent: 'from-accent/20 to-accent/5 hover:from-accent/30 border-accent/20 text-accent',
    default: 'from-muted to-muted/50 hover:from-muted/80 border-border text-foreground',
  };

  return (
    <button
      onClick={() => navigate(to)}
      className={`
        w-full h-full flex items-center justify-between gap-3 p-2 rounded-xl
        bg-gradient-to-br border transition-all duration-200 group
        ${variantStyles[variant]}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-current/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
};
