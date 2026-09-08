import '@/index.css';
import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const statusStyles = {
  paid: 'bg-success/10 text-success',
  partial: 'bg-warning/10 text-warning',
  pending: 'bg-muted text-muted-foreground',
  overdue: 'bg-destructive/10 text-destructive',
} as const;

const statusIcons = {
  paid: CheckCircle,
  partial: Clock,
  pending: Clock,
  overdue: AlertCircle,
} as const;

export const RecentlyAddedPayments: React.FC<{ payments: any[] }> = ({ payments }) => {
  const { t } = useTranslation('payments');
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up bg-primary/5">
      <h3 className="text-lg font-semibold text-foreground mb-4">{t('adminPayments.recentlyAdded', { defaultValue: 'Recently Added' })}</h3>
      <div className="space-y-3">
        {payments.map((payment) => {
          const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons] || Clock;
          const statusKey = payment.status ? String(payment.status).toLowerCase() : '';
          return (
            <div key={payment.id} className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-foreground text-sm">{payment.customerName}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[payment.status as keyof typeof statusStyles] || 'bg-muted text-muted-foreground'}`}>
                  <StatusIcon className="w-3 h-3" /> {t(`filters.${statusKey}`, { defaultValue: payment.status })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{payment.subscriptionNo}</span>
                <span className="font-medium text-foreground">{t('billPayment.currency', { defaultValue: 'Rs.' })} {payment.amount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{payment.date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PendingBankSlips: React.FC<{ slips: any[]; onReview: (id: string) => void }> = ({ slips, onReview }) => (
  <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up lg:w-[60%]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-foreground">Pending Bank Slips</h3>
      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">{slips.length} Pending</span>
    </div>
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 px-6 py-3 bg-secondary/50 text-xs font-semibold text-muted-foreground">
        <div className="col-span-4">Customer</div>
        <div className="col-span-3">Ref No</div>
        <div className="col-span-2 text-center">Amount</div>
        <div className="col-span-3 text-center">Action</div>
      </div>
      <div className="max-h-[450px] overflow-auto">
        {slips.map((slip) => (
          <div key={slip.id} className="grid grid-cols-12 px-6 py-4 border-t border-border hover:bg-secondary/30 transition-colors text-sm items-center">
            <div className="col-span-4">
              <p className="font-medium text-foreground">{slip.customerName}</p>
              <p className="text-xs text-muted-foreground">{slip.subscriptionNo}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{slip.uploadedAt}</p>
            </div>
            <div className="col-span-3 text-muted-foreground">{slip.refNo}</div>
            <div className="col-span-2 text-right font-semibold text-foreground pr-4">Rs. {slip.amount.toLocaleString()}</div>
            <div className="col-span-3 flex justify-center">
              <Button size="sm" className="px-5" onClick={() => onReview(slip.id)}>Review</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <p className="mt-3 text-xs text-muted-foreground">Only pending slips are shown here.</p>
  </div>
);
