import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { OutstandingBillItemResponse } from '@/services/paymentService';

interface OutstandingPaymentTabProps {
  outstandingBills:   OutstandingBillItemResponse[];
  outstandingAmount:  string;
  setOutstandingAmount: (v: string) => void;
  onAddPayment:       () => void;
}

export const OutstandingPaymentTab: React.FC<OutstandingPaymentTabProps> = ({
  outstandingBills, outstandingAmount, setOutstandingAmount, onAddPayment,
}) => {
  const totalOutstanding = outstandingBills.reduce((sum, b) => sum + (b.balanceDue ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Outstanding Payment Summary</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
            {outstandingBills.length} items
          </span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {outstandingBills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No outstanding bills found.</p>
          ) : (
            outstandingBills.slice(0, 6).map((b) => (
              <div key={b.billId} className="flex justify-between">
                <span className="text-muted-foreground">Bill Id:{b.billId} • {b.billingPeriod}</span>
                <span className="font-medium text-foreground">Rs. {Number(b.balanceDue ?? 0).toLocaleString()}</span>
              </div>
            ))
          )}
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-medium text-foreground">Total Due</span>
            <span className="text-xl font-bold text-primary">Rs. {totalOutstanding.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-foreground">Add Payment</h4>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Payment amount" value={outstandingAmount} onChange={(e) => setOutstandingAmount(e.target.value)} />
          <Button className="sm:w-[180px]" onClick={onAddPayment}>Add Payment</Button>
        </div>
      </div>
    </div>
  );
};
