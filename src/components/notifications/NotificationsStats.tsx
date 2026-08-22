import '@/index.css';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationsStatsProps {
  counts: {
    critical: number;
    high:     number;
    medium:   number;
    info:     number;
  };
}

export const NotificationsStats: React.FC<NotificationsStatsProps> = ({ counts }) => {
  const { t } = useTranslation('alerts');
  return (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { label: t('severity.critical'), count: counts.critical, color: "text-red-500", icon: AlertOctagon, bg: "bg-red-500/10" },
      { label: t('severity.high'),     count: counts.high,     color: "text-orange-500", icon: AlertTriangle, bg: "bg-orange-500/10" },
      { label: t('severity.medium'),   count: counts.medium,   color: "text-amber-500", icon: Info, bg: "bg-amber-500/10" },
      { label: t('severity.info'),     count: counts.info,     color: "text-primary", icon: Info, bg: "bg-primary/10" },
    ].map((stat, i) => {
      const Icon = stat.icon;
      return (
        <Card key={i} className="rounded-2xl border-none shadow-sm bg-card hover:shadow-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className={`text-xl font-bold ${stat.color}`}>{stat.count}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
  );
};

export const NotificationsFilter: React.FC<any> = ({ filter, setFilter }) => {
  const { t } = useTranslation('alerts');
  return (
  <div className="flex flex-col items-center justify-center w-full mt-4">
    <div className="bg-card p-1.5 rounded-2xl border shadow-sm flex flex-wrap justify-center gap-1.5">
      {[
        { id: "all",      label: t('severity.all'), hover: "hover:bg-secondary hover:text-foreground", active: "bg-primary text-primary-foreground" },
        { id: "critical", label: t('severity.critical'), hover: "hover:bg-red-500/10 hover:text-red-500",    active: "bg-red-500 text-white" },
        { id: "high",     label: t('severity.high'), hover: "hover:bg-orange-500/10 hover:text-orange-500", active: "bg-orange-500 text-white" },
        { id: "medium",   label: t('severity.medium'), hover: "hover:bg-amber-500/10 hover:text-amber-500",  active: "bg-amber-500 text-white" },
        { id: "info",     label: t('severity.info'), hover: "hover:bg-primary/10 hover:text-primary",    active: "bg-primary text-white" },
      ].map((lvl) => (
        <button
          key={lvl.id}
          onClick={() => setFilter(lvl.id)}
          className={`rounded-xl px-7 py-2.5 text-sm font-bold capitalize transition-all duration-300 ${
            filter === lvl.id
              ? `${lvl.active} shadow-md scale-105`
              : `text-muted-foreground ${lvl.hover}`
          }`}
        >
          {lvl.label}
        </button>
      ))}
    </div>
  </div>
  );
};


