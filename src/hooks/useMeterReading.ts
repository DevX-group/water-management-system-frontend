import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import type { MeterReading, MeterReadingFormData } from '@/types/meter';
import { api } from '@/services/api';

const API_BASE = 'http://localhost:8081/api';
const OFFLINE_STORAGE_KEY = 'offline_meter_readings';
const OFFLINE_RATES_KEY = 'offline_rates';

const getLocalDateString = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const defaultForm = (): MeterReadingFormData => ({
  meterNumber: '', 
  subscriptionNumber: '',
  previousReading: '', 
  currentReading: '',
  readingDate: getLocalDateString(),
  notes: '',
});

export const useMeterReading = () => {
  const { t } = useTranslation('meterReading');
  const { toast } = useToast();
  const [formData, setFormData]   = useState<MeterReadingFormData>(defaultForm());
  const [todaysReadings, setTodaysReadings] = useState<MeterReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [editingId, setEditingId] = useState<string | null>(null);

  const effectiveIsOnline = isOnline && !isManualOffline;
  const getOfflineReadings = () => {
    const saved = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const updatePendingCount = useCallback(() => {
    setPendingCount(getOfflineReadings().length);
  }, []);
  const calculateEstimatedBill = (usageUnits: number) => {
    try {
      const ratesStr = localStorage.getItem(OFFLINE_RATES_KEY);
      if (!ratesStr) return usageUnits * 50; // Fallback
      
      const ratesList = JSON.parse(ratesStr);
      const rate = ratesList.find((r: any) => r.connectionType === 'metered') || ratesList[0];
      
      if (!rate) return usageUnits * 50;

      const base = Number(rate.baseRate || 0);
      const r1 = Number(rate.unitRateTier1 || 0);
      const r2 = Number(rate.unitRateTier2 || 0);
      const r3 = Number(rate.unitRateTier3 || 0);
      const limit1 = Number(rate.tier1Limit || 50);
      const limit2 = Number(rate.tier2Limit || 100);

      const tier1Units = Math.min(usageUnits, limit1);
      const tier2Units = Math.min(Math.max(usageUnits - limit1, 0), limit2 - limit1);
      const tier3Units = Math.max(usageUnits - limit2, 0);

      const usageCharge = (r1 * tier1Units) + (r2 * tier2Units) + (r3 * tier3Units);
      const subtotal = base + usageCharge;
      const tax = subtotal * Number(rate.taxRate || 0);

      return subtotal + tax;
    } catch (e) {
      return usageUnits * 50;
    }
  };
  const syncOfflineReadings = useCallback(async () => {
    const offlineReadings = getOfflineReadings();
    if (offlineReadings.length === 0) return;

    toast({ title: t('toasts.syncingTitle'), description: t('toasts.syncingDesc', { count: offlineReadings.length }) });

    let successCount = 0;
    const failedReadings = [];

    for (const payload of offlineReadings) {
      try {
        const res = await api.post('/meter-readings', payload);
        if (res.status === 200 || res.status === 201) {
          successCount++;
        } else {
          failedReadings.push(payload);
        }
      } catch (err) {
        failedReadings.push(payload);
      }
    }

    if (failedReadings.length < offlineReadings.length) {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(failedReadings));
      updatePendingCount();
      fetchTodaysReadings();
      toast({ title: t('toasts.syncCompleteTitle'), description: t('toasts.syncCompleteDesc', { count: successCount }) });
    } else if (offlineReadings.length > 0 && failedReadings.length === 0) {
      // All successful
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      updatePendingCount();
      fetchTodaysReadings();
      toast({ title: t('toasts.syncCompleteTitle'), description: t('toasts.syncCompleteDesc', { count: successCount }) });
    }
  }, [toast, updatePendingCount, t]);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: t('toasts.backOnlineTitle'), description: t('toasts.backOnlineDesc') });
      syncOfflineReadings();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: t('toasts.offlineActiveTitle'), description: t('toasts.offlineActiveDesc'), variant: 'destructive' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineReadings, toast, updatePendingCount, t]);
  // Fetches a list of all meter readings submitted today.
  const fetchTodaysReadings = async (dateOverride?: string) => {
    if (!isOnline) return; // Don't try to fetch if offline
    
    const targetDate = dateOverride || selectedDate;
    setLoadingReadings(true);
    try {
      api.get('/rates').then(res => {
        localStorage.setItem(OFFLINE_RATES_KEY, JSON.stringify(res.data));
      }).catch(() => {});

      const res = await api.get(`/meter-readings/today?date=${targetDate}`);
      const data = res.data;
      const offline = getOfflineReadings().map((r: any, i: number) => {
        const usage = Number(r.currentReading) - Number(r.previousReading);
        return {
          ...r,
          id: `offline-${Date.now()}-${i}`,
          usageUnits: usage,
          totalAmount: calculateEstimatedBill(usage),
          status: 'PENDING_OFFLINE'
        };
      });
      
      setTodaysReadings([...offline, ...data]);
    } catch {
      toast({ title: t('toasts.loadErrorTitle'), description: t('toasts.loadErrorDesc'), variant: 'destructive' });
    } finally {
      setLoadingReadings(false);
    }
  };

  useEffect(() => { fetchTodaysReadings(); }, [isOnline, selectedDate]);

  const fetchPreviousReading = async (meterNumber: string) => {
    if (!meterNumber || !isOnline) return;
    try {
      const res = await api.get(`/meter-readings/previous/${meterNumber}`);
      if (res.data) {
        if (formData.subscriptionNumber && res.data.subscriptionNumber && res.data.subscriptionNumber.toLowerCase() !== formData.subscriptionNumber.toLowerCase()) {
          toast({ title: 'Mismatch Error', description: `Meter ${meterNumber} belongs to subscription ${res.data.subscriptionNumber}, not ${formData.subscriptionNumber}.`, variant: 'destructive' });
          return;
        }
        
        if (res.data.currentReading) {
          setFormData(prev => ({ ...prev, previousReading: res.data.currentReading.toString() }));
          toast({ title: 'Previous Reading Found', description: `Auto-filled with last month's reading: ${res.data.currentReading}` });
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        toast({ title: 'Invalid Meter Number', description: `Meter number ${meterNumber} does not exist in the database.`, variant: 'destructive' });
      } else {
        console.log('Error fetching previous reading:', err);
      }
    }
  };

  const validateSubscription = async (subNumber: string) => {
    if (!subNumber || !isOnline) return;
    try {
      await api.get(`/customers/${subNumber}`);
      if (formData.meterNumber) {
        try {
          const res = await api.get(`/meter-readings/previous/${formData.meterNumber}`);
          if (res.data && res.data.subscriptionNumber && res.data.subscriptionNumber.toLowerCase() !== subNumber.toLowerCase()) {
            toast({ title: 'Mismatch Error', description: `Meter ${formData.meterNumber} does not belong to ${subNumber}. It belongs to ${res.data.subscriptionNumber}.`, variant: 'destructive' });
          }
        } catch (e: any) {
          if (e.response && e.response.status === 404) {
            toast({ title: 'Invalid Meter Number', description: `Meter number ${formData.meterNumber} does not exist in the database.`, variant: 'destructive' });
          }
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        toast({ title: 'Invalid Customer', description: `Customer with subscription number ${subNumber} does not exist in the database.`, variant: 'destructive' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.readingDate) {
      toast({ title: 'Validation Error', description: 'Reading date cannot be empty.', variant: 'destructive' });
      return;
    }
    
    const prev = Number(formData.previousReading);
    const curr = Number(formData.currentReading);
    
    if (prev < 0) {
      toast({ title: 'Validation Error', description: 'Previous reading cannot be negative.', variant: 'destructive' });
      return;
    }
    
    if (curr <= 0) {
      toast({ title: 'Validation Error', description: 'Current reading must be greater than 0.', variant: 'destructive' });
      return;
    }
    
    if (curr < prev) {
      toast({ title: 'Validation Error', description: 'Current reading cannot be less than the previous reading.', variant: 'destructive' });
      return;
    }
    
    setSubmitting(true);
    const payload = {
      meterNumber: formData.meterNumber, 
      subscriptionNumber: formData.subscriptionNumber,
      previousReading: prev, 
      currentReading: curr,
      readingDate: formData.readingDate, 
      imageUrl: formData.imageUrl,
      notes: formData.notes,
    };

    if (!isOnline) {
      let offlineReadings = getOfflineReadings();
      const usageUnits = payload.currentReading - payload.previousReading;
      const estimatedTotal = calculateEstimatedBill(usageUnits);
      
      const mockReading = {
        ...payload,
        id: editingId?.startsWith('offline-') ? editingId : `offline-${Date.now()}`,
        usageUnits,
        totalAmount: estimatedTotal,
        status: 'PENDING_OFFLINE'
      };

      if (editingId?.startsWith('offline-')) {
        offlineReadings = offlineReadings.map((r: any) => r.id === editingId ? mockReading : r);
      } else {
        offlineReadings.push(mockReading);
      }
      
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineReadings));
      updatePendingCount();

      toast({ 
        title: t('toasts.savedOfflineTitle'), 
        description: t('toasts.savedOfflineDesc', { meterNo: formData.meterNumber, usage: usageUnits, total: estimatedTotal.toFixed(2) })
      });
      
      clearForm();
      setSubmitting(false);
      
      // Update todaysReadings
      if (selectedDate === getLocalDateString()) {
        if (editingId?.startsWith('offline-')) {
          setTodaysReadings(prev => prev.map(r => (r as any).id === editingId ? mockReading as unknown as MeterReading : r));
        } else {
          setTodaysReadings(prev => [mockReading as unknown as MeterReading, ...prev]);
        }
      }
      
      return;
    }

    try {
      try {
        await api.get(`/customers/${formData.subscriptionNumber}`);
      } catch (validationErr: any) {
        if (validationErr.response && validationErr.response.status === 404) {
          toast({ title: 'Invalid Customer', description: `Customer with subscription number ${formData.subscriptionNumber} does not exist.`, variant: 'destructive' });
          setSubmitting(false);
          return;
        }
      }
      try {
        await api.get(`/meter-readings/previous/${formData.meterNumber}`);
      } catch (validationErr: any) {
        if (validationErr.response && validationErr.response.status === 404) {
          toast({ title: 'Invalid Meter Number', description: `Meter number ${formData.meterNumber} does not exist in the database.`, variant: 'destructive' });
          setSubmitting(false);
          return;
        }
      }
      const res = await api.post('/meter-readings', payload);
      const result = res.data;
      toast({ 
        title: t('toasts.submittedTitle'), 
        description: t('toasts.submittedDesc', { meterNo: formData.meterNumber, usage: result.usageUnits, billId: result.billId, total: Number(result.totalAmount).toFixed(2) })
      });
      setFormData(defaultForm());
      fetchTodaysReadings();
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK') {
        toast({ title: t('toasts.submissionFailedTitle', { defaultValue: 'Submission Failed' }), description: 'Network error. Saving offline.', variant: 'destructive' });
        const offlineReadings = getOfflineReadings();
        offlineReadings.push(payload);
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineReadings));
        updatePendingCount();
        fetchTodaysReadings();
      } else {
        toast({ title: 'Submission Failed', description: err.response.data?.message || 'Failed to submit meter reading.', variant: 'destructive' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (reading: any) => {
    setEditingId(reading.id || reading.readingId || null);
    setFormData({
      meterNumber: reading.meterNumber || '',
      subscriptionNumber: reading.subscriptionNumber || '',
      previousReading: reading.previousReading?.toString() || '',
      currentReading: reading.currentReading?.toString() || '',
      readingDate: reading.readingDate || getLocalDateString(),
      notes: reading.notes || '',
      imageUrl: reading.imageUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setFormData(defaultForm());
    setEditingId(null);
  };

  return {
    formData,
    todaysReadings,
    loadingReadings,
    submitting,
    isOnline,
    pendingCount,
    selectedDate,
    setSelectedDate,
    setFormData,
    handleEdit,
    handleSubmit,
    clearForm,
    fetchTodaysReadings,
    syncOfflineReadings,
    fetchPreviousReading,
    validateSubscription
  };
};
