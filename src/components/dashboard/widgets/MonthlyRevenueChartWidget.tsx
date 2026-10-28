import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { formatMonthLabel } from '@/utils/monthTranslationUtils';

interface MonthData {
  month: string;
  usage: number;
  revenue: number;
}

export const MonthlyRevenueChartWidget: React.FC = () => {
  const { t, i18n } = useTranslation('widgetManagement');
  const currentLang = i18n.language || 'en';
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();
    api.get(`/reports/monthly?year=${year}`)
      .then((res) => {
        const monthly = Array.isArray(res.data) ? res.data : [];
        setData(monthly.map((m: any, i: number) => ({
          month: m.month ?? m.label ?? `M${i + 1}`,
          usage: m.usage ?? m.totalUsage ?? 0,
          revenue: m.revenue ?? m.totalAmount ?? m.totalRevenue ?? 0,
        })));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded" />;
  if (!data.length) return <p className="text-xs text-muted-foreground text-center py-4">{t('widgetContent.noData')}</p>;

  const chartData = data.map((d) => ({
    ...d,
    displayMonth: formatMonthLabel(d.month, currentLang),
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="displayMonth" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 8 }}
          formatter={(v: number, name: string) => [
            name === 'revenue' ? `${t('widgetContent.currency')} ${Number(v).toLocaleString()}` : `${v} ${t('widgetContent.units')}`,
            name === 'revenue' ? t('widgetContent.revenue') : t('widgetContent.usage'),
          ]}
        />
        <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

