import React from 'react';
import type { PaymentHistoryItemResponse } from '@/services/paymentService';

interface PaymentHistoryCardProps {
  history: PaymentHistoryItemResponse[];
}

export const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({ history }) => (
  <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
      <span className="text-sm text-muted-foreground">{history.length}</span>
    </div>

    {history.length === 0 ? (
      <p className="text-sm text-muted-foreground">No payments found.</p>
    ) : (
      <div className="space-y-3">
        {history.map((p) => (
          <div key={p.paymentId}
            className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Rs. {Number(p.amount).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{p.subscriptionNumber}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                p.status === 'FULL' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {p.status.toLowerCase()}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
