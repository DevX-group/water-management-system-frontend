import '@/index.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { PaymentResultCard } from "@/components/payments/PaymentResultComponents";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const { t } = useTranslation('payments');

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <PaymentResultCard
          status="FAILED"
          onPrimaryClick={() => navigate("/customer/payments")}
          primaryLabel={t("payments.paymentResult.tryAgain")}
          onSecondaryClick={() => navigate("/customer/dashboard")}
          secondaryLabel={t("payments.paymentResult.dashboard")}
        />
      </div>
    </MainLayout>
  );
}