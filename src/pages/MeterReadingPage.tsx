import React, { useState, useEffect } from 'react';
import { Info, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD

const API_BASE = 'http://localhost:8081/api';

interface TodayReading {
  readingId: number;
  meterNumber: string;
  customerName: string;
  subscriptionNumber: string;
  previousReading: number;
  currentReading: number;
  usageUnits: number;
  readingDate: string;
  billId: number | null;
  totalAmount: number | null;
  billStatus: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID:    'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

export const MeterReadingPage = () => {
=======
>>>>>>> 73509c63375328826c665b00e450e497866afd31

const API_BASE = 'http://localhost:8080/api';

interface TodayReading {
  readingId: number;
  meterNumber: string;
  customerName: string;
  subscriptionNumber: string;
  previousReading: number;
  currentReading: number;
  usageUnits: number;
  readingDate: string;
  billId: number | null;
  totalAmount: number | null;
  billStatus: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID:    'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

export const MeterReadingPage = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    meterNumber:        '',
    subscriptionNumber: '',
    previousReading:    '',
    currentReading:     '',
    readingDate:        new Date().toISOString().split('T')[0],
    notes:              '',
  });

  const [todaysReadings, setTodaysReadings] = useState<TodayReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [submitting, setSubmitting]           = useState(false);

  const usage =
    formData.previousReading && formData.currentReading
      ? Math.max(0, Number(formData.currentReading) - Number(formData.previousReading))
      : 0;

  // ── fetch today's readings ──────────────────────────────────────────
  const fetchTodaysReadings = async () => {
    setLoadingReadings(true);
    try {
      const res = await fetch(`${API_BASE}/meter-readings/today`);
      if (!res.ok) throw new Error('Failed to load readings');
      setTodaysReadings(await res.json());
    } catch {
      toast({ title: 'Error', description: "Could not load today's readings.", variant: 'destructive' });
    } finally {
      setLoadingReadings(false);
    }
  };

  useEffect(() => { fetchTodaysReadings(); }, []);

  // ── submit reading ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      meterNumber:        formData.meterNumber,
      subscriptionNumber: formData.subscriptionNumber,
      previousReading:    Number(formData.previousReading),
      currentReading:     Number(formData.currentReading),
      readingDate:        formData.readingDate,
      notes:              formData.notes,
    };

    try {
      const res = await fetch(`${API_BASE}/meter-readings`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Submission failed');
      }

      const result = await res.json();

      toast({
        title:       'Reading Submitted ✓',
        description: `Meter ${formData.meterNumber} — Usage: ${result.usageUnits} units | Bill #${result.billId}: LKR ${Number(result.totalAmount).toFixed(2)}`,
      });

      setFormData({
        meterNumber: '', subscriptionNumber: '',
        previousReading: '', currentReading: '',
        readingDate: new Date().toISOString().split('T')[0],
        notes: '',
      });

      fetchTodaysReadings(); // refresh table
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: err.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () =>
    setFormData({
      meterNumber: '', subscriptionNumber: '',
      previousReading: '', currentReading: '',
      readingDate: new Date().toISOString().split('T')[0],
      notes: '',
    });

  // ── render ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Meter Reading</h1>
        <p className="text-muted-foreground">Submit a water meter reading</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form ── */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Meter No + Subscription No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meterNumber">Meter Number</Label>
                <Input
                  id="meterNumber"
                  placeholder="e.g., MTR-001"
                  value={formData.meterNumber}
                  onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionNumber">Subscription Number</Label>
                <Input
                  id="subscriptionNumber"
                  placeholder="e.g., SUB-0001"
                  value={formData.subscriptionNumber}
                  onChange={(e) => setFormData({ ...formData, subscriptionNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="readingDate">Reading Date</Label>
              <Input
                id="readingDate"
                type="date"
                value={formData.readingDate}
                onChange={(e) => setFormData({ ...formData, readingDate: e.target.value })}
                required
              />
            </div>

            {/* Previous / Current / Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previousReading">Previous Reading</Label>
                <Input
                  id="previousReading"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formData.previousReading}
                  onChange={(e) => setFormData({ ...formData, previousReading: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentReading">Current Reading</Label>
                <Input
                  id="currentReading"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formData.currentReading}
                  onChange={(e) => setFormData({ ...formData, currentReading: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Usage (units)</Label>
                <div className="h-10 px-3 py-2 rounded-lg bg-secondary flex items-center">
                  <span className="text-lg font-semibold text-primary">{usage}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any observations or issues..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={handleClear} disabled={submitting}>
                Clear form
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                  : <><Check className="w-4 h-4 mr-2" />Submit Reading</>
                }
              </Button>
            </div>
          </form>
        </div>

        {/* ── Instructions ── */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">How to read your meter</h3>
          </div>
          <ul className="space-y-3">
            {[
              'Record all visible digits including zeros',
              'Ignore the red dial if present',
              'Read from left to right',
              'Take a photo for your records',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Today's Readings Table ── */}
      <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Today's Readings</h3>
          <Button variant="ghost" size="sm" onClick={fetchTodaysReadings} disabled={loadingReadings}>
            {loadingReadings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>

        {loadingReadings ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading readings...
          </div>
        ) : todaysReadings.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No readings submitted today yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  {['Meter No.', 'Customer', 'Subscription', 'Previous', 'Current', 'Usage', 'Bill Amount', 'Status'].map(h => (
                    <th key={h} className="pb-3 text-sm font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todaysReadings.map((r) => (
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
                      {r.totalAmount != null ? `LKR ${Number(r.totalAmount).toFixed(2)}` : '-'}
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
    </div>
  );
};