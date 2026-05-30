import '@/index.css';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ConnectionType, ConnectionRate } from '@/types/billing';
import { TYPE_META } from '@/utils/billingUtils';

interface RateCardProps {
  type:          ConnectionType;
  rates:         Record<ConnectionType, ConnectionRate>;
  editingType:   Partial<Record<ConnectionType, boolean>>;
  editDraft:     Partial<Record<ConnectionType, Partial<ConnectionRate>>>;
  onStartEdit:   (type: ConnectionType) => void;
  onCancelEdit:  (type: ConnectionType) => void;
  onSetDraft:    (type: ConnectionType, field: keyof ConnectionRate, raw: string) => void;
  onSave:        (type: ConnectionType) => void;
}

export const RateCard: React.FC<RateCardProps> = ({          // Pass data types for the RateCard component
  type, rates, editingType, editDraft, onStartEdit, onCancelEdit, onSetDraft, onSave,
}) => {
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
          <Button size="sm" variant="outline" onClick={() => onStartEdit(type)}>
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onCancelEdit(type)}>Cancel</Button>
            <Button size="sm" onClick={() => onSave(type)}>Save</Button>
          </div>
        )}
      </div>

      
      <div className="px-5 py-4 space-y-3">  
        {editing ? (       //body of the rate card
          <>
            <div>
              <Label className="text-xs text-muted-foreground">Base Charge (LKR)</Label>
              <Input
                type="number"
                defaultValue={draft.baseRate}
                className="mt-1"
                onChange={(e) => onSetDraft(type, 'baseRate', e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Tax Rate (%)</Label>
              <Input
                type="number"
                defaultValue={(draft.taxRate ?? 0) * 100}
                step="0.1"
                className="mt-1"
                onChange={(e) => onSetDraft(type, 'taxRate', String(parseFloat(e.target.value) / 100))}
              />
            </div>

            {type === 'metered' && (          // Show tiered rate inputs for metered connections when editing
              <div className="space-y-3 pt-2 border-t border-border/40">
                <p className="text-xs font-medium text-muted-foreground">Tier Limits</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Tier 1 limit (units)</Label>
                    <Input type="number" defaultValue={draft.tier1Limit} className="mt-1"
                      onChange={(e) => onSetDraft(type, 'tier1Limit', e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tier 2 limit (units)</Label>
                    <Input type="number" defaultValue={draft.tier2Limit} className="mt-1"
                      onChange={(e) => onSetDraft(type, 'tier2Limit', e.target.value)} />
                  </div>
                </div>

                <p className="text-xs font-medium text-muted-foreground pt-1">Tier Rates (LKR / unit)</p>
                <div>
                  <Label className="text-xs text-muted-foreground">Tier 1 — 0–{r.tier1Limit} units</Label>
                  <Input type="number" defaultValue={draft.unitRateTier1} step="0.01" className="mt-1"
                    onChange={(e) => onSetDraft(type, 'unitRateTier1', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tier 2 — {r.tier1Limit + 1}–{r.tier2Limit} units</Label>
                  <Input type="number" defaultValue={draft.unitRateTier2} step="0.01" className="mt-1"
                    onChange={(e) => onSetDraft(type, 'unitRateTier2', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tier 3 — {r.tier2Limit + 1}+ units</Label>
                  <Input type="number" defaultValue={draft.unitRateTier3} step="0.01" className="mt-1"
                    onChange={(e) => onSetDraft(type, 'unitRateTier3', e.target.value)} />
                </div>
              </div>
            )}
          </>
        ) : (       // Show rate details when not editing
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
