import React, { useEffect, useState } from 'react';
import { Users, BadgeCheck, AlertTriangle, DollarSign, FileText, MessageSquare } from 'lucide-react';
import { getSystemSummary } from '@/services/dashboardService';
import type { SystemDashboardSummary } from '@/types/dashboard';
import { useTranslation } from 'react-i18next';

export const SystemSummaryWidget: React.FC = () => {
  const { t } = useTranslation('widgetManagement');
  const [data, setData] = useState<SystemDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemSummary()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse h-16 bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-xs text-destructive">{t('loadError')}</p>;

  const stats = [
    {
      label: t('widgetContent.customers'),
      value: data.customerCount.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: t('widgetContent.pendingSlips'),
      value: data.pendingSlipCount.toLocaleString(),
      icon: FileText,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: t('widgetContent.outstanding'),
      value: `${t('widgetContent.currency')} ${Math.round(data.outstandingAmount).toLocaleString()}`,
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      label: t('widgetContent.paidThisMonth'),
      value: `${t('widgetContent.currency')} ${Math.round(data.paidThisMonth).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: t('widgetContent.openInquiries'),
      value: data.openInquiryCount.toLocaleString(),
      icon: MessageSquare,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: t('widgetContent.adminUsers'),
      value: data.activeAdminCount.toLocaleString(),
      icon: BadgeCheck,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 ${s.bg}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg}`}>
            <s.icon className={`w-4 h-4 ${s.color}`} />
          </div>
          <span className="text-base font-bold text-foreground">{s.value}</span>
          <span className="text-[10px] text-muted-foreground text-center">{s.label}</span>
        </div>
      ))}
    </div>
  );
};
