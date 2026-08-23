import '@/index.css';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MonthlyPredictionChart }  from '@/components/predictions/MonthlyPredictionChart';
import { CustomerPredictionChart } from '@/components/predictions/CustomerPredictionChart';
import { AreaPredictionChart }     from '@/components/predictions/AreaPredictionChart';
import { useTranslation } from 'react-i18next';

export const PredictionsPage = () => {
  const { t } = useTranslation('predictions');
  const [searchId, setSearchId]     = useState('C001');
  const [selectedArea, setSelectedArea] = useState('all');
  const areaYear = '2026';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">{t('tabs.monthly')}</TabsTrigger>
          <TabsTrigger value="customer">{t('tabs.customer')}</TabsTrigger>
          <TabsTrigger value="area">{t('tabs.area')}</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <MonthlyPredictionChart />
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <CustomerPredictionChart searchId={searchId} setSearchId={setSearchId} />
        </TabsContent>

        <TabsContent value="area" className="space-y-6">
          <AreaPredictionChart
            selectedArea={selectedArea}
            areaYear={areaYear}
            setSelectedArea={setSelectedArea}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
