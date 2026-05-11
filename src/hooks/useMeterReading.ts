import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { MeterReading, MeterReadingFormData } from '@/types/meter';

const API_BASE = 'http://localhost:8081/api';

const defaultForm = (): MeterReadingFormData => ({
  meterNumber: '', 
  subscriptionNumber: '',
  previousReading: '', 
  currentReading: '',
  readingDate: new Date().toISOString().split('T')[0],
  notes: '',
});

export const useMeterReading = () => {
  const { toast } = useToast();
  const [formData, setFormData]   = useState<MeterReadingFormData>(defaultForm());
  const [todaysReadings, setTodaysReadings] = useState<MeterReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [submitting, setSubmitting]           = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      meterNumber: formData.meterNumber, 
      subscriptionNumber: formData.subscriptionNumber,
      previousReading: Number(formData.previousReading), 
      currentReading: Number(formData.currentReading),
      readingDate: formData.readingDate, 
      notes: formData.notes,
    };
    try {
      const res = await fetch(`${API_BASE}/meter-readings`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text() || 'Submission failed');
      const result = await res.json();
      toast({ 
        title: 'Reading Submitted ✓', 
        description: `Meter ${formData.meterNumber} — Usage: ${result.usageUnits} units | Bill #${result.billId}: LKR ${Number(result.totalAmount).toFixed(2)}` 
      });
      setFormData(defaultForm());
      fetchTodaysReadings();
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const clearForm = () => setFormData(defaultForm());

  return {
    formData,
    todaysReadings,
    loadingReadings,
    submitting,
    setFormData,
    handleSubmit,
    clearForm,
    fetchTodaysReadings
  };
};
