import '@/index.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const CookiePolicy = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('info');
  
  return (
  <MainLayout isAuthenticated={isAuthenticated}>
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gradient">{t('cookies.title')}</h1>
      <Card className="border-none shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Cookie size={32} className="text-amber-500" />
            <p className="text-muted-foreground">{t('cookies.description')}</p>
          </div>
          <ul className="space-y-4 list-disc pl-6 text-muted-foreground">
            <li><strong>{t('cookies.essentialTitle')}</strong> {t('cookies.essential')}</li>
            <li><strong>{t('cookies.preferenceTitle')}</strong> {t('cookies.preference')}</li>
            <li><strong>{t('cookies.analyticsTitle')}</strong> {t('cookies.analytics')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </MainLayout>
  );
};