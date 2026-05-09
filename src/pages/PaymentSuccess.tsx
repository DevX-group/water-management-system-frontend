import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getPaymentStatus } from "@/services/paymentService";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"VERIFYING" | "SUCCESS" | "FAILED">("VERIFYING");

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
        }

        else if (paymentStatus === "FAILED" || paymentStatus === "EXPIRED") {
          setStatus("FAILED");
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Failed to verify payment:", e);
        setStatus("FAILED");
        clearInterval(interval);
      }

      if (count >= 10){
        setStatus("FAILED");
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card className="shadow-card border-none">
          <CardContent className="p-8 text-center space-y-6">

            {status === "VERIFYING" && (
              <>
                <Loader2 className="w-14 h-14 mx-auto animate-spin text-primary" />
                <h1 className="text-2xl font-bold">
                  Verifying Payment...
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment.
                </p>
              </>
            )}

            {status === "SUCCESS" && (
              <>
                <CheckCircle2 className="w-16 h-16 mx-auto text-success" />
                <h1 className="text-2xl font-bold text-success">
                  Payment Successful
                </h1>
                <p className="text-muted-foreground">
                  Your payment has been received successfully.
                </p>
              </>
            )}

            {status === "FAILED" && (
                <h1 className="text-2xl font-bold text-destructive">
                  Payment Verification Failed
                </h1>
            )}

            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order ID: {orderId}
              </p>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Button
                className="gradient-primary min-w-[150px]"
                onClick={() =>
                  navigate("/customer/payments?tab=history")
                }
              >
                View History
              </Button>

              <Button
                variant="outline"
                className="min-w-[150px]"
                onClick={() =>
                  navigate("/customer/dashboard")
                }
              >
                Dashboard
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}