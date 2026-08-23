import { useState, useEffect } from 'react';
import type { BillResponse } from '@/types/billing';
import { CUSTOMER_SUBSCRIPTION_NUMBER } from '@/constants/customer';
import { api } from '@/services/api';
import { generateWaterBillPDF } from '@/util/generateWaterBillPDF';
import type { CustomerProfile } from '@/components/profile/ProfileForm';

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
  
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10; // Fetch 10 bills per page from backend

  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  // Fetch the specific bills for the logged in customer.
  useEffect(() => {
    setLoading(true);
    api.get<{ content: BillResponse[], totalPages: number, totalElements: number }>(`/bills/customer/me/paginated?page=${pageIndex}&size=${itemsPerPage}`)
      .then(response => {
        setBills(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [pageIndex]);

  useEffect(() => {
    api.get('/customers/me')
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  const filteredBills = bills.filter(b => {
    const matchSearch = b.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  // Handles downloading the bill as a PDF directly from the frontend template.

  const handleDownload = async (bill: BillResponse) => {
    try {
      await generateWaterBillPDF(bill, profile);
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
    profile,
    searchTerm,
    statusFilter,
    viewingBill,
    zoom,
    rotation,
    imageLoading,
    imageError,
    pageIndex,
    totalPages,
    totalElements,
    itemsPerPage,
    setSearchTerm,
    setStatusFilter,
    setPageIndex,
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
