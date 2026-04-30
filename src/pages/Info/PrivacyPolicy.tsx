import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const PrivacyPolicy = () => (
  <MainLayout isAuthenticated={true}>
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Privacy Policy</h1>
        <p className="text-muted-foreground">How we handle and protect your data</p>
      </div>
      <Card className="border-none shadow-card overflow-hidden">
        <div className="p-6 bg-primary/5 border-b flex items-center gap-4 text-primary font-semibold">
          <ShieldCheck size={20} />
          Data Protection Commitment
        </div>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">1. Data Collection</h3>
            <p className="text-muted-foreground leading-relaxed">
              HydroPay collects essential information such as your name, email address, and water usage data 
              strictly to provide accurate billing services and system notifications.
            </p>
          </section>
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">2. Data Usage</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your information is used solely for processing payments, identifying anomalies in usage, 
              and responding to your support inquiries. We never sell your data to third parties.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-4">3. Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard encryption to protect your personal and financial information. 
              Our database is monitored 24/7 to prevent unauthorized access.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  </MainLayout>
);