import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card className="shadow-card border-none">
          <CardContent className="p-8 text-center space-y-6">

            <XCircle className="w-16 h-16 mx-auto text-destructive" />

            <h1 className="text-2xl font-bold text-destructive">
              Payment Failed
            </h1>

            <p className="text-muted-foreground">
              We couldn't complete your payment. Please try again.
            </p>

            <div className="flex gap-3 justify-center pt-4">
              <Button
                className="gradient-primary min-w-[150px]"
                onClick={() =>
                  navigate("/customer/payments")
                }
              >
                Try Again
              </Button>

              <Button
                variant="outline"
                className="min-w-[150px] border-border bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
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