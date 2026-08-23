import '@/index.css';
import React from "react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Activity, TrendingUp, TrendingDown, BarChart3,
  ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import { UsageStatsGrid } from "@/components/usage/UsageStatsGrid";
import { UsageChartCard } from "@/components/usage/UsageChartCard";

import type { MonthlyDataPoint, AnalyticsData } from '@/types/usage';

import { useUsage } from "@/hooks/useUsage";

const Usage = () => {
  const { t } = useTranslation('usage');
  const {
    activeChart,
    year,
    loading,
    error,
    monthlyData,
    pieData,
    stats,
    setActiveChart,
    incrementYear,
    decrementYear
  } = useUsage();

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h1>
            <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1 self-start sm:self-auto">
            <Button
              variant="ghost" size="icon" className="h-8 w-8"
              onClick={decrementYear}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold w-14 text-center">{year}</span>
            <Button
              variant="ghost" size="icon" className="h-8 w-8"
              onClick={incrementYear}
              disabled={loading || year >= new Date().getFullYear()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-8">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <UsageStatsGrid loading={loading} stats={stats} />

        <UsageChartCard 
          activeChart={activeChart} 
          setActiveChart={setActiveChart} 
          loading={loading} 
          monthlyData={monthlyData} 
          pieData={pieData} 
        />

      </div>
    </MainLayout>
  );
};

export default Usage;

