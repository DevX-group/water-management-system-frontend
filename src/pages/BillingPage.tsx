import React, { useState } from 'react';
import { Calculator, FileText, Download, Eye, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { mockBillRates, mockInvoices } from '@/data/mockData';
import { useAdmin } from '@/contexts/AdminContext';

type BillingPageTab = 'calculator' | 'view_bills';

interface RateEditState {
  [key: string]: number;
}

export const BillingPage = () => {
  const { currentAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<BillingPageTab>('calculator');
  const [meterType, setMeterType] = useState<'residential' | 'commercial' | 'industrial' | 'no_meter'>('residential');
  const [usage, setUsage] = useState(150);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [editRates, setEditRates] = useState<RateEditState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const rate = mockBillRates.find(r => r.meterType === meterType)!;

  // Filter invoices based on search query
  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    return { baseCharge: rate.baseCharge, usageCharge, tax, total, subtotal };
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

  const handleSaveRates = () => {
    // Handle saving rates logic here
    setIsEditingRates(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Calculate bills and manage invoices</p>
      </div>

     

      {/* Toggle Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'calculator'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary/50 text-foreground hover:bg-secondary'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Bill Calculator
        </button>
        <button
          onClick={() => setActiveTab('view_bills')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'view_bills'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary/50 text-foreground hover:bg-secondary'
          }`}
        >
          <FileText className="w-4 h-4" />
          View Bills
        </button>
      </div>

      {/* Bill Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Section */}
            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Calculate Your Bill</h3>
              </div>

              {/* Meter Type Selection */}
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

              {/* Usage Input with Slider */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <Label>Monthly Usage</Label>
                  <span className="text-sm font-semibold text-primary">{usage} units</span>
                </div>
                <Slider
                  value={[usage]}
                  onValueChange={(value) => setUsage(value[0])}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(Math.max(0, parseInt(e.target.value) || 0))}
                  className="mt-2"
                  placeholder="Enter usage in units"
                />
              </div>

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
                  <div className="flex justify-between pt-2 border-t border-border/50">
                    <span className="text-muted-foreground">Tax Rate</span>
                    <span className="font-medium text-foreground">{(rate.taxRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Bill Calculation Summary */}
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-3">
                <h4 className="font-medium text-foreground">Bill Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Charge</span>
                    <span className="font-medium text-foreground">LKR {bill.baseCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage Charge ({usage} units)</span>
                    <span className="font-medium text-foreground">LKR {bill.usageCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">LKR {bill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-primary/20 pt-2">
                    <span className="text-muted-foreground">Tax ({(rate.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-medium text-foreground">LKR {bill.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-primary/30">
                    <span className="font-semibold text-foreground">Total Amount</span>
                    <span className="font-bold text-lg text-primary">LKR {bill.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rate Management Section (Admin Only) */}
            {currentAdmin.role === 'main_admin' && (
              <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Manage Rates</h3>
                  </div>
                  <Button
                    size="sm"
                    variant={isEditingRates ? 'default' : 'outline'}
                    onClick={() => setIsEditingRates(!isEditingRates)}
                  >
                    {isEditingRates ? 'Done' : 'Edit'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockBillRates.map((billRate) => (
                    <div key={billRate.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <h4 className="font-medium text-foreground capitalize mb-4">
                        {billRate.meterType.replace('_', ' ')}
                      </h4>

                      {isEditingRates ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Base Charge (LKR)</Label>
                            <Input
                              type="number"
                              defaultValue={billRate.baseCharge}
                              onChange={(e) =>
                                setEditRates({
                                  ...editRates,
                                  [`base_${billRate.id}`]: parseFloat(e.target.value),
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Tax Rate (%)</Label>
                            <Input
                              type="number"
                              defaultValue={(billRate.taxRate * 100).toFixed(1)}
                              step="0.1"
                              onChange={(e) =>
                                setEditRates({
                                  ...editRates,
                                  [`tax_${billRate.id}`]: parseFloat(e.target.value) / 100,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Charge:</span>
                            <span className="font-medium text-foreground">LKR {billRate.baseCharge}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax Rate:</span>
                            <span className="font-medium text-foreground">
                              {(billRate.taxRate * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground font-medium mb-2">Tier Rates:</p>
                            {billRate.tierRates.map((tier, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span>
                                  {tier.max !== null ? `${tier.min}-${tier.max}` : `${tier.min}+`} units
                                </span>
                                <span>LKR {tier.rate}/unit</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditingRates && (
                  <Button className="w-full mt-6" onClick={handleSaveRates}>
                    Save Changes
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

               {/* View Bills Tab */}

                  

      {activeTab === 'view_bills' && (
        <div className="animate-fade-in">
           {/* Search Bar */}
                  <div className="animate-fade-in">
                  <Input
                     type="text"
                     placeholder="Search by prescription number..."
                     value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-max md:w-80 mb-6 mt-50"
                    />
                    </div>

          <div className="bg-card rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />

                <div>
                  <h3 className="text-lg font-semibold text-foreground">All Invoices</h3>

                  <p className="text-sm text-muted-foreground">Total: {filteredInvoices.length} invoices</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{invoice.customerName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.id}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                          statusStyles[invoice.status]
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">{invoice.date}</span>
                      <span className="font-semibold text-foreground text-lg">
                        LKR {invoice.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-none">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No invoices found matching your search' : 'No invoices found'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};