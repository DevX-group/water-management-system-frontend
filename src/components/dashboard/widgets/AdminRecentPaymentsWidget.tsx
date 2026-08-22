import React, { useEffect, useState } from 'react';
import { getRecentPayments } from '@/services/paymentService';
import type { RecentPaymentResponse } from '@/types/payment';

export const AdminRecentPaymentsWidget: React.FC = () => {
  const [payments, setPayments] = useState<RecentPaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentPayments(6)
      .then(setPayments)
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
    <div className="overflow-auto max-h-[200px]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-1 font-medium">Subscription</th>
            <th className="text-right py-1 font-medium">Amount</th>
            <th className="text-right py-1 font-medium">Method</th>
            <th className="text-right py-1 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.paymentId} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
              <td className="py-1.5 font-mono">{p.subscriptionNumber}</td>
              <td className="py-1.5 text-right font-medium">Rs. {Number(p.amount).toLocaleString()}</td>
              <td className="py-1.5 text-right text-muted-foreground">{p.paymentMethod}</td>
              <td className="py-1.5 text-right">
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  p.status === 'COMPLETED' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                }`}>
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
