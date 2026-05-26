import { useState, useEffect } from 'react';
import type { BillResponse } from '@/types/billing';
import { API_BASE } from '@/utils/billingUtils';
import { CUSTOMER_SUBSCRIPTION_NUMBER } from '@/constants/customer';

const SUBSCRIPTION_NUMBER = CUSTOMER_SUBSCRIPTION_NUMBER;

export const useBills = () => {
  const [bills, setBills]           = useState<BillResponse[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingBill, setViewingBill]   = useState<BillResponse | null>(null);
  const [zoom, setZoom]             = useState(1);
  const [rotation, setRotation]     = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError]     = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${API_BASE}/bills/customer/${encodeURIComponent(SUBSCRIPTION_NUMBER)}`)
      .then(r => r.ok ? r.json() : [])
      .then(setBills)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBills = bills.filter(b => {
    const matchSearch = b.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDownload = async (bill: BillResponse) => {
    try {
      const res = await fetch(`${API_BASE}/bills/${bill.billId}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `bill-${bill.billingPeriod}.pdf`; a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
  };

  const handleCloseView = () => { 
    setViewingBill(null); 
    setZoom(1); 
    setRotation(0); 
    setImageError(false); 
  };

  const handleView = (bill: BillResponse) => {
    setViewingBill(bill);
    setImageLoading(true);
    setImageError(false);
  };

  return {
    bills,
    loading,
    searchTerm,
    statusFilter,
    viewingBill,
    zoom,
    rotation,
    imageLoading,
    imageError,
    currentIndex,
    itemsPerPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentIndex,
    setZoom,
    setRotation,
    setImageLoading,
    setImageError,
    filteredBills,
    handleDownload,
    handleCloseView,
    handleView,
    SUBSCRIPTION_NUMBER
  };
};
