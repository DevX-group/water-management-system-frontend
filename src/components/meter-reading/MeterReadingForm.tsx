import '@/index.css';
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  meterNumber:        string;
  subscriptionNumber: string;
  previousReading:    string;
  currentReading:     string;
  readingDate:        string;
  notes:              string;
}

interface MeterReadingFormProps {
  formData:    FormData;
  submitting:  boolean;
  onChange:    (data: FormData) => void;
  onSubmit:    (e: React.FormEvent) => void;
  onClear:     () => void;
}

export const MeterReadingForm: React.FC<MeterReadingFormProps> = ({
  formData, submitting, onChange, onSubmit, onClear,
}) => {
  const usage = formData.previousReading && formData.currentReading      //
    ? Math.max(0, Number(formData.currentReading) - Number(formData.previousReading))
    : 0;

  return (
    <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md animate-slide-up">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meterNumber">Meter Number</Label>
            <Input id="meterNumber" placeholder="e.g., MTR-001" value={formData.meterNumber} required
              onChange={(e) => onChange({ ...formData, meterNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscriptionNumber">Subscription Number</Label>
            <Input id="subscriptionNumber" placeholder="e.g., SUB-0001" value={formData.subscriptionNumber} required
              onChange={(e) => onChange({ ...formData, subscriptionNumber: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="readingDate">Reading Date</Label>
          <Input id="readingDate" type="date" value={formData.readingDate} required
            onChange={(e) => onChange({ ...formData, readingDate: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="previousReading">Previous Reading</Label>
            <Input id="previousReading" type="number" min={0} placeholder="0" value={formData.previousReading} required
              onChange={(e) => onChange({ ...formData, previousReading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentReading">Current Reading</Label>
            <Input id="currentReading" type="number" min={0} placeholder="0" value={formData.currentReading} required
              onChange={(e) => onChange({ ...formData, currentReading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Usage (units)</Label>
            <div className="h-10 px-3 py-2 rounded-lg bg-secondary flex items-center">
              <span className="text-lg font-semibold text-primary">{usage}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" placeholder="Any observations or issues..." value={formData.notes} rows={3}
            onChange={(e) => onChange({ ...formData, notes: e.target.value })} />
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClear} disabled={submitting}>Clear form</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : <><Check className="w-4 h-4 mr-2" />Submit Reading</>}
          </Button>
        </div>
      </form>
    </div>
  );
};
