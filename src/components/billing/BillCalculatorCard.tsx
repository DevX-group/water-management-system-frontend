import '@/index.css';
import React from 'react';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { ConnectionType, ConnectionRate } from '@/types/billing';
import { TYPE_META } from '@/utils/billingUtils';

interface BillCalculatorCardProps {        // Pass data types for the BillCalculatorCard component
  selectedType:    ConnectionType;
  setSelectedType: (type: ConnectionType) => void;
  usage:           number;
  setUsage:        (v: number) => void;
  selectedRate:    ConnectionRate;
}

export const BillCalculatorCard: React.FC<BillCalculatorCardProps> = ({
  selectedType, setSelectedType, usage, setUsage, selectedRate,
}) => {
  const { t } = useTranslation('billing');

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{t('calculator.title')}</h3>
      </div>

      <div className="space-y-3 mb-6">   
        <Label>{t('connectionType.label')}</Label>
        <div className="grid grid-cols-2 gap-3">
          {(['metered', 'non_metered'] as ConnectionType[]).map((type) => {
            const meta = TYPE_META[type];
            const typeKey = type === 'metered' ? 'metered' : 'nonMetered';
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedType === type ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`flex items-center gap-2 mb-1 font-medium text-sm ${selectedType === type ? 'text-primary' : 'text-foreground'}`}>
                  {meta.icon}{t(`connectionType.${typeKey}.label`)}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{t(`connectionType.${typeKey}.description`)}</p>
              </button>
            );
          })}
        </div>
      </div>

     
      {selectedType === 'metered' && (         // Usage slider — metered only
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <Label>{t('calculator.monthlyUsage')}</Label>
            <span className="text-sm font-semibold text-primary">{usage} {t('calculator.units')}</span>
          </div>
          <Slider value={[usage]} onValueChange={(v) => setUsage(v[0])} min={0} max={1000} step={10} className="w-full" />
          <Input
            type="number"
            value={usage}
            onChange={(e) => setUsage(Math.max(0, parseInt(e.target.value) || 0))}
            className="mt-2"
            placeholder={t('calculator.enterUsage')}
          />
        </div>
      )}

        
      <div className="bg-secondary/50 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-foreground mb-3">{t('calculator.rateStructure')}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('calculator.baseCharge')}</span>
            <span className="font-medium">{t('currency')} {selectedRate.baseRate.toFixed(2)}</span>
          </div>
          {selectedType === 'metered' && (   // Show tiered rates for metered connections
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">0–{selectedRate.tier1Limit} {t('calculator.units')}</span>
                <span className="font-medium">{t('currency')} {selectedRate.unitRateTier1.toFixed(2)}{t('calculator.perUnit')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{selectedRate.tier1Limit + 1}–{selectedRate.tier2Limit} {t('calculator.units')}</span>
                <span className="font-medium">{t('currency')} {selectedRate.unitRateTier2.toFixed(2)}{t('calculator.perUnit')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{selectedRate.tier2Limit + 1}+ {t('calculator.units')}</span>
                <span className="font-medium">{t('currency')} {selectedRate.unitRateTier3.toFixed(2)}{t('calculator.perUnit')}</span>
              </div>
            </>
          )}
         {selectedType === 'non_metered' && (               // Show fixed rate for non-metered connections
            <p className="text-xs text-muted-foreground italic">{t('calculator.fixedBaseNote')}</p>
          )}
          <div className="flex justify-between pt-2 border-t border-border/50">
            <span className="text-muted-foreground">{t('calculator.taxRate')}</span>
            <span className="font-medium">{(selectedRate.taxRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
