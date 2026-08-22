import '@/index.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, AlertOctagon, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const getSeverityStyles = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical": return { cardBg: "bg-card", borderColor: "border-red-500/20", textColor: "text-red-500", icon: AlertOctagon, iconColor: "text-red-500", iconBg: "bg-red-500/10", dismissBtn: "bg-red-500/10 text-red-500 hover:bg-red-500/20" };
    case "high": return { cardBg: "bg-card", borderColor: "border-orange-500/20", textColor: "text-orange-500", icon: AlertTriangle, iconColor: "text-orange-500", iconBg: "bg-orange-500/10", dismissBtn: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" };
    case "medium": return { cardBg: "bg-card", borderColor: "border-amber-500/20", textColor: "text-amber-500", icon: AlertTriangle, iconColor: "text-amber-500", iconBg: "bg-amber-500/10", dismissBtn: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" };
    default: return { cardBg: "bg-card", borderColor: "border-primary/20", textColor: "text-primary", icon: Info, iconColor: "text-primary", iconBg: "bg-primary/10", dismissBtn: "bg-primary/10 text-primary hover:bg-primary/20" };
  }
};

interface NotificationListProps {
  alerts:        any[];
  loading:       boolean;
  currentIndex:  number;
  itemsPerPage:  number;
  setCurrentIndex: (fn: (prev: number) => number) => void;
  onDismiss:     (id: number) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  alerts, loading, currentIndex, itemsPerPage, setCurrentIndex, onDismiss,
}) => {
  const { t } = useTranslation('alerts');
  return (
  <div className="space-y-3 max-w-4xl mx-auto">
    {loading ? (  // Show loading spinner while fetching alerts

      <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
    ) : alerts.slice(currentIndex, currentIndex + itemsPerPage).map((alert) => {
      const styles = getSeverityStyles(alert.severity);
      const Icon = styles.icon;
      return (
        <Card key={alert.id} className={`rounded-3xl border ${styles.borderColor} shadow-sm transition-all ${styles.cardBg}`}>
          <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${styles.iconBg} ${styles.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${styles.textColor}`}>{alert.title}</h3>
                <p className="text-muted-foreground text-sm mb-1">{alert.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/80">
                  {alert.usage && <span>Usage: {alert.usage}</span>}
                  <span>{new Date(alert.time).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => onDismiss(alert.id)} size="sm" className={`rounded-full px-5 h-8 font-medium shadow-none ${styles.dismissBtn}`}>
              {t('actions.dismiss')}
            </Button>
          </CardContent>
        </Card>
      );
    })}

    {alerts.length > itemsPerPage && (         // Show pagination controls if there are more alerts than items per page
      <div className="flex justify-center items-center gap-4 mt-8 pb-10">
        <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - itemsPerPage))} disabled={currentIndex === 0}>
          <ArrowLeft className="w-4 h-4 mr-1" /> {t('actions.previous')}
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} - {Math.min(currentIndex + itemsPerPage, alerts.length)} of {alerts.length}
        </span>
        <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm"
          onClick={() => setCurrentIndex(prev => Math.min(alerts.length - itemsPerPage, prev + itemsPerPage))}
          disabled={currentIndex + itemsPerPage >= alerts.length}>
          {t('actions.next')} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    )}

    {!loading && alerts.length === 0 && (      // Show empty state if no alerts found
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
        <p>{t('actions.noAlerts')}</p>
      </div>
    )}
  </div>
  );
};
