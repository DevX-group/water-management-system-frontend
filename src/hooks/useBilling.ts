import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ConnectionType, ConnectionRate, BillResponse, BillingPageTab } from '@/types/billing';
import { INITIAL_RATES } from '@/utils/billingUtils';
import { api } from '@/services/api';

export const useBilling = () => {
  const { toast } = useToast();

  // Tab
  const [activeTab, setActiveTab] = useState<BillingPageTab>('calculator');

  // Calculator
  const [selectedType, setSelectedType] = useState<ConnectionType>('metered');
  const [usage, setUsage]               = useState(150);

  // Rates — loaded from backend
  const [rates, setRates] = useState<Record<ConnectionType, ConnectionRate>>(INITIAL_RATES);

  // Per-type edit state
  const [editingType, setEditingType] = useState<Partial<Record<ConnectionType, boolean>>>({});
  const [editDraft, setEditDraft]     = useState<Partial<Record<ConnectionType, Partial<ConnectionRate>>>>({});

  // View bills
  const [searchQuery, setSearchQuery]   = useState('');
  const [bills, setBills]               = useState<BillResponse[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [searchedSub, setSearchedSub]   = useState('');
  const [hasSearched, setHasSearched]   = useState(false);
  const [billIndex, setBillIndex]       = useState(0);
  const billsPerPage = 4;

  const selectedRate = rates[selectedType];

 
  //  maps the backend 'metered' and 'non_metered' rates into the frontend state.
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await api.get<ConnectionRate[]>('/rates');
        if (res.status >= 200 && res.status < 300) {
          const data = res.data;
          const newRates = { ...INITIAL_RATES };
          data.forEach(rate => {
            if (rate.connectionType === 'metered' || rate.connectionType === 'non_metered') {
              newRates[rate.connectionType] = rate;
            }
          });
          setRates(newRates);
        }
      } catch (err) {
        console.error('Failed to fetch rates:', err);
      }
    };
    fetchRates();
  }, []);

  // Edit helpers
  const startEditing = (type: ConnectionType) => {
    setEditDraft(prev => ({ ...prev, [type]: { ...rates[type] } }));
    setEditingType(prev => ({ ...prev, [type]: true }));
  };

  const cancelEditing = (type: ConnectionType) => {
    setEditDraft(prev => { const n = { ...prev }; delete n[type]; return n; });
    setEditingType(prev => ({ ...prev, [type]: false }));
  };

  const setDraftField = (type: ConnectionType, field: keyof ConnectionRate, raw: string) => {
    const value = parseFloat(raw);
    if (isNaN(value)) return;
    setEditDraft(prev => ({
      ...prev,
      [type]: { ...(prev[type] ?? rates[type]), [field]: value },
    }));
  };

 
  //  updates the global rates that determine how all future water bills are calculated.
  const handleSaveRates = async (type: ConnectionType, typeMeta: { label: string }) => {
    const draft = editDraft[type];
    if (!draft) return;
    const updatedRate = { ...rates[type], ...draft };
    try {
      const res = await api.post<ConnectionRate>('/rates', updatedRate);
      if (res.status >= 200 && res.status < 300) {
        const savedRate = res.data;
        setRates(prev => ({ ...prev, [type]: savedRate }));
        cancelEditing(type);
        toast({ title: 'Success', description: `${typeMeta.label} rates updated in database!` });
      } else {
        throw new Error('Failed to save rate');
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update rates', variant: 'destructive' });
    }
  };

  // Searches for a specific customer's billing history using their Subscription Number.
  
  const [searchedProfile, setSearchedProfile] = useState<any>(null);

  const handleSearch = async () => {
    const sub = searchQuery.trim();
    if (!sub) return;
    setLoadingBills(true);
    setHasSearched(true);
    setSearchedSub(sub);
    try {
      const res = await api.get<BillResponse[]>(`/bills/customer/${encodeURIComponent(sub)}`);
      setBills(res.data);
      // Fetch customer profile to display name/address/meter on bill
      try {
        const custRes = await api.get(`/customers/${encodeURIComponent(sub)}`);
        setSearchedProfile(custRes.data);
      } catch (custErr) {
        console.error('Failed to fetch customer profile', custErr);
        setSearchedProfile(null);
      }
    } catch (err: any) {
      toast({ title: 'Error', description:  'Could not fetch bills.', variant: 'destructive' });
      setBills([]);
      setSearchedProfile(null);
    } finally {
      setLoadingBills(false);
    }
  };

  // Admin function to download a customer's generated PDF bill.
 
  const handleDownload = async (billId: number) => {
    try {
      const response = await api.get(`/bills/${billId}/download`, { responseType: 'blob' });
      const blob = response.data as Blob;
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `bill-${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      toast({ title: 'Error', description: 'Failed to download bill.', variant: 'destructive' });
    }
  };

  return {
    activeTab, setActiveTab,
    selectedType, setSelectedType,
    usage, setUsage,
    rates, selectedRate,
    editingType, editDraft,
    startEditing, cancelEditing, setDraftField, handleSaveRates,
    searchQuery, setSearchQuery,
    bills, loadingBills, searchedProfile,
    searchedSub, hasSearched,
    billIndex, setBillIndex, billsPerPage,
    handleSearch, handleDownload,
  };
};
