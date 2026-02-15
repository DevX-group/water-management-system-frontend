import React, { useState } from 'react';
import { Calculator, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { mockBillRates, mockInvoices } from '@/data/mockData';
import { useAdmin } from '@/contexts/AdminContext';

export const BillingPage = () => {
  const { currentAdmin } = useAdmin();
  const [meterType, setMeterType] = useState<'residential' | 'commercial' | 'industrial' | 'no_meter'>('residential');
  const [usage, setUsage] = useState(150);

  const rate = mockBillRates.find(r => r.meterType === meterType)!;

  // Calculate bill
  const calculateBill = () => {
    let usageCharge = 0;
    let remaining = usage;

    for (const tier of rate.tierRates) {
      if (remaining <= 0) break;
      const tierRange = tier.max !== null ? tier.max - tier.min : Infinity;
      const unitsInTier = Math.min(remaining, tierRange);
      usageCharge += unitsInTier * tier.rate;
      remaining -= unitsInTier;
    }

    const subtotal = rate.baseCharge + usageCharge;
    const tax = subtotal * rate.taxRate;
    const total = subtotal + tax;

    return { baseCharge: rate.baseCharge, usageCharge, tax, total };
  };

  const bill = calculateBill();

  const meterTypes = [
    { value: 'residential', label: 'Residential', color: 'bg-success' },
    { value: 'commercial', label: 'Commercial', color: 'bg-primary' },
    { value: 'industrial', label: 'Industrial', color: 'bg-accent' },
    { value: 'no_meter', label: 'No Meter', color: 'bg-muted' },
  ] as const;

  const statusStyles = {
    paid: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    overdue: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Calculate bills and manage invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bill Calculator */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Bill Calculator</h3>
          </div>

          {/* Meter Type */}
          <div className="space-y-3 mb-6">
            <Label>Meter Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {meterTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMeterType(type.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    meterType === type.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${type.color} mb-1 mx-auto`} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Usage Slider */}
          {meterType !== 'no_meter' && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <Label>Water Usage (units)</Label>
                <span className="text-2xl font-bold text-primary">{usage}</span>
              </div>
              <Slider
                value={[usage]}
                onValueChange={([value]) => setUsage(value)}
                min={0}
                max={500}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Adjust the slider or enter a value</p>
            </div>
          )}

          {/* Rate Structure */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-foreground mb-3">Rate Structure</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Charge</span>
                <span className="font-medium text-foreground">LKR {rate.baseCharge}</span>
              </div>
              {rate.tierRates.map((tier, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {tier.max !== null ? `${tier.min}-${tier.max} units` : `${tier.min}+ units`}
                  </span>
                  <span className="font-medium text-foreground">LKR {tier.rate}/unit</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Calculation */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <h4 className="font-medium text-foreground mb-3">Total Bill Calculation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base charge</span>
                <span className="font-medium text-foreground">LKR {bill.baseCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usage charge</span>
                <span className="font-medium text-foreground">LKR {bill.usageCharge.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({(rate.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-medium text-foreground">LKR {bill.tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-primary/20">
                <span className="font-semibold text-foreground">Total Bill</span>
                <span className="text-xl font-bold text-primary">LKR {bill.total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4">
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
        </div>

        {/* Invoices */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">All Invoices</h3>
            </div>
            <span className="text-sm text-muted-foreground">Total: {mockInvoices.length}</span>
          </div>

          <div className="space-y-3">
            {mockInvoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{invoice.customerName}</p>
                    <p className="text-sm text-muted-foreground">{invoice.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[invoice.status]}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{invoice.date}</span>
                  <span className="font-semibold text-foreground">LKR {invoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bill Rate Management (Main Admin Only) */}
      {currentAdmin.role === 'main_admin' && (
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bill Rate Management</h3>
              <p className="text-sm text-muted-foreground">Configure billing rates for different meter types</p>
            </div>
            <Button variant="outline">
              Edit Rates
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockBillRates.map((rate) => (
              <div key={rate.id} className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground capitalize mb-3">{rate.meterType.replace('_', ' ')}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base:</span>
                    <span className="text-foreground">LKR {rate.baseCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="text-foreground">{(rate.taxRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
