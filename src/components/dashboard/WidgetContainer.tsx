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
  style?: React.CSSProperties;
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
  style,
}) => {
  const colSpanMap: Record<number, string> = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
  };
  
  const rowSpanMap: Record<number, string> = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  };

  const colStyle = colSpanMap[Math.min(Math.max(colSpan, 1), 4)] || 'md:col-span-1';
  const rowStyle = rowSpanMap[Math.min(Math.max(rowSpan, 1), 4)] || 'row-span-1';

  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-xl border p-4 flex flex-col gap-2 min-h-[120px] transition-all duration-300',
        'hover:shadow-md col-span-1',
        colStyle,
        rowStyle,
        className
      )}
      style={style}
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
          <WidgetErrorBoundary name={name}>
            {children}
          </WidgetErrorBoundary>
        )}
      </div>
    </div>
  );
};

// Internal Error Boundary class for widgets
class WidgetErrorBoundary extends React.Component<{name: string, children: React.ReactNode}, {hasError: boolean, errorMsg: string}> {
  constructor(props: {name: string, children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[80px]">
          <p className="text-xs text-destructive text-center">Failed to load widget preview.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
