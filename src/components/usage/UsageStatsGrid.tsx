import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface UsageStatsGridProps {
  loading: boolean;
  stats: any[];
}

export const UsageStatsGrid: React.FC<UsageStatsGridProps> = ({ loading, stats }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-card border-none animate-pulse">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-5 bg-slate-200 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        stats.map((stat, i) => (
          <Card key={i} className="shadow-card border-none">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
