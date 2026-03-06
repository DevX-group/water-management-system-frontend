import React, { useState } from 'react';
import { Calculator, FileText, Download, Eye, Settings2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { mockBillRates } from '@/data/mockData';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:8080/api';

type BillingPageTab = 'calculator' | 'view_bills';

interface RateEditState {
  [key: string]: number;
}

interface BillResponse {
  billId: number;
  billingPeriod: string;
  billDate: string;
  dueDate: string;
  usageUnits: number;
  totalAmount: number;
  balanceDue: number;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  PAID:    'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

export const BillingPage = () => {
  const { currentAdmin } = useAdmin();
  const { toast } = useToast();

  const [activeTab, setActiveTab]         = useState<BillingPageTab>('calculator');
  const [meterType, setMeterType]         = useState<'residential' | 'commercial' | 'industrial' | 'no_meter'>('residential');
  const [usage, setUsage]                 = useState(150);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [editRates, setEditRates]         = useState<RateEditState>({});

  // ── View Bills state ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]     = useState('');
  const [bills, setBills]                 = useState<BillResponse[]>([]);
  const [loadingBills, setLoadingBills]   = useState(false);
  const [searchedSub, setSearchedSub]     = useState('');
  const [hasSearched, setHasSearched]     = useState(false);

  const rate = mockBillRates.find(r => r.meterType === meterType)!;

  // ── Calculator logic ────────────────────────────────────────────────
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
    return { baseCharge: rate.baseCharge, usageCharge, tax, total: subtotal + tax, subtotal };
  };

  const bill = calculateBill();

  const meterTypes = [
    { value: 'residential', label: 'Residential', color: 'bg-success' },
    { value: 'commercial',  label: 'Commercial',  color: 'bg-primary' },
    { value: 'industrial',  label: 'Industrial',  color: 'bg-accent' },
    { value: 'no_meter',    label: 'No Meter',    color: 'bg-muted' },
  ] as const;

  // ── Fetch bills by subscription number ─────────────────────────────
  const handleSearch = async () => {
    const sub = searchQuery.trim();
    if (!sub) return;
    setLoadingBills(true);
    setHasSearched(true);
    setSearchedSub(sub);
    try {
      const res = await fetch(`${API_BASE}/bills/customer/${encodeURIComponent(sub)}`);
      if (!res.ok) throw new Error('Customer not found');
      setBills(await res.json());
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not fetch bills.', variant: 'destructive' });
      setBills([]);
    } finally {
      setLoadingBills(false);
    }
  };

  const handleSaveRates = () => setIsEditingRates(false);

  // ── render ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Calculate bills and manage invoices</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {(['calculator', 'view_bills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/50 text-foreground hover:bg-secondary'
            }`}
          >
            {tab === 'calculator' ? <Calculator className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {tab === 'calculator' ? 'Bill Calculator' : 'View Bills'}
          </button>
        ))}
      </div>

      {/* ── Calculator Tab ── */}
      {activeTab === 'calculator' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator */}
            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Calculate Your Bill</h3>
              </div>

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

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <Label>Monthly Usage</Label>
                  <span className="text-sm font-semibold text-primary">{usage} units</span>
                </div>
                <Slider value={[usage]} onValueChange={(v) => setUsage(v[0])} min={0} max={1000} step={10} className="w-full" />
                <Input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(Math.max(0, parseInt(e.target.value) || 0))}
                  className="mt-2"
                  placeholder="Enter usage in units"
                />
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-foreground mb-3">Rate Structure</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Charge</span>
                    <span className="font-medium text-foreground">LKR {rate.baseCharge}</span>
                  </div>
                  {rate.tierRates.map((tier, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {tier.max !== null ? `${tier.min}–${tier.max} units` : `${tier.min}+ units`}
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

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-3">
                <h4 className="font-medium text-foreground">Bill Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Charge</span>
                    <span className="font-medium">LKR {bill.baseCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage Charge ({usage} units)</span>
                    <span className="font-medium">LKR {bill.usageCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">LKR {bill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-primary/20 pt-2">
                    <span className="text-muted-foreground">Tax ({(rate.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-medium">LKR {bill.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-primary/30">
                    <span className="font-semibold text-foreground">Total Amount</span>
                    <span className="font-bold text-lg text-primary">LKR {bill.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rate Management — main admin only */}
            {currentAdmin.role === 'main_admin' && (
              <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Manage Rates</h3>
                  </div>
                  <Button size="sm" variant={isEditingRates ? 'default' : 'outline'} onClick={() => setIsEditingRates(!isEditingRates)}>
                    {isEditingRates ? 'Done' : 'Edit'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockBillRates.map((billRate) => (
                    <div key={billRate.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <h4 className="font-medium text-foreground capitalize mb-4">{billRate.meterType.replace('_', ' ')}</h4>
                      {isEditingRates ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Base Charge (LKR)</Label>
                            <Input type="number" defaultValue={billRate.baseCharge}
                              onChange={(e) => setEditRates({ ...editRates, [`base_${billRate.id}`]: parseFloat(e.target.value) })}
                              className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Tax Rate (%)</Label>
                            <Input type="number" defaultValue={(billRate.taxRate * 100).toFixed(1)} step="0.1"
                              onChange={(e) => setEditRates({ ...editRates, [`tax_${billRate.id}`]: parseFloat(e.target.value) / 100 })}
                              className="mt-1" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Charge:</span>
                            <span className="font-medium">LKR {billRate.baseCharge}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax Rate:</span>
                            <span className="font-medium">{(billRate.taxRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground font-medium mb-2">Tier Rates:</p>
                            {billRate.tierRates.map((tier, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span>{tier.max !== null ? `${tier.min}–${tier.max}` : `${tier.min}+`} units</span>
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
                  <Button className="w-full mt-6" onClick={handleSaveRates}>Save Changes</Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── View Bills Tab ── */}
      {activeTab === 'view_bills' && (
        <div className="animate-fade-in space-y-6">

          {/* Search by subscription number */}
          <div className="bg-card rounded-2xl p-6 shadow-md">
            <h3 className="text-base font-semibold text-foreground mb-4">Search Bills by Subscription Number</h3>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="e.g., SUB-0001"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-sm"
              />
              <Button onClick={handleSearch} disabled={loadingBills || !searchQuery.trim()}>
                {loadingBills ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loadingBills ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="bg-card rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Bills for {searchedSub}</h3>
                  <p className="text-sm text-muted-foreground">
                    {loadingBills ? 'Loading...' : `${bills.length} bill${bills.length !== 1 ? 's' : ''} found`}
                  </p>
                </div>
              </div>

              {loadingBills ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading bills...
                </div>
              ) : bills.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No bills found for this subscription number.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bills.map((b) => (
                    <div key={b.billId} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border border-border/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">Bill #{b.billId}</p>
                          <p className="text-sm text-muted-foreground">Period: {b.billingPeriod}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Bill Date</p>
                          <p className="font-medium text-foreground">{b.billDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Due Date</p>
                          <p className="font-medium text-foreground">{b.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Usage</p>
                          <p className="font-medium text-foreground">{b.usageUnits} units</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Balance Due</p>
                          <p className="font-medium text-foreground">LKR {Number(b.balanceDue).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-primary">
                          LKR {Number(b.totalAmount).toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};