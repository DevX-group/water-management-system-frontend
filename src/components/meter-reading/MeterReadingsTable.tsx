import '@/index.css';
import React from 'react';
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
}

export const MeterReadingsTable: React.FC<MeterReadingsTableProps> = ({ readings, loading, onRefresh }) => (
  <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-foreground">Today's Readings</h3>
      <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
      </Button>
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading readings...
      </div>
    ) : readings.length === 0 ? (
      <p className="text-center text-muted-foreground py-10">No readings submitted today yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">      // Table of today's meter readings 
          <thead>
            <tr className="text-left border-b border-border">
              {['Meter No.', 'Customer', 'Subscription', 'Previous', 'Current', 'Usage', 'Bill Amount', 'Status'].map(h => (
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
                    {r.usageUnits} units
                  </span>
                </td>
                <td className="py-4 text-sm text-foreground">
                  {r.totalAmount != null ? `LKR ${Number(r.totalAmount).toFixed(2)}` : '-'}      // Show bill amount if available, otherwise show '-'
                </td>
                <td className="py-4">
                  {r.billStatus ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.billStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {r.billStatus}
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
