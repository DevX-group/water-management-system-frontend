import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

interface RegionStat {
  regionCode: string;
  regionName: string;
  customerCount: number;
}

export const RegionSummaryWidget: React.FC = () => {
  const { t } = useTranslation('widgetManagement');
  const [regions, setRegions] = useState<RegionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Use customers endpoint and aggregate by region client-side
    // (No server-side region aggregation endpoint exists yet)
    api.get('/customers')
      .then((res) => {
        const customers: any[] = res.data ?? [];
        const map = new Map<string, RegionStat>();
        customers.forEach((c) => {
          const code = c.region?.regionCode ?? 'UNKNOWN';
          const name = c.region?.regionName ?? code;
          if (!map.has(code)) {
            map.set(code, { regionCode: code, regionName: name, customerCount: 0 });
          }
          map.get(code)!.customerCount++;
        });
        const stats = Array.from(map.values()).sort((a, b) => b.customerCount - a.customerCount);
        setRegions(stats);
        setTotal(customers.length);
      })
      .catch(() => setRegions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded" />;
  if (!regions.length) return <p className="text-xs text-muted-foreground">{t('widgetContent.noRegionData')}</p>;

  return (
    <ul className="space-y-2">
      {regions.slice(0, 6).map((r) => {
        const pct = total > 0 ? Math.round((r.customerCount / total) * 100) : 0;
        return (
          <li key={r.regionCode}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="font-medium text-foreground">{r.regionName}</span>
              <span className="text-muted-foreground">{r.customerCount} ({pct}%)</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
