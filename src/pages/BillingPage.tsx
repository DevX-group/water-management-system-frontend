import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Download, Eye, Settings2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:8081/api';

type BillingPageTab = 'calculator' | 'view_bills';

interface RegionRate {
  regionId: number;
  regionName: string;
  baseRate: number;
  unitRateTier1: number;
  unitRateTier2: number;
  unitRateTier3: number;
  taxRate: number;
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

interface EditRateState {
  [key: string]: number;
}

const STATUS_STYLES: Record<string, string> = {
  PAID:    'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

export const BillingPage = () => {
  const { currentAdmin } = useAdmin();
  const { toast } = useToast();

  const [activeTab, setActiveTab]           = useState<BillingPageTab>('calculator');
  const [usage, setUsage]                   = useState(150);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [editRates, setEditRates]           = useState<EditRateState>({});

  // ── Region Rates ─────────────────────────────────────────────────────
  const [rates, setRates]                   = useState<RegionRate[]>([]);
  const [selectedRate, setSelectedRate]     = useState<RegionRate | null>(null);
  const [loadingRates, setLoadingRates]     = useState(true);

  // ── View Bills ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [bills, setBills]                   = useState<BillResponse[]>([]);
  const [loadingBills, setLoadingBills]     = useState(false);
  const [searchedSub, setSearchedSub]       = useState('');
  const [hasSearched, setHasSearched]       = useState(false);

  // ── Fetch rates on mount ─────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/bills/rates`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load rates');
        return res.json();
      })
      .then((data: RegionRate[]) => {
        setRates(data);
        if (data.length > 0) setSelectedRate(data[0]);
      })
      .catch(() => toast({ title: 'Error', description: 'Failed to load billing rates', variant: 'destructive' }))
      .finally(() => setLoadingRates(false));
  }, []);

  // ── Bill Calculation (matches BillingService tier logic) ─────────────
  const calculateBill = () => {
    if (!selectedRate) return { baseCharge: 0, usageCharge: 0, tax: 0, subtotal: 0, total: 0 };

    const tier1Units = Math.min(usage, 50);
    const tier2Units = Math.min(Math.max(usage - 50, 0), 50);
    const tier3Units = Math.max(usage - 100, 0);

    const usageCharge =
      tier1Units * selectedRate.unitRateTier1 +
      tier2Units * selectedRate.unitRateTier2 +
      tier3Units * selectedRate.unitRateTier3;

    const subtotal = selectedRate.baseRate + usageCharge;
    const tax      = subtotal * selectedRate.taxRate;

    return {
      baseCharge: selectedRate.baseRate,
      usageCharge,
      tax,
      subtotal,
      total: subtotal + tax,
    };
  };

  const bill = calculateBill();

  // ── Save rates ───────────────────────────────────────────────────────
  const handleSaveRates = async () => {
    try {
      await Promise.all(
        rates.map(r =>
          fetch(`${API_BASE}/bills/rates/${r.regionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              baseRate:      editRates[`base_${r.regionId}`]  ?? r.baseRate,
              taxRate:       editRates[`tax_${r.regionId}`]   ?? r.taxRate,
              unitRateTier1: editRates[`t1_${r.regionId}`]    ?? r.unitRateTier1,
              unitRateTier2: editRates[`t2_${r.regionId}`]    ?? r.unitRateTier2,
              unitRateTier3: editRates[`t3_${r.regionId}`]    ?? r.unitRateTier3,
            }),
          })
        )
      );

      // Re-fetch updated rates
      const updated: RegionRate[] = await fetch(`${API_BASE}/bills/rates`).then(r => r.json());
      setRates(updated);
      setSelectedRate(updated.find(r => r.regionId === selectedRate?.regionId) ?? updated[0]);
      setEditRates({});
      setIsEditingRates(false);
      toast({ title: 'Success', description: 'Rates updated successfully!' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save rates', variant: 'destructive' });
    }
  };

  // ── Search bills ─────────────────────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────────────
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
          {loadingRates ? (
            <div className="flex items-center gap-2 text-muted-foreground py-10">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading rates...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculator */}
              <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Calculate Your Bill</h3>
                </div>

                {/* Region Selector */}
                <div className="space-y-3 mb-6">
                  <Label>Region</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {rates.map((r) => (
                      <button
                        key={r.regionId}
                        onClick={() => setSelectedRate(r)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          selectedRate?.regionId === r.regionId
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        {r.regionName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Usage Slider */}
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

                {/* Rate Structure */}
                {selectedRate && (
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                    <h4 className="font-medium text-foreground mb-3">Rate Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Charge</span>
                        <span className="font-medium">LKR {selectedRate.baseRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">0 – 50 units</span>
                        <span className="font-medium">LKR {selectedRate.unitRateTier1}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">51 – 100 units</span>
                        <span className="font-medium">LKR {selectedRate.unitRateTier2}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">101+ units</span>
                        <span className="font-medium">LKR {selectedRate.unitRateTier3}/unit</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">Tax Rate</span>
                        <span className="font-medium">{(selectedRate.taxRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bill Breakdown */}
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
                      <span className="text-muted-foreground">
                        Tax ({selectedRate ? (selectedRate.taxRate * 100).toFixed(1) : 0}%)
                      </span>
                      <span className="font-medium">LKR {bill.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-primary/30">
                      <span className="font-semibold text-foreground">Total Amount</span>
                      <span className="font-bold text-lg text-primary">LKR {bill.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Manage Rates (main admin only) ── */}
              {currentAdmin.role === 'main_admin' && (
                <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Manage Rates</h3>
                    </div>
                    <Button size="sm" variant={isEditingRates ? 'default' : 'outline'}
                      onClick={() => { setIsEditingRates(!isEditingRates); setEditRates({}); }}>
                      {isEditingRates ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {rates.map((r) => (
                      <div key={r.regionId} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                        <h4 className="font-medium text-foreground mb-4">{r.regionName}</h4>
                        {isEditingRates ? (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">Base Charge (LKR)</Label>
                              <Input type="number" defaultValue={r.baseRate} className="mt-1"
                                onChange={(e) => setEditRates(prev => ({ ...prev, [`base_${r.regionId}`]: parseFloat(e.target.value) }))} />
                            </div>
                            <div>
                              <Label className="text-xs">Tax Rate (%)</Label>
                              <Input type="number" defaultValue={(r.taxRate * 100).toFixed(1)} step="0.1" className="mt-1"
                                onChange={(e) => setEditRates(prev => ({ ...prev, [`tax_${r.regionId}`]: parseFloat(e.target.value) / 100 }))} />
                            </div>
                            <div>
                              <Label className="text-xs">Tier 1 Rate — 0–50 units (LKR/unit)</Label>
                              <Input type="number" defaultValue={r.unitRateTier1} step="0.01" className="mt-1"
                                onChange={(e) => setEditRates(prev => ({ ...prev, [`t1_${r.regionId}`]: parseFloat(e.target.value) }))} />
                            </div>
                            <div>
                              <Label className="text-xs">Tier 2 Rate — 51–100 units (LKR/unit)</Label>
                              <Input type="number" defaultValue={r.unitRateTier2} step="0.01" className="mt-1"
                                onChange={(e) => setEditRates(prev => ({ ...prev, [`t2_${r.regionId}`]: parseFloat(e.target.value) }))} />
                            </div>
                            <div>
                              <Label className="text-xs">Tier 3 Rate — 101+ units (LKR/unit)</Label>
                              <Input type="number" defaultValue={r.unitRateTier3} step="0.01" className="mt-1"
                                onChange={(e) => setEditRates(prev => ({ ...prev, [`t3_${r.regionId}`]: parseFloat(e.target.value) }))} />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Base Charge:</span>
                              <span className="font-medium">LKR {r.baseRate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tax Rate:</span>
                              <span className="font-medium">{(r.taxRate * 100).toFixed(1)}%</span>
                            </div>
                            <div className="pt-2 border-t border-border/50 space-y-1">
                              <p className="text-xs text-muted-foreground font-medium mb-1">Tier Rates:</p>
                              <div className="flex justify-between text-xs"><span>0–50 units</span><span>LKR {r.unitRateTier1}/unit</span></div>
                              <div className="flex justify-between text-xs"><span>51–100 units</span><span>LKR {r.unitRateTier2}/unit</span></div>
                              <div className="flex justify-between text-xs"><span>101+ units</span><span>LKR {r.unitRateTier3}/unit</span></div>
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
          )}
        </div>
      )}

      {/* ── View Bills Tab ── */}
      {activeTab === 'view_bills' && (
        <div className="animate-fade-in space-y-6">
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
                {loadingBills && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {loadingBills ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

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
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading bills...
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
                        <span className="font-bold text-lg text-primary">LKR {Number(b.totalAmount).toFixed(2)}</span>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            <Eye className="w-3 h-3 mr-1" /> View Details
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