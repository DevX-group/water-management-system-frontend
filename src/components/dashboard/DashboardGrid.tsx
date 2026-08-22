import React, { useEffect, useState } from 'react';
import { getDashboardConfig } from '@/services/dashboardService';
import type { DashboardConfig } from '@/types/dashboard';
import { WidgetContainer } from './WidgetContainer';
import { WidgetRenderer } from './WidgetRenderer';
import { Loader2, LayoutDashboard } from 'lucide-react';

interface DashboardGridProps {
  /** Override the greeting — if omitted, uses the dashboard name. */
  greeting?: string;
  /** Optional subtitle shown below the greeting. */
  subtitle?: string;
}

/**
 * Responsive CSS grid that loads the role-appropriate dashboard configuration
 * from the backend and renders each widget via the WidgetRenderer.
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({ greeting, subtitle }) => {
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardConfig()
      .then(setConfig)
      .catch(() => setError('Failed to load dashboard configuration. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
        <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <LayoutDashboard className="w-10 h-10 opacity-40" />
        <p className="text-sm">{error ?? 'No dashboard configuration found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-gradient mb-1">
          {greeting ?? config.name}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Widget Grid */}
      <div
        className="grid gap-4 w-full"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        }}
      >
        {config.widgets.map((widget) => (
          <WidgetContainer
            key={widget.id}
            name={widget.name}
            colSpan={widget.colSpan}
            rowSpan={widget.rowSpan}
          >
            <WidgetRenderer
              componentKey={widget.componentKey}
              name={widget.name}
              configJson={widget.configJson}
            />
          </WidgetContainer>
        ))}
      </div>
    </div>
  );
};
