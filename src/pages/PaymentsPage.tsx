import '@/index.css';
import { PaymentCustomerSearch } from '@/components/payments/PaymentCustomerSearch';
import { RecentPaymentsList } from '@/components/payments/RecentPaymentsList';
import { PendingBankSlipsTable } from '@/components/payments/PendingBankSlipsTable';
import { useTranslation } from 'react-i18next';

export const PaymentsPage = () => {
  const { t } = useTranslation('payments');
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('payments.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('payments.adminSubtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[40%] space-y-6">
          <PaymentCustomerSearch />
          <RecentPaymentsList />
        </div>
        <div className="lg:w-[60%]">
          <PendingBankSlipsTable />
        </div>
      </div>
    </div>
  );
};

