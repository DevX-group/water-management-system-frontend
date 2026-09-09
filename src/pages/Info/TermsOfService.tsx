import '@/index.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const TermsOfService = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('info');
  
  return (
  <MainLayout isAuthenticated={isAuthenticated}>
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gradient">{t('terms.title')}</h1>
      <Card className="border-none shadow-card">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-8 p-4 bg-secondary/20 rounded-xl border border-secondary/30">
            <FileText className="text-primary mt-1" />
            <p className="text-sm text-muted-foreground">
              {t('terms.notice')}
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-2">{t('terms.responsibilitiesTitle')}</h3>
              <p className="text-muted-foreground">{t('terms.responsibilities')}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">{t('terms.paymentTitle')}</h3>
              <p className="text-muted-foreground">{t('terms.payment')}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">{t('terms.liabilityTitle')}</h3>
              <p className="text-muted-foreground">{t('terms.liability')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </MainLayout>
  );
};