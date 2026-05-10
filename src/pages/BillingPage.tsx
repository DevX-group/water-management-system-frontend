 import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Download, Eye, Settings2, Loader2, Zap, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:8081/api';

type BillingPageTab = 'calculator' | 'view_bills';
type ConnectionType = 'metered' | 'non_metered';
interface ConnectionRate {
  connectionType: ConnectionType;
  baseRate:       number;
  unitRateTier1:  number;
  unitRateTier2:  number;
  unitRateTier3:  number;
  tier1Limit:     number;
  tier2Limit:     number;
  taxRate:        number;
}



interface BillResponse {

  billId:        number;
  billingPeriod: string;
  billDate:      string;
  dueDate:       string;
  usageUnits:    number;
  totalAmount:   number;
  balanceDue:    number;
  status:        string;
}



// ── Hardcoded default rates ───────────────────────────────────────────

const DEFAULT_RATES: Record<ConnectionType, ConnectionRate> = {
  metered: {
    connectionType: 'metered',
    baseRate:       400,
    unitRateTier1:  2.50,
    unitRateTier2:  4.00,
    unitRateTier3:  6.00,
    tier1Limit:     50,
    tier2Limit:     100,
    taxRate:        0.10,
  },

  non_metered: {
    connectionType: 'non_metered',
    baseRate:       850,
    unitRateTier1:  0,
    unitRateTier2:  0,
    unitRateTier3:  0,
    tier1Limit:     0,
    tier2Limit:     0,
    taxRate:        0.10,
  },

};



const STATUS_STYLES: Record<string, string> = {
  PAID:    'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
};



const TYPE_META: Record<ConnectionType, { label: string; icon: React.ReactNode; description: string }> = {
  metered: {
    label:       'Metered',
    icon:        <Zap className="w-4 h-4" />,
    description: 'Usage-based billing with tiered unit rates',
  },

  non_metered: {
    label:       'Non-Metered',
    icon:        <ToggleLeft className="w-4 h-4" />,
    description: 'Fixed-rate billing regardless of usage',
  },

};



