import React from 'react';
import { CalendarDays, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CurrentBillResponse } from '@/services/paymentService';

type UiStatus = 'paid' | 'partial' | 'overdue';

interface MonthlyPaymentTabProps {
  currentBill:   CurrentBillResponse | null;
  monthlyAmount: string;
  setMonthlyAmount: (v: string) => void;
  onAddPayment:  () => void;
}

export const MonthlyPaymentTab: React.FC<MonthlyPaymentTabProps> = ({
  currentBill, monthlyAmount, setMonthlyAmount, onAddPayment,
}) => {
  const currentMonthLabel = currentBill?.billingPeriod
    || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const monthlyBill = currentBill?.totalAmount ?? 0;
  const monthlyDue  = currentBill?.balanceDue  ?? 0;
  const alreadyPaid = Math.max(monthlyBill - monthlyDue, 0);

  return (
    <div className="space-y-4">
      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-foreground">Current Month Summary</h4>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Month</span>
            <span className="font-medium text-foreground">{currentMonthLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Bill</span>
            <span className="font-medium text-foreground">Rs. {monthlyBill.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Already Paid</span>
            <span className="font-medium text-success">Rs. {alreadyPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-medium text-foreground">Total Due</span>
            <span className="text-xl font-bold text-primary">Rs. {monthlyDue.toLocaleString()}</span>
          </div>
          {currentBill?.status && (
            <p className="text-xs text-muted-foreground mt-2">Bill Status: {currentBill.status}</p>
          )}
        </div>
      </div>

      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-foreground">Add Payment</h4>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Payment amount" value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} />
          <Button className="sm:w-[180px]" onClick={onAddPayment}>Add Payment</Button>
        </div>
      </div>
    </div>
  );
};
