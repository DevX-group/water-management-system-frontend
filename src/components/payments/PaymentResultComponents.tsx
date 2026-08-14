import '@/index.css';
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export type PaymentStatus = "VERIFYING" | "SUCCESS" | "FAILED";

interface PaymentResultCardProps {
  status: PaymentStatus;
  orderId?: string | null;
  onPrimaryClick: () => void;
  primaryLabel: string;
  onSecondaryClick: () => void;
  secondaryLabel: string;
}

export const PaymentResultCard: React.FC<PaymentResultCardProps> = ({
  status,
  orderId,
  onPrimaryClick,
  primaryLabel,
  onSecondaryClick,
  secondaryLabel,
}) => {
  const { t } = useTranslation('payments');

  return (
    <Card className="shadow-card border-none">
      <CardContent className="p-8 text-center space-y-6">
        {status === "VERIFYING" && (
          <>
            <Loader2 className="w-14 h-14 mx-auto animate-spin text-primary" />
            <h1 className="text-2xl font-bold">{t("payments.paymentResult.verifyingPayment")}</h1>
            <p className="text-muted-foreground">
              {t("payments.paymentResult.pleaseWait")}
            </p>
          </>
        )}

        {status === "SUCCESS" && (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto text-success" />
            <h1 className="text-2xl font-bold text-success">{t("payments.paymentResult.paymentSuccessful")}</h1>
            <p className="text-muted-foreground">
              {t("payments.paymentResult.paymentReceived")}
            </p>
          </>
        )}

        {status === "FAILED" && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-destructive" />
            <h1 className="text-2xl font-bold text-destructive">{t("payments.paymentResult.paymentFailed")}</h1>
            <p className="text-muted-foreground">
              {t("payments.paymentResult.paymentFailedDescription")}
            </p>
          </>
        )}

        {orderId && (
          <p className="text-sm text-muted-foreground">{t("payments.paymentResult.orderId")} {orderId}</p>
        )}

        <div className="flex gap-3 justify-center pt-4">
          <Button
            className="gradient-primary min-w-[150px]"
            onClick={onPrimaryClick}
          >
            {primaryLabel}
          </Button>

          <Button
            variant="outline"
            className="min-w-[150px] border-border bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            onClick={onSecondaryClick}
          >
            {secondaryLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
