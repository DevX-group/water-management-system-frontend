import '@/index.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const PrivacyPolicy = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('info');
  
  return (
  <MainLayout isAuthenticated={isAuthenticated}>
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient">{t('privacy.title')}</h1>
        <p className="text-muted-foreground">{t('privacy.subtitle')}</p>
      </div>
      <Card className="border-none shadow-card overflow-hidden">
        <div className="p-6 bg-primary/5 border-b flex items-center gap-4 text-primary font-semibold">
          <ShieldCheck size={20} />
          {t('privacy.commitment')}
        </div>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">{t('privacy.collectionTitle')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.collection')}
            </p>
          </section>
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">{t('privacy.usageTitle')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.usage')}
            </p>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-4">{t('privacy.securityTitle')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.security')}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  </MainLayout>
  );
};