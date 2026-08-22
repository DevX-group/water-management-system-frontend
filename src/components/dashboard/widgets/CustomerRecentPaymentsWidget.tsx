import React, { useEffect, useState } from 'react';
import { getPaymentHistoryForCustomer } from '@/services/paymentService';

interface PaymentItem {
  paymentId: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}

export const CustomerRecentPaymentsWidget: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentHistoryForCustomer(0, 5)
      .then((res) => setPayments(res.content ?? res ?? []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse h-8 bg-muted rounded" />
      ))}
    </div>;
  }

  if (!payments.length) {
    return <p className="text-xs text-muted-foreground text-center py-4">No recent payments.</p>;
  }

  return (
    <ul className="space-y-1.5">
      {payments.slice(0, 5).map((p) => (
        <li key={p.paymentId} className="flex items-center justify-between text-sm">
          <div>
            <span className="font-medium">Rs. {Number(p.amount).toLocaleString()}</span>
            <span className="ml-2 text-xs text-muted-foreground">{p.paymentMethod}</span>
          </div>
          <div className="text-right">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              p.status === 'COMPLETED' ? 'bg-success/15 text-success' :
              p.status === 'PENDING' ? 'bg-warning/15 text-warning' :
              'bg-destructive/15 text-destructive'
            }`}>
              {p.status}
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {new Date(p.createdAt).toLocaleDateString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
