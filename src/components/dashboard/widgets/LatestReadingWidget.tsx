import React, { useEffect, useState } from 'react';
import { Gauge, Calendar } from 'lucide-react';
import { api } from '@/services/api';

interface Reading {
  id: string;
  subscriptionNumber: string;
  usageUnits: number;
  readingDate: string;
  status: string;
}

export const LatestReadingWidget: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/meter-readings/today')
      .then((res) => setReadings(Array.isArray(res.data) ? res.data.slice(0, 5) : []))
      .catch(() => setReadings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-16 bg-muted rounded" />;

  if (!readings.length) {
    return (
      <div className="flex flex-col items-center gap-1 text-muted-foreground py-4">
        <Calendar className="w-4 h-4" />
        <span className="text-xs">No readings today</span>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {readings.map((r: any) => (
        <li key={r.readingId || r.meterNumber} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono font-medium">{r.subscriptionNumber}</span>
          </div>
          <span className="font-bold text-foreground">{r.usageUnits} <span className="text-muted-foreground font-normal">units</span></span>
        </li>
      ))}
    </ul>
  );
};
