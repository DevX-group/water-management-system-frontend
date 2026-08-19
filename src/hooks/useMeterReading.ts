import { useState, useEffect, useCallback } from 'react';
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
  const { toast } = useToast();
  const [formData, setFormData]   = useState<MeterReadingFormData>(defaultForm());
  const [todaysReadings, setTodaysReadings] = useState<MeterReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const effectiveIsOnline = isOnline && !isManualOffline;

  // Load pending offline readings from local storage
  const getOfflineReadings = () => {
    const saved = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const updatePendingCount = useCallback(() => {
    setPendingCount(getOfflineReadings().length);
  }, []);

  // Calculate bill using tiers based on cached rates
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

  // Sync offline readings to the backend
  const syncOfflineReadings = useCallback(async () => {
    const offlineReadings = getOfflineReadings();
    if (offlineReadings.length === 0) return;

    toast({ title: 'Syncing...', description: `Uploading ${offlineReadings.length} saved readings.` });

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
      toast({ title: 'Sync Complete', description: `Successfully uploaded ${successCount} readings.` });
    } else if (offlineReadings.length > 0 && failedReadings.length === 0) {
      // All successful
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      updatePendingCount();
      fetchTodaysReadings();
      toast({ title: 'Sync Complete', description: `Successfully uploaded ${successCount} readings.` });
    }
  }, [toast, updatePendingCount]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: 'Back Online', description: 'Internet connection restored.' });
      syncOfflineReadings();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: 'Offline Mode Active', description: 'Readings will be saved locally.', variant: 'destructive' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineReadings, toast, updatePendingCount]);

  // Fetches a list of all meter readings submitted today.
  const fetchTodaysReadings = async () => {
    if (!isOnline) return; // Don't try to fetch if offline
    
    setLoadingReadings(true);
    try {
      // Also fetch and cache latest rates for offline mode
      api.get('/rates').then(res => {
        localStorage.setItem(OFFLINE_RATES_KEY, JSON.stringify(res.data));
      }).catch(() => {});

      const res = await api.get('/meter-readings/today');
      const data = res.data;
      
      // Merge offline mock readings with real online readings for display
      const offline = getOfflineReadings().map((r: any, i: number) => {
        const usage = Number(r.currentReading) - Number(r.previousReading);
        return {
          ...r,
          id: `offline-${Date.now()}-${i}`,
          usageUnits: usage,
          totalAmount: calculateEstimatedBill(usage),
          status: 'PENDING SYNC (OFFLINE)'
        };
      });
      
      setTodaysReadings([...offline, ...data]);
    } catch {
      toast({ title: 'Error', description: "Could not load today's readings.", variant: 'destructive' });
    } finally {
      setLoadingReadings(false);
    }
  };

  useEffect(() => { fetchTodaysReadings(); }, [isOnline]);

  const fetchPreviousReading = async (meterNumber: string) => {
    if (!meterNumber || !isOnline) return;
    try {
      const res = await api.get(`/meter-readings/previous/${meterNumber}`);
      if (res.data && res.data.currentReading) {
        setFormData(prev => ({ ...prev, previousReading: res.data.currentReading.toString() }));
        toast({ title: 'Previous Reading Found', description: `Auto-filled with last month's reading: ${res.data.currentReading}` });
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        toast({ title: 'No Previous Reading', description: `Could not find a previous bill for meter ${meterNumber}.`, variant: 'destructive' });
      } else {
        console.log('Error fetching previous reading:', err);
      }
    }
  };

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

    if (!isOnline) {
      // OFFLINE MODE: Save to local storage
      const offlineReadings = getOfflineReadings();
      offlineReadings.push(payload);
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineReadings));
      updatePendingCount();
      
      // Calculate offline bill
      const usageUnits = payload.currentReading - payload.previousReading;
      const estimatedTotal = calculateEstimatedBill(usageUnits);

      toast({ 
        title: 'Saved Offline 📶', 
        description: `Meter ${formData.meterNumber} — Usage: ${usageUnits} units | Est. Bill: LKR ${estimatedTotal.toFixed(2)}` 
      });
      
      setFormData(defaultForm());
      setSubmitting(false);
      
      // Add immediately to UI
      const mockReading = {
        ...payload,
        id: `offline-${Date.now()}`,
        usageUnits,
        totalAmount: estimatedTotal,
        status: 'PENDING SYNC (OFFLINE)'
      };
      setTodaysReadings(prev => [mockReading as unknown as MeterReading, ...prev]);
      
      return;
    }

    try {
      // ONLINE MODE: Submit to the backend
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
      // If network fails unexpectedly while "online", fallback to offline save
      const offlineReadings = getOfflineReadings();
      offlineReadings.push(payload);
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineReadings));
      updatePendingCount();
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
    isOnline,
    pendingCount,
    setFormData,
    handleSubmit,
    clearForm,
    fetchTodaysReadings,
    syncOfflineReadings,
    fetchPreviousReading
  };
};
