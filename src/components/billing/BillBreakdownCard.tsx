import '@/index.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ConnectionType, ConnectionRate, BillBreakdown } from '@/types/billing';

interface BillBreakdownCardProps {   // Pass data types for the BillBreakdownCard component
  selectedType: ConnectionType;
  selectedRate: ConnectionRate;
  usage:        number;
  bill:         BillBreakdown;
}

export const BillBreakdownCard: React.FC<BillBreakdownCardProps> = ({      
  selectedType, selectedRate, usage, bill,
}) => {
  const { t } = useTranslation('billing');

  return (
    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
      <h4 className="font-medium text-foreground mb-3">{t('breakdown.title')}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('breakdown.baseCharge')}</span>
          <span className="font-medium">{t('currency')} {bill.baseCharge.toFixed(2)}</span>
        </div>
        {selectedType === 'metered' && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('breakdown.usageCharge', { units: usage })}</span>
            <span className="font-medium">{t('currency')} {bill.usageCharge.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('breakdown.subtotal')}</span>
          <span className="font-medium">{t('currency')} {bill.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-primary/20 pt-2">
          <span className="text-muted-foreground">{t('breakdown.tax', { rate: (selectedRate.taxRate * 100).toFixed(1) })}</span>
          <span className="font-medium">{t('currency')} {bill.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t-2 border-primary/30">
          <span className="font-semibold text-foreground">{t('breakdown.totalAmount')}</span>
          <span className="font-bold text-lg text-primary">{t('currency')} {bill.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
