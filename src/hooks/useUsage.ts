import { useState, useEffect } from "react";
import type { MonthlyDataPoint, AnalyticsData } from '@/types/usage';
import { Activity, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { api } from '@/services/api';
import { useTranslation } from "react-i18next";

export const useUsage = () => {
  const { t } = useTranslation('usage');
  const [activeChart, setActiveChart] = useState<"bar" | "pie" | "mix">("bar");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches  yearly water usage analytics from the backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<AnalyticsData>(`/analytics/usage/me?year=${year}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.message ?? "Failed to load usage data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [year]);

  const monthlyData = data?.monthlyData ?? [];
  
  const pieData = monthlyData.map((item, index) => ({
    name: item.name,
    value: item.usage,
    color: `hsl(var(--primary) / ${1 - (index % 5) * 0.15})` 
  }));

  const stats = data
    ? [
        { label: t('stats.average', 'Average Usage'), value: `${data.averageUsage.toLocaleString()} ${t('stats.units', 'units')}`, icon: Activity },
        { label: t('stats.peak', 'Peak Usage'),     value: `${data.peakUsage.toLocaleString()} ${t('stats.units', 'units')}`,    icon: TrendingUp },
        { label: t('stats.minimum', 'Minimum Usage'), value: `${data.minimumUsage.toLocaleString()} ${t('stats.units', 'units')}`, icon: TrendingDown },
        { label: t('stats.total', 'Total Usage'),   value: `${data.totalUsage.toLocaleString()} ${t('stats.units', 'units')}`,   icon: BarChart3 },
      ]
    : [];

  const incrementYear = () => setYear(y => y + 1);
  const decrementYear = () => setYear(y => y - 1);

  return {
    activeChart,
    year,
    data,
    loading,
    error,
    monthlyData,
    pieData,
    stats,
    setActiveChart,
    incrementYear,
    decrementYear
  };
};
