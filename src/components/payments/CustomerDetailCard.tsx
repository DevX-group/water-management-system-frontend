import { User, Hash, CreditCard, MapPin, Zap } from 'lucide-react';
import { PaymentCustomerInfoResponse } from '@/types/payment';
import { useTranslation } from 'react-i18next';

export const CustomerDetailCard = ({ customerInfo }: { customerInfo: PaymentCustomerInfoResponse | null }) => {
  const { t } = useTranslation('payments');
  if (!customerInfo) return null;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5 border border-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {t('payments.customerDetails.title')}
          </h3>
          <p className="text-xs text-muted-foreground">{t('payments.customerDetails.accountInformation')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="text-sm">{t('payments.customerDetails.name')}</span>
          </div>
          <span className="font-semibold text-foreground text-right">{customerInfo.accountHolderName}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span className="text-sm">{t('payments.customerDetails.subscriptionNo')}</span>
          </div>
          <span className="font-mono font-medium text-foreground bg-secondary/50 px-2 py-0.5 rounded-md text-sm">{customerInfo.subscriptionNumber}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">{t('payments.customerDetails.nic')}</span>
          </div>
          <span className="font-medium text-foreground text-sm">{customerInfo.nic}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{t('payments.customerDetails.region')}</span>
          </div>
          <span className="font-medium text-foreground capitalize text-sm">{customerInfo.region}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span className="text-sm">{t('payments.customerDetails.connectionType')}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {customerInfo.connectionType === "metered" ? t('payments.customerDetails.withMeter') : t('payments.customerDetails.noMeter')}
          </span>
        </div>
      </div>
    </div>
  );
};