export const BillingPage = () => {
  const { currentAdmin } = useAdmin();
  const { toast }        = useToast();
  const [activeTab, setActiveTab]       = useState<BillingPageTab>('calculator');
  const [selectedType, setSelectedType] = useState<ConnectionType>('metered');
  const [usage, setUsage]               = useState(150);

  // rates state — initialised from hardcoded defaults, editable in UI
  const [rates, setRates] = useState<Record<ConnectionType, ConnectionRate>>(DEFAULT_RATES);

  // per-type independent edit/save state
  const [editingType, setEditingType] = useState<Partial<Record<ConnectionType, boolean>>>({});
  const [editDraft, setEditDraft]     = useState<Partial<Record<ConnectionType, Partial<ConnectionRate>>>>({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE}/rates`);
        if (res.ok) {
          const data: ConnectionRate[] = await res.json();
          const newRates = { ...DEFAULT_RATES };
          data.forEach(rate => {
            if (rate.connectionType === 'metered' || rate.connectionType === 'non_metered') {
              newRates[rate.connectionType] = rate;
            }
          });
          setRates(newRates);
        }
      } catch (err) {
        console.error("Failed to fetch rates:", err);
      }
    };
    fetchRates();
  }, []);

  // view bills
  const [searchQuery, setSearchQuery]   = useState('');
  const [bills, setBills]               = useState<BillResponse[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [searchedSub, setSearchedSub]   = useState('');
  const [hasSearched, setHasSearched]   = useState(false);

  const selectedRate = rates[selectedType];

  // ── Bill Calculation ─────────────────────────────────────────────────
  const calculateBill = () => {
    const r = selectedRate;
    let usageCharge = 0;
    if (selectedType === 'metered') {
      const t1 = Math.min(usage, r.tier1Limit);
      const t2 = Math.min(Math.max(usage - r.tier1Limit, 0), r.tier2Limit - r.tier1Limit);
      const t3 = Math.max(usage - r.tier2Limit, 0);
      usageCharge = t1 * r.unitRateTier1 + t2 * r.unitRateTier2 + t3 * r.unitRateTier3;
    }

    const subtotal = r.baseRate + usageCharge;
    const tax      = subtotal * r.taxRate;
    return { baseCharge: r.baseRate, usageCharge, tax, subtotal, total: subtotal + tax };
  };

  const bill = calculateBill();
  // ── Edit helpers ─────────────────────────────────────────────────────
  const startEditing = (type: ConnectionType) => {
    setEditDraft(prev => ({ ...prev, [type]: { ...rates[type] } }));
    setEditingType(prev => ({ ...prev, [type]: true }));
  };

  const cancelEditing = (type: ConnectionType) => {
    setEditDraft(prev => { const n = { ...prev }; delete n[type]; return n; });
    setEditingType(prev => ({ ...prev, [type]: false }));
  };

  const setDraftField = (type: ConnectionType, field: keyof ConnectionRate, raw: string) => {
    const value = parseFloat(raw);
    if (isNaN(value)) return;
    setEditDraft(prev => ({
      ...prev,
      [type]: { ...(prev[type] ?? rates[type]), [field]: value },
    }));
  };

  const handleSaveRates = async (type: ConnectionType) => {
    const draft = editDraft[type];
    if (!draft) return;
    
    // Combine existing rate with draft
    const updatedRate = { ...rates[type], ...draft };
    
    try {
      const res = await fetch(`${API_BASE}/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRate),
      });
      
      if (res.ok) {
        const savedRate = await res.json();
        setRates(prev => ({
          ...prev,
          [type]: savedRate,
        }));
        cancelEditing(type);
        toast({ title: 'Success', description: `${TYPE_META[type].label} rates updated in database!` });
      } else {
        throw new Error('Failed to save rate');
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update rates', variant: 'destructive' });
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
  // ── Rate Card ────────────────────────────────────────────────────────
  const renderRateCard = (type: ConnectionType) => {
    const r       = rates[type];
    const draft   = editDraft[type] ?? r;
    const meta    = TYPE_META[type];
    const editing = !!editingType[type];

    return (
      <div className="rounded-2xl border border-border/50 bg-secondary/40 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="text-primary">{meta.icon}</span>
            <span className="font-semibold text-foreground">{meta.label}</span>
          </div>

          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => startEditing(type)}>
              Edit
            </Button>

          ) : (

            <div className="flex gap-2">

              <Button size="sm" variant="ghost" onClick={() => cancelEditing(type)}>Cancel</Button>

              <Button size="sm" onClick={() => handleSaveRates(type)}>Save</Button>

            </div>

          )}

        </div>



        {/* body */}

        <div className="px-5 py-4 space-y-3">

          {editing ? (

            <>

              <div>

                <Label className="text-xs text-muted-foreground">Base Charge (LKR)</Label>

                <Input

                  type="number"

                  defaultValue={draft.baseRate}

                  className="mt-1"

                  onChange={(e) => setDraftField(type, 'baseRate', e.target.value)}

                />

              </div>

              <div>

                <Label className="text-xs text-muted-foreground">Tax Rate (%)</Label>

                <Input

                  type="number"

                  defaultValue={(draft.taxRate * 100).toFixed(1)}

                  step="0.1"

                  className="mt-1"

                  onChange={(e) => setDraftField(type, 'taxRate', String(parseFloat(e.target.value) / 100))}

                />

              </div>

              {type === 'metered' && (

                <div className="space-y-3 pt-2 border-t border-border/40">

                  <p className="text-xs font-medium text-muted-foreground">Tier Limits</p>

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <Label className="text-xs text-muted-foreground">Tier 1 limit (units)</Label>

                      <Input

                        type="number"

                        defaultValue={draft.tier1Limit}

                        className="mt-1"

                        onChange={(e) => setDraftField(type, 'tier1Limit', e.target.value)}

                      />

                    </div>

                    <div>

                      <Label className="text-xs text-muted-foreground">Tier 2 limit (units)</Label>

                      <Input

                        type="number"

                        defaultValue={draft.tier2Limit}

                        className="mt-1"

                        onChange={(e) => setDraftField(type, 'tier2Limit', e.target.value)}

                      />

                    </div>

                  </div>

                  <p className="text-xs font-medium text-muted-foreground pt-1">Tier Rates (LKR / unit)</p>

                  <div>

                    <Label className="text-xs text-muted-foreground">Tier 1 — 0–{r.tier1Limit} units</Label>

                    <Input

                      type="number"

                      defaultValue={draft.unitRateTier1}

                      step="0.01"

                      className="mt-1"

                      onChange={(e) => setDraftField(type, 'unitRateTier1', e.target.value)}

                    />

                  </div>

                  <div>

                    <Label className="text-xs text-muted-foreground">Tier 2 — {r.tier1Limit + 1}–{r.tier2Limit} units</Label>

                    <Input

                      type="number"

                      defaultValue={draft.unitRateTier2}

                      step="0.01"

                      className="mt-1"

                      onChange={(e) => setDraftField(type, 'unitRateTier2', e.target.value)}

                    />

                  </div>

                  <div>

                    <Label className="text-xs text-muted-foreground">Tier 3 — {r.tier2Limit + 1}+ units</Label>

                    <Input

                      type="number"

                      defaultValue={draft.unitRateTier3}

                      step="0.01"

                      className="mt-1"

                      onChange={(e) => setDraftField(type, 'unitRateTier3', e.target.value)}

                    />

                  </div>

                </div>

              )}

            </>

          ) : (

            <>

              <div className="flex justify-between text-sm">

                <span className="text-muted-foreground">Base Charge</span>

                <span className="font-medium">LKR {r.baseRate.toFixed(2)}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-muted-foreground">Tax Rate</span>

                <span className="font-medium">{(r.taxRate * 100).toFixed(1)}%</span>

              </div>

              {type === 'metered' && (

                <div className="pt-2 border-t border-border/40 space-y-1">

                  <p className="text-xs font-medium text-muted-foreground mb-2">Tier Rates</p>

                  <div className="flex justify-between text-xs">

                    <span className="text-muted-foreground">0–{r.tier1Limit} units</span>

                    <span className="font-medium">LKR {r.unitRateTier1.toFixed(2)}/unit</span>

                  </div>

                  <div className="flex justify-between text-xs">

                    <span className="text-muted-foreground">{r.tier1Limit + 1}–{r.tier2Limit} units</span>

                    <span className="font-medium">LKR {r.unitRateTier2.toFixed(2)}/unit</span>

                  </div>

                  <div className="flex justify-between text-xs">

                    <span className="text-muted-foreground">{r.tier2Limit + 1}+ units</span>

                    <span className="font-medium">LKR {r.unitRateTier3.toFixed(2)}/unit</span>

                  </div>

                </div>

              )}

              {type === 'non_metered' && (

                <p className="text-xs text-muted-foreground italic">Fixed base charge only — no tiered unit rates</p>

              )}

            </>

          )}

        </div>

      </div>

    );

  };



  // ── Render ───────────────────────────────────────────────────────────

  return (

    <div className="space-y-6">

      <div className="animate-fade-in">

        <h1 className="text-2xl font-bold text-foreground">Billing</h1>

        <p className="text-muted-foreground">Calculate bills and manage invoices</p>

      </div>



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



            {/* Calculator card */}

            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">

              <div className="flex items-center gap-2 mb-6">

                <Calculator className="w-5 h-5 text-primary" />

                <h3 className="text-lg font-semibold text-foreground">Calculate Your Bill</h3>

              </div>



              {/* Type selector */}

              <div className="space-y-3 mb-6">

                <Label>Connection Type</Label>

                <div className="grid grid-cols-2 gap-3">

                  {(['metered', 'non_metered'] as ConnectionType[]).map((type) => {

                    const meta = TYPE_META[type];

                    return (

                      <button

                        key={type}

                        onClick={() => setSelectedType(type)}

                        className={`p-4 rounded-xl border-2 transition-all text-left ${

                          selectedType === type ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'

                        }`}

                      >

                        <div className={`flex items-center gap-2 mb-1 font-medium text-sm ${selectedType === type ? 'text-primary' : 'text-foreground'}`}>

                          {meta.icon}{meta.label}

                        </div>

                        <p className="text-xs text-muted-foreground leading-snug">{meta.description}</p>

                      </button>

                    );

                  })}

                </div>

              </div>



              {/* Usage slider — metered only */}

              {selectedType === 'metered' && (

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

              )}



              {/* Rate structure */}

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">

                <h4 className="font-medium text-foreground mb-3">Rate Structure</h4>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">

                    <span className="text-muted-foreground">Base Charge</span>

                    <span className="font-medium">LKR {selectedRate.baseRate.toFixed(2)}</span>

                  </div>

                  {selectedType === 'metered' && (

                    <>

                      <div className="flex justify-between">

                        <span className="text-muted-foreground">0–{selectedRate.tier1Limit} units</span>

                        <span className="font-medium">LKR {selectedRate.unitRateTier1.toFixed(2)}/unit</span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-muted-foreground">{selectedRate.tier1Limit + 1}–{selectedRate.tier2Limit} units</span>

                        <span className="font-medium">LKR {selectedRate.unitRateTier2.toFixed(2)}/unit</span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-muted-foreground">{selectedRate.tier2Limit + 1}+ units</span>

                        <span className="font-medium">LKR {selectedRate.unitRateTier3.toFixed(2)}/unit</span>

                      </div>

                    </>

                  )}

                  {selectedType === 'non_metered' && (

                    <p className="text-xs text-muted-foreground italic">Fixed base charge — no tiered rates</p>

                  )}

                  <div className="flex justify-between pt-2 border-t border-border/50">

                    <span className="text-muted-foreground">Tax Rate</span>

                    <span className="font-medium">{(selectedRate.taxRate * 100).toFixed(1)}%</span>

                  </div>

                </div>

              </div>



              {/* Bill breakdown */}

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

            </div>



            {/* Manage Rates — main admin only */}

            {currentAdmin.role === 'main_admin' && (

              <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>

                <div className="flex items-center gap-2 mb-6">

                  <Settings2 className="w-5 h-5 text-primary" />

                  <h3 className="text-lg font-semibold text-foreground">Manage Rates</h3>

                </div>

                <div className="space-y-4">

                  {renderRateCard('metered')}

                  {renderRateCard('non_metered')}

                </div>

              </div>

            )}



          </div>

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

                        <div><p className="text-muted-foreground text-xs">Bill Date</p><p className="font-medium text-foreground">{b.billDate}</p></div>

                        <div><p className="text-muted-foreground text-xs">Due Date</p><p className="font-medium text-foreground">{b.dueDate}</p></div>

                        <div><p className="text-muted-foreground text-xs">Usage</p><p className="font-medium text-foreground">{b.usageUnits} units</p></div>

                        <div><p className="text-muted-foreground text-xs">Balance Due</p><p className="font-medium text-foreground">LKR {Number(b.balanceDue).toFixed(2)}</p></div>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="font-bold text-lg text-primary">LKR {Number(b.totalAmount).toFixed(2)}</span>

                        <div className="flex gap-2">

                          <Button variant="secondary" size="sm"><Eye className="w-3 h-3 mr-1" /> View Details</Button>

                          <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>

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

