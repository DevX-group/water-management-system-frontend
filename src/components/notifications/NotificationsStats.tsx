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
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { label: "Critical", count: counts.critical, color: "text-red-500", icon: AlertOctagon, bg: "bg-red-50" },
      { label: "High",     count: counts.high,     color: "text-orange-500", icon: AlertTriangle, bg: "bg-orange-50" },
      { label: "Medium",   count: counts.medium,   color: "text-amber-500", icon: Info, bg: "bg-amber-50" },
      { label: "Info",     count: counts.info,     color: "text-blue-500", icon: Info, bg: "bg-blue-50" },
    ].map((stat, i) => {
      const Icon = stat.icon;
      return (
        <Card key={i} className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className={`text-xl font-bold ${stat.color}`}>{stat.count}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

export const NotificationsFilter: React.FC<NotificationsFilterProps> = ({ filter, setFilter }) => (
  <div className="flex flex-col items-center justify-center w-full mt-4">
    <div className="bg-white p-1.5 rounded-2xl border shadow-sm flex flex-wrap justify-center gap-1.5">
      {[
        { id: "all",      hover: "hover:bg-slate-100 hover:text-slate-900", active: "bg-primary text-primary-foreground" },
        { id: "critical", hover: "hover:bg-red-50 hover:text-red-600",    active: "bg-red-500 text-white" },
        { id: "high",     hover: "hover:bg-orange-50 hover:text-orange-600", active: "bg-orange-500 text-white" },
        { id: "medium",   hover: "hover:bg-amber-50 hover:text-amber-600",  active: "bg-amber-500 text-white" },
        { id: "info",     hover: "hover:bg-blue-50 hover:text-blue-600",    active: "bg-blue-500 text-white" },
      ].map((lvl) => (
        <button
          key={lvl.id}
          onClick={() => setFilter(lvl.id)}
          className={`rounded-xl px-7 py-2.5 text-sm font-bold capitalize transition-all duration-300 ${
            filter === lvl.id
              ? `${lvl.active} shadow-md scale-105`
              : `text-slate-600 ${lvl.hover}`
          }`}
        >
          {lvl.id}
        </button>
      ))}
    </div>
  </div>
);


