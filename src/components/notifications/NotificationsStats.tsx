import '@/index.css';
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
<<<<<<< Updated upstream
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
=======
      { label: "Critical", count: counts.critical, color: "text-red-500", icon: AlertOctagon, bg: "bg-red-50" },
      { label: "High",     count: counts.high,     color: "text-orange-500", icon: AlertTriangle, bg: "bg-orange-50" },
      { label: "Medium",   count: counts.medium,   color: "text-amber-500", icon: Info, bg: "bg-amber-50" },
      { label: "Info",     count: counts.info,     color: "text-primary", icon: Info, bg: "bg-blue-50" },
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
>>>>>>> Stashed changes
  </div>
);

interface NotificationsFilterProps {
  filter:    string;
  setFilter: (f: string) => void;
}

export const NotificationsFilter: React.FC<NotificationsFilterProps> = ({ filter, setFilter }) => (
<<<<<<< Updated upstream
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
=======
  <div className="flex flex-col items-center justify-center w-full mt-4">
    <div className="bg-white p-1.5 rounded-2xl border shadow-sm flex flex-wrap justify-center gap-1.5">
      {[
        { id: "all",      hover: "hover:bg-slate-100 hover:text-slate-900", active: "bg-primary text-primary-foreground" },
        { id: "critical", hover: "hover:bg-red-50 hover:text-red-600",    active: "bg-red-500 text-white" },
        { id: "high",     hover: "hover:bg-orange-50 hover:text-orange-600", active: "bg-orange-500 text-white" },
        { id: "medium",   hover: "hover:bg-amber-50 hover:text-amber-600",  active: "bg-amber-500 text-white" },
        { id: "info",     hover: "hover:bg-blue-50 hover:text-primary",    active: "bg-primary text-white" },
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
>>>>>>> Stashed changes
);
