import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WidgetUnavailableProps {
  widgetKey?: string;
  reason?: string;
}

/**
 * Rendered when a widget key is unknown or the widget is inactive.
 * Provides a non-breaking fallback so the rest of the dashboard remains functional.
 */
export const WidgetUnavailable: React.FC<WidgetUnavailableProps> = ({
  widgetKey,
  reason,
}) => {
  const { t } = useTranslation('widgetManagement');
  const displayReason = reason ?? t('grid.unavailable');

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80px] gap-2 text-muted-foreground">
      <AlertTriangle className="w-5 h-5 text-warning" />
      <p className="text-xs text-center">{displayReason}</p>
      {widgetKey && (
        <p className="text-[10px] font-mono opacity-50">{widgetKey}</p>
      )}
    </div>
  );
};

