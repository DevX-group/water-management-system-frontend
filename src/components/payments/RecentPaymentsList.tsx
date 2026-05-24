import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { formatDateTime } from "@/utils/dateUtils";
import { formatPaymentMethod } from "@/utils/paymentUtils";
import { RecentPaymentResponse } from '@/types/payment';
import { getRecentPayments } from '@/services/paymentService';

const statusStyles = {
  full: 'bg-success/10 text-success',
  partial: 'bg-warning/10 text-warning',
} as const;

export const RecentPaymentsList = () => {
  const [recentPayments, setRecentPayments] = useState<RecentPaymentResponse[]>([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const data = await getRecentPayments(5);
        setRecentPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recent payments:", err);
        toast.error("Failed to load recent payments");
      }
    }

    loadRecent();
  }, []);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up bg-primary/5">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recently Added</h3>
      {recentPayments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No recent payments.
        </p>
      ) : (
        <div className="space-y-3">
          {Array.isArray(recentPayments) && recentPayments.map((payment) => {
            const statusKey = payment.status.toLowerCase();
            const statusClass = statusStyles[statusKey as keyof typeof statusStyles] || 'bg-muted text-muted-foreground';
            const formattedStatus = statusKey.charAt(0).toUpperCase() + statusKey.slice(1);

            const paymentType =
              payment.paymentMethod === "MANUAL" && payment.paymentType
                ? payment.paymentType?.toLowerCase()
                : null;
            const formattedPaymentType = paymentType
              ? paymentType.charAt(0).toUpperCase() + paymentType.slice(1)
              : "";

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
                    Rs. {payment.amountPaid.toLocaleString()}
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
                      ? `${formattedPaymentType}.${formattedStatus}`
                      : formattedStatus}
                  </span>
                </div>

                {/* Bottom Row: Date & Method */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {formatDateTime(payment.createdAt)}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary/80 text-secondary-foreground">
                    {formatPaymentMethod(payment.paymentMethod)}
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
