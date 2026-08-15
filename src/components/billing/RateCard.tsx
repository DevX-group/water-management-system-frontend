import '@/index.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('billing');
  const r       = rates[type];
  const draft   = editDraft[type] ?? r;
  const meta    = TYPE_META[type];
  const editing = !!editingType[type];
  const typeKey = type === 'metered' ? 'metered' : 'nonMetered';

  return (
    <div className="rounded-2xl border border-border/50 bg-secondary/40 overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="text-primary">{meta.icon}</span>
          <span className="font-semibold text-foreground">{t(`connectionType.${typeKey}.label`)}</span>
        </div>

        {!editing ? (
          <Button size="sm" variant="outline" onClick={() => onStartEdit(type)}>
            {t('rateCard.edit')}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onCancelEdit(type)}>{t('rateCard.cancel')}</Button>
            <Button size="sm" onClick={() => onSave(type)}>{t('rateCard.save')}</Button>
          </div>
        )}
      </div>

      
      <div className="px-5 py-4 space-y-3">  
        {editing ? (       //body of the rate card
          <>
            <div>
              <Label className="text-xs text-muted-foreground">{t('rateCard.baseChargeLKR')}</Label>
              <Input
                type="number"
                defaultValue={draft.baseRate}
                className="mt-1"
                onChange={(e) => onSetDraft(type, 'baseRate', e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">{t('rateCard.taxRatePercent')}</Label>
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
                <p className="text-xs font-medium text-muted-foreground">{t('rateCard.tierLimits')}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('rateCard.tier1Limit')}</Label>
                    <Input type="number" defaultValue={draft.tier1Limit} className="mt-1"
                      onChange={(e) => onSetDraft(type, 'tier1Limit', e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('rateCard.tier2Limit')}</Label>
                    <Input type="number" defaultValue={draft.tier2Limit} className="mt-1"
                      onChange={(e) => onSetDraft(type, 'tier2Limit', e.target.value)} />
                  </div>
                </div>

                <p className="text-xs font-medium text-muted-foreground pt-1">{t('rateCard.tierRates')}</p>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('rateCard.tierLabel', { tier: 1, range: `0–${r.tier1Limit}` })}</Label>
                  <Input type="number" defaultValue={draft.unitRateTier1} step="0.01" className="mt-1"
                    onChange={(e) => onSetDraft(type, 'unitRateTier1', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('rateCard.tierLabel', { tier: 2, range: `${r.tier1Limit + 1}–${r.tier2Limit}` })}</Label>
                  <Input type="number" defaultValue={draft.unitRateTier2} step="0.01" className="mt-1"
                    onChange={(e) => onSetDraft(type, 'unitRateTier2', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('rateCard.tierLabel', { tier: 3, range: `${r.tier2Limit + 1}+` })}</Label>
                  <Input type="number" defaultValue={draft.unitRateTier3} step="0.01" className="mt-1"
                    onChange={(e) => onSetDraft(type, 'unitRateTier3', e.target.value)} />
                </div>
              </div>
            )}
          </>
        ) : (       // Show rate details when not editing
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('rateCard.baseCharge')}</span>
              <span className="font-medium">{t('currency')} {r.baseRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('rateCard.taxRate')}</span>
              <span className="font-medium">{(r.taxRate * 100).toFixed(1)}%</span>
            </div>

            {type === 'metered' && (
              <div className="pt-2 border-t border-border/40 space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('rateCard.tierRatesTitle')}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">0–{r.tier1Limit} {t('calculator.units')}</span>
                  <span className="font-medium">{t('currency')} {r.unitRateTier1.toFixed(2)}{t('calculator.perUnit')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.tier1Limit + 1}–{r.tier2Limit} {t('calculator.units')}</span>
                  <span className="font-medium">{t('currency')} {r.unitRateTier2.toFixed(2)}{t('calculator.perUnit')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.tier2Limit + 1}+ {t('calculator.units')}</span>
                  <span className="font-medium">{t('currency')} {r.unitRateTier3.toFixed(2)}{t('calculator.perUnit')}</span>
                </div>
              </div>
            )}

            {type === 'non_metered' && (
              <p className="text-xs text-muted-foreground italic">{t('rateCard.fixedBaseNote')}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
