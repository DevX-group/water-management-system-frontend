import '@/index.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TodayReading {
  readingId:          number;
  meterNumber:        string;
  customerName:       string;
  subscriptionNumber: string;
  previousReading:    number;
  currentReading:     number;
  usageUnits:         number;
  totalAmount:        number | null;
  billStatus:         string | null;
  imageUrl?:          string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID:    'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

interface MeterReadingsTableProps {
  readings:       TodayReading[];
  loading:        boolean;
  onRefresh:      () => void;
  selectedDate:   string;
  onDateChange:   (date: string) => void;
}

export const MeterReadingsTable: React.FC<MeterReadingsTableProps> = ({ readings, loading, onRefresh, selectedDate, onDateChange }) => {
  const { t } = useTranslation('meterReading');
  
  return (
  <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-foreground">{t('table.title')}</h3>
        <input 
          type="date" 
          value={selectedDate} 
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            if (e.target.value) {
              onDateChange(e.target.value);
            }
          }}
          className="px-3 py-1.5 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="hover:bg-secondary hover:text-foreground">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('table.refresh')}
      </Button>
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> {t('table.loading')}
      </div>
    ) : readings.length === 0 ? (
      <p className="text-center text-muted-foreground py-10">{t('table.noReadings')}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">      {/* Table of today's meter readings */} 
          <thead>
            <tr className="text-left border-b border-border">
              {[t('table.headers.meterNo'), t('table.headers.customer'), t('table.headers.subscription'), t('table.headers.previous'), t('table.headers.current'), t('table.headers.usage'), t('table.headers.billAmount'), 'Image', t('table.headers.status')].map(h => (
                <th key={h} className="pb-3 text-sm font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.readingId} className="border-b border-border/50 last:border-0">
                <td className="py-4 text-sm font-medium text-foreground">{r.meterNumber}</td>
                <td className="py-4 text-sm text-foreground">{r.customerName || '-'}</td>
                <td className="py-4 text-sm text-muted-foreground">{r.subscriptionNumber || '-'}</td>
                <td className="py-4 text-sm text-muted-foreground">{r.previousReading}</td>
                <td className="py-4 text-sm text-muted-foreground">{r.currentReading}</td>
                <td className="py-4">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {r.usageUnits} {t('table.units')}
                  </span>
                </td>
                <td className="py-4 text-sm text-foreground">
                  {r.totalAmount != null ? `LKR ${Number(r.totalAmount).toFixed(2)}` : '-'}
                </td>
                <td className="py-4">
                  {r.imageUrl ? (
                    <a href={r.imageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium text-xs">
                      View
                    </a>
                  ) : '-'}
                </td>
                <td className="py-4">
                  {r.billStatus ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.billStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {t(`status.${r.billStatus.toUpperCase()}`, { defaultValue: r.billStatus })}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
};
