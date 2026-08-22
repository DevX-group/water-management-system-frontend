import React, { useEffect, useState } from 'react';
import { AlertCircle, Banknote } from 'lucide-react';
import { getOutstandingBillsForCustomer } from '@/services/paymentService';
import type { OutstandingBillsSummaryResponse } from '@/types/payment';

export const OutstandingBalanceWidget: React.FC = () => {
  const [data, setData] = useState<OutstandingBillsSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOutstandingBillsForCustomer()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-12 bg-muted rounded-lg" />;

  const amount = data?.totalOutstanding ?? 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Banknote className={`w-5 h-5 ${amount > 0 ? 'text-destructive' : 'text-success'}`} />
        <span className={`text-2xl font-bold ${amount > 0 ? 'text-destructive' : 'text-success'}`}>
          Rs. {Number(amount).toLocaleString()}
        </span>
      </div>
      {amount > 0 ? (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-warning" />
          {data?.outstandingBillCount ?? 0} unpaid bill(s)
        </span>
      ) : (
        <span className="text-xs text-success">All bills paid ✓</span>
      )}
    </div>
  );
};
