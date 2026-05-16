import '@/index.css';
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PaymentResultCard } from "@/components/payments/PaymentResultComponents";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <PaymentResultCard
          status="FAILED"
          onPrimaryClick={() => navigate("/customer/payments")}
          primaryLabel="Try Again"
          onSecondaryClick={() => navigate("/customer/dashboard")}
          secondaryLabel="Dashboard"
        />
      </div>
    </MainLayout>
  );
}