import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { formatMonthLabel } from '@/utils/monthTranslationUtils';

interface UsageData {
  month: string;
  usage: number;
}

export const CustomerUsageTrendWidget: React.FC = () => {
  const { t, i18n } = useTranslation('widgetManagement');
  const currentLang = i18n.language || 'en';
  const [data, setData] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();
    api.get(`/analytics/usage/me?year=${year}`)  // customer-scoped endpoint via auth context
      .then((res) => {
        // Map analytics response to chart-friendly format
        const monthly = res.data?.monthlyData ?? res.data?.monthlyUsage ?? res.data?.data ?? [];
        const formatted: UsageData[] = monthly.map((m: any, idx: number) => ({
          month: m.month ?? m.name ?? m.label ?? `M${idx + 1}`,
          usage: m.usage ?? m.usageUnits ?? m.value ?? 0,
        }));
        setData(formatted);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded" />;
  if (!data.length) return <p className="text-xs text-muted-foreground text-center py-4">{t('widgetContent.noUsageData')}</p>;

  const chartData = data.map((d) => ({
    ...d,
    displayMonth: formatMonthLabel(d.month, currentLang),
  }));

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="displayMonth" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 8 }}
          formatter={(v: number) => [`${v} ${t('widgetContent.units')}`, t('widgetContent.usage')]}
        />
        <Area
          type="monotone"
          dataKey="usage"
          stroke="hsl(var(--primary))"
          fill="url(#usageGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

