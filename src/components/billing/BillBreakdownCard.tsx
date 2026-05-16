import '@/index.css';
import React from 'react';
import type { ConnectionType, ConnectionRate, BillBreakdown } from '@/types/billing';

interface BillBreakdownCardProps {
  selectedType: ConnectionType;
  selectedRate: ConnectionRate;
  usage:        number;
  bill:         BillBreakdown;
}

export const BillBreakdownCard: React.FC<BillBreakdownCardProps> = ({
  selectedType, selectedRate, usage, bill,
}) => {
  return (
    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
      <h4 className="font-medium text-foreground mb-3">Bill Breakdown</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Charge</span>
          <span className="font-medium">LKR {bill.baseCharge.toFixed(2)}</span>
        </div>
        {selectedType === 'metered' && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usage Charge ({usage} units)</span>
            <span className="font-medium">LKR {bill.usageCharge.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">LKR {bill.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-primary/20 pt-2">
          <span className="text-muted-foreground">Tax ({(selectedRate.taxRate * 100).toFixed(1)}%)</span>
          <span className="font-medium">LKR {bill.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t-2 border-primary/30">
          <span className="font-semibold text-foreground">Total Amount</span>
          <span className="font-bold text-lg text-primary">LKR {bill.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
