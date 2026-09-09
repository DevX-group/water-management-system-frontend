import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: string;
  time: string;
}

const severityIcon = (sev: string) => {
  const s = sev.toLowerCase();
  if (s === 'critical' || s === 'error') return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  if (s === 'warning') return <AlertCircle className="w-3.5 h-3.5 text-warning" />;
  if (s === 'info') return <Info className="w-3.5 h-3.5 text-primary" />;
  return <CheckCircle className="w-3.5 h-3.5 text-success" />;
};

export const ActiveAlertsWidget: React.FC = () => {
  const { t } = useTranslation('widgetManagement');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/alerts')
      .then((res) => setAlerts((res.data ?? []).slice(0, 5)))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-16 bg-muted rounded" />;

  if (!alerts.length) {
    return (
      <div className="flex items-center gap-2 text-success text-xs">
        <CheckCircle className="w-4 h-4" />
        {t('widgetContent.noActiveAlerts')}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 max-h-[160px] overflow-y-auto">
      {alerts.map((a) => (
        <li key={a.id} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/40">
          {severityIcon(a.severity)}
          <div className="flex-1 min-w-0">
            <p className="text-foreground leading-snug">{a.title}</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              {new Date(a.time).toLocaleTimeString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
