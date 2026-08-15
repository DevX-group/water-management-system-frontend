import '@/index.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const TermsOfService = () => (
  <MainLayout isAuthenticated={true}>
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gradient">Terms & Service</h1>
      <Card className="border-none shadow-card">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-8 p-4 bg-secondary/20 rounded-xl border border-secondary/30">
            <FileText className="text-primary mt-1" />
            <p className="text-sm text-muted-foreground">
              Last Updated: April 2026. By using the HydroPay platform, you agree to the following conditions.
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-2">User Responsibilities</h3>
              <p className="text-muted-foreground">Users are responsible for providing accurate meter readings and ensuring timely payments for water services.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Payment Terms</h3>
              <p className="text-muted-foreground">All payments are processed securely. Overdue balances may trigger automated system alerts as defined in your service agreement.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Limitation of Liability</h3>
              <p className="text-muted-foreground">HydroPay is a management platform and is not responsible for physical infrastructure failures of the water utility provider.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </MainLayout>
);