import '@/index.css';
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { getPaymentStatus } from "@/services/paymentService";
import { PaymentResultCard, PaymentStatus } from "@/components/payments/PaymentResultComponents";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<PaymentStatus>("VERIFYING");

  useEffect(() => {
    if (!orderId) return;

    let count = 0;

    const interval = setInterval(async () => {
      count++;

      try {
        const paymentStatus = (await getPaymentStatus(orderId)).trim().toUpperCase();

        if (paymentStatus === "FULL" || paymentStatus === "PARTIAL") {
          setStatus("SUCCESS");
          clearInterval(interval);
        } else if (paymentStatus === "FAILED" || paymentStatus === "EXPIRED") {
          setStatus("FAILED");
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Failed to verify payment:", e);
        setStatus("FAILED");
        clearInterval(interval);
      }

      if (count >= 10) {
        setStatus("FAILED");
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <PaymentResultCard
          status={status}
          orderId={orderId}
          onPrimaryClick={() => navigate("/customer/payments?tab=history")}
          primaryLabel="View History"
          onSecondaryClick={() => navigate("/customer/dashboard")}
          secondaryLabel="Dashboard"
        />
      </div>
    </MainLayout>
  );
}