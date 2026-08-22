import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';

interface MonthData {
  month: string;
  usage: number;
}

export const SystemUsageChartWidget: React.FC = () => {
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();
    api.get(`/analytics/usage?year=${year}`)
      .then((res) => {
        const monthly = res.data?.monthlyUsage ?? res.data?.data ?? [];
        setData(monthly.map((m: any, i: number) => ({
          month: m.month ?? m.label ?? `M${i + 1}`,
          usage: m.usage ?? m.usageUnits ?? m.value ?? 0,
        })));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded" />;
  if (!data.length) return <p className="text-xs text-muted-foreground text-center py-4">No data.</p>;

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 8 }}
          formatter={(v: number) => [`${v} units`, 'Usage']}
        />
        <Bar dataKey="usage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
