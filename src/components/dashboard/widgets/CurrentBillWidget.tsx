import React, { useEffect, useState } from 'react';
import { Receipt, AlertCircle } from 'lucide-react';
import { getCurrentBillForCustomer } from '@/services/paymentService';
import type { CurrentBillResponse } from '@/types/payment';

export const CurrentBillWidget: React.FC = () => {
  const [bill, setBill] = useState<CurrentBillResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentBillForCustomer()
      .then(setBill)
      .catch(() => setBill(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-12 bg-muted rounded-lg" />;

  if (!bill) {
    return (
      <div className="flex flex-col items-center gap-1 text-muted-foreground">
        <AlertCircle className="w-4 h-4" />
        <span className="text-xs">No current bill</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5 text-primary" />
        <span className="text-2xl font-bold text-foreground">
          Rs. {Number(bill.totalAmount ?? 0).toLocaleString()}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {bill.billingPeriod} · Due {bill.dueDate}
      </span>
      <span className={`text-xs font-semibold ${bill.status === 'PAID' ? 'text-success' : 'text-warning'}`}>
        {bill.status}
      </span>
    </div>
  );
};
