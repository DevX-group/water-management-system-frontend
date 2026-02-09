import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, Clock, Download } from "lucide-react";

const Payments = () => {
  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Payments</h1>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card border-none">
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" />Monthly Payment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Monthly Bill:</span><span className="font-semibold">Rs. 1,850</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Already Paid:</span><span className="font-semibold">Rs. 500</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge variant="outline" className="text-warning border-warning">Partial</Badge></div>
              <div className="flex justify-between border-t pt-4"><span className="font-medium">Total Due:</span><span className="text-xl font-bold text-primary">Rs. 1,350</span></div>
              <Button className="w-full gradient-primary">Pay Now</Button>
            </CardContent>
          </Card>

          <Card className="shadow-card border-none">
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-warning" />Outstanding Payment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span className="text-muted-foreground">July 2025:</span><span className="font-semibold">Rs. 500</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">September 2025:</span><span className="font-semibold">Rs. 670</span></div>
              <div className="flex justify-between border-t pt-4"><span className="font-medium">Total Due:</span><span className="text-xl font-bold text-destructive">Rs. 1,170</span></div>
              <Button className="w-full" variant="destructive">Pay Now</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card border-none">
          <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Month</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { month: "October 2025", amount: 2800, date: "20/10/2025", status: "Full" },
                    { month: "September 2025", amount: 1400, date: "28/09/2025", status: "Partial" },
                    { month: "August 2025", amount: 2800, date: "21/08/2025", status: "Full" },
                  ].map((payment, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-4">{payment.month}</td>
                      <td className="p-4">Rs. {payment.amount.toLocaleString()}</td>
                      <td className="p-4">{payment.date}</td>
                      <td className="p-4"><Badge className={payment.status === "Full" ? "bg-success" : "bg-warning"}>{payment.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Payments;
