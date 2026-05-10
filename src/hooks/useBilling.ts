import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ConnectionType, ConnectionRate, BillResponse, BillingPageTab } from '@/types/billing';
import { INITIAL_RATES, API_BASE } from '@/utils/billingUtils';

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

  // Fetch rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE}/rates`);
        if (res.ok) {
          const data: ConnectionRate[] = await res.json();
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

  const handleSaveRates = async (type: ConnectionType, typeMeta: { label: string }) => {
    const draft = editDraft[type];
    if (!draft) return;
    const updatedRate = { ...rates[type], ...draft };
    try {
      const res = await fetch(`${API_BASE}/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRate),
      });
      if (res.ok) {
        const savedRate = await res.json();
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

  // Search bills
  const handleSearch = async () => {
    const sub = searchQuery.trim();
    if (!sub) return;
    setLoadingBills(true);
    setHasSearched(true);
    setSearchedSub(sub);
    try {
      const res = await fetch(`${API_BASE}/bills/customer/${encodeURIComponent(sub)}`);
      if (!res.ok) throw new Error('Customer not found');
      setBills(await res.json());
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not fetch bills.', variant: 'destructive' });
      setBills([]);
    } finally {
      setLoadingBills(false);
    }
  };

  const handleDownload = async (billId: number) => {
    try {
      const response = await fetch(`${API_BASE}/bills/${billId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `bill-${billId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
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
    bills, loadingBills,
    searchedSub, hasSearched,
    billIndex, setBillIndex, billsPerPage,
    handleSearch, handleDownload,
  };
};
