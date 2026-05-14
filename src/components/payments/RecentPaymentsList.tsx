import { useState, useEffect } from 'react';
import { getRecentPayments, RecentPaymentResponse } from '@/services/paymentService';
import { toast } from '@/components/ui/sonner';
import { formatDateTime } from "@/util/dateUtils";
import { formatPaymentMethod } from "@/util/paymentUtils"

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
                className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-foreground text-sm">{payment.accountHolderName}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                  >
                    {payment.paymentMethod === "MANUAL" && payment.paymentType
                      ? `${formattedPaymentType}.${formattedStatus}`
                      : formattedStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{payment.subscriptionNumber}</span>
                  <span className="font-medium text-foreground">
                    Rs. {payment.amountPaid.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(payment.createdAt)}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground mt-1 bg-blue-100 text-blue-700">
                  {formatPaymentMethod(payment.paymentMethod)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
