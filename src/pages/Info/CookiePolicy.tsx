import '@/index.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const CookiePolicy = () => {
  const { isAuthenticated } = useAuth();
  
  return (
  <MainLayout isAuthenticated={isAuthenticated}>
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gradient">Cookie Policy</h1>
      <Card className="border-none shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Cookie size={32} className="text-amber-500" />
            <p className="text-muted-foreground">HydroPay uses cookies to enhance your dashboard experience.</p>
          </div>
          <ul className="space-y-4 list-disc pl-6 text-muted-foreground">
            <li><strong>Essential Cookies:</strong> Required for secure login and account management.</li>
            <li><strong>Preference Cookies:</strong> Used to remember your dashboard layout and filter settings.</li>
            <li><strong>Analytics:</strong> Help us understand how the system is used to improve performance.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </MainLayout>
  );
};