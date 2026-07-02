import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { MeterReading, MeterReadingFormData } from '@/types/meter';
import { api } from '@/services/api';

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

  // Fetches a list of all meter readings  submitted today.
 
  const fetchTodaysReadings = async () => {
    setLoadingReadings(true);
    try {
      const res = await api.get<MeterReading[]>('/meter-readings/today');
      setTodaysReadings(res.data);
    } catch {
      toast({ title: 'Error', description: "Could not load today's readings.", variant: 'destructive' });
    } finally {
      setLoadingReadings(false);
    }
  };

  useEffect(() => { fetchTodaysReadings(); }, []);

 
  // and dynamically generates a new Bill based on the current rates in the database
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
    try {             // Submits the reading to the backend
      const res = await api.post('/meter-readings', payload);
      const result = res.data;
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
