import '@/index.css';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { formatDateTime } from "@/utils/dateUtils";
import { formatPaymentMethod } from "@/utils/paymentUtils";
import { RecentPaymentResponse } from '@/types/payment';
import { getRecentPayments } from '@/services/paymentService';
import { useTranslation } from 'react-i18next';

const statusStyles = {
  full: 'bg-success/10 text-success',
  partial: 'bg-warning/10 text-warning',
} as const;

export const RecentPaymentsList = () => {
  const { t, i18n } = useTranslation('payments');
  const [recentPayments, setRecentPayments] = useState<RecentPaymentResponse[]>([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const data = await getRecentPayments(5);
        setRecentPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recent payments:", err);
        toast.error(t('payments.recentPayments.failedToLoad'));
      }
    }

    loadRecent();
  }, []);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up bg-primary/5">
      <h3 className="text-lg font-semibold text-foreground mb-4">{t('payments.recentPayments.title')}</h3>
      {recentPayments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('payments.recentPayments.noRecentPayments')}
        </p>
      ) : (
        <div className="space-y-3">
          {Array.isArray(recentPayments) && recentPayments.map((payment) => {
            const statusKey = payment.status.toLowerCase();
            const statusClass = statusStyles[statusKey as keyof typeof statusStyles] || 'bg-muted text-muted-foreground';
            const translatedStatus = t(`payments.filters.${statusKey}`, { defaultValue: statusKey.charAt(0).toUpperCase() + statusKey.slice(1) });

            const paymentType =
              payment.paymentMethod === "MANUAL" && payment.paymentType
                ? payment.paymentType?.toLowerCase()
                : null;
            const translatedPaymentType = paymentType
              ? t(`payments.filters.${paymentType}`, { defaultValue: paymentType.charAt(0).toUpperCase() + paymentType.slice(1) })
              : "";

            const methodMap: Record<string, string> = {
              'BANK_TRANSFER': 'bankTransfer',
              'ONLINE': 'online',
              'MANUAL': 'manual'
            };
            const methodKey = payment.paymentMethod ? methodMap[payment.paymentMethod] : null;
            const translatedMethod = methodKey ? t(`payments.filters.${methodKey}`) : formatPaymentMethod(payment.paymentMethod);

            return (
              <div
                key={payment.paymentId}
                className="group p-3.5 rounded-xl border border-border/60 bg-background hover:bg-primary/[0.02] shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Top Row: Name & Amount */}
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <p className="font-medium text-foreground text-sm truncate">
                    {payment.accountHolderName}
                  </p>
                  <span className="font-medium text-primary shrink-0 text-sm">
                    {t('payments.billPayment.currency')} {payment.amountPaid.toLocaleString()}
                  </span>
                </div>

                {/* Second Row: Sub No & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                    {payment.subscriptionNumber}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${statusClass}`}
                  >
                    {payment.paymentMethod === "MANUAL" && payment.paymentType
                      ? `${translatedPaymentType}.${translatedStatus}`
                      : translatedStatus}
                  </span>
                </div>

                {/* Bottom Row: Date & Method */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {(() => {
                      const dt = formatDateTime(payment.createdAt);
                      if (dt === "-") return dt;
                      const [datePart, timePart, ampmPart] = dt.split(' ');
                      const translatedAmPm = ampmPart === 'AM' ? t('payments.filters.am') : t('payments.filters.pm');
                      if (i18n.language === 'si') {
                        return `${datePart} ${translatedAmPm} ${timePart}`;
                      }
                      return `${datePart} ${timePart} ${translatedAmPm}`;
                    })()}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary/80 text-secondary-foreground">
                    {translatedMethod}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
