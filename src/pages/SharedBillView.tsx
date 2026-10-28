import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { WaterBillTemplate } from '@/components/bills/WaterBillTemplate';
import { Loader2, AlertCircle } from 'lucide-react';
import type { BillResponse } from '@/types/billing';
import { generateWaterBillPDF } from '@/util/generateWaterBillPDF';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

import { API_BASE_URL } from '@/config/api';

export const SharedBillView = () => {
  const { token } = useParams<{ token: string }>();
  const [bill, setBill] = useState<BillResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    
    axios.get(`${API_BASE_URL}/public/bills/share/${token}`)
      .then(res => {
        setBill(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Invalid or expired bill link.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleDownload = async () => {
    if (!bill) return;
    try {
      await generateWaterBillPDF(bill, null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[850px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Your Water Bill</h1>
          <p className="text-sm text-gray-500">Billing Period: {bill.billingPeriod}</p>
        </div>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="max-w-[850px] mx-auto shadow-xl rounded-lg overflow-hidden bg-white">
        <WaterBillTemplate bill={bill} profile={null} />
      </div>
    </div>
  );
};
