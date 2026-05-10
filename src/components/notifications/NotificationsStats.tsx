import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, AlertOctagon } from 'lucide-react';

interface NotificationsStatsProps {
  counts: {
    critical: number;
    high:     number;
    medium:   number;
    info:     number;
  };
}

export const NotificationsStats: React.FC<NotificationsStatsProps> = ({ counts }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[
      { label: "Critical", count: counts.critical, color: "text-red-600" },
      { label: "High",     count: counts.high,     color: "text-orange-600" },
      { label: "Medium",   count: counts.medium,   color: "text-amber-600" },
      { label: "Info",     count: counts.info,     color: "text-blue-600" },
    ].map((stat, i) => (
      <Card key={i} className="rounded-3xl border-none shadow-sm bg-white">
        <CardContent className="flex flex-col items-center justify-center py-6">
          <span className="capitalize text-slate-500 font-medium mb-1 text-sm">{stat.label}</span>
          <span className={`text-3xl font-bold ${stat.color}`}>{stat.count}</span>
        </CardContent>
      </Card>
    ))}
  </div>
);

interface NotificationsFilterProps {
  filter:    string;
  setFilter: (f: string) => void;
}

export const NotificationsFilter: React.FC<NotificationsFilterProps> = ({ filter, setFilter }) => (
  <Card className="rounded-full border-none shadow-sm mb-8 bg-white mx-auto max-w-4xl">
    <CardContent className="p-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold px-6 text-slate-700 hidden sm:block">Filter by severity:</span>
        <div className="flex flex-wrap justify-center gap-1 w-full sm:w-auto">
          {["all", "critical", "high", "medium", "info"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`rounded-full px-6 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === lvl
                  ? (lvl === 'all' ? 'bg-slate-800 text-white' : `bg-${lvl === 'critical' ? 'red' : lvl === 'high' ? 'orange' : lvl === 'medium' ? 'amber' : 'blue'}-500 text-white`)
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
