import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface WidgetContainerProps {
  name: string;
  colSpan?: number;
  rowSpan?: number;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Card wrapper for all dashboard widgets.
 * Handles loading skeletons, error states, and grid sizing.
 *
 * Grid columns are driven by CSS variables set from the server-provided colSpan/rowSpan.
 */
export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  name,
  colSpan = 1,
  rowSpan = 1,
  children,
  loading = false,
  error = null,
  className,
}) => {
  const colStyle = `col-span-${Math.min(Math.max(colSpan, 1), 4)}`;
  const rowStyle = `row-span-${Math.min(Math.max(rowSpan, 1), 4)}`;

  return (
    <div
      className={cn(
        'glass rounded-2xl p-4 flex flex-col gap-2 min-h-[120px] transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5',
        colStyle,
        rowStyle,
        className
      )}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {/* Widget header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {name}
        </h3>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[80px]">
            <Loader2 className="w-5 h-5 animate-spin text-primary/60" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full min-h-[80px]">
            <p className="text-xs text-destructive text-center">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
