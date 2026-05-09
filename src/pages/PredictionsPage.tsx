import '@/index.css';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MonthlyPredictionChart }  from '@/components/predictions/MonthlyPredictionChart';
import { CustomerPredictionChart } from '@/components/predictions/CustomerPredictionChart';
import { AreaPredictionChart }     from '@/components/predictions/AreaPredictionChart';

export const PredictionsPage = () => {
  const [searchId, setSearchId]     = useState('C001');
  const [selectedArea, setSelectedArea] = useState('all');
  const areaYear = '2026';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Predictions</h1>
        <p className="text-sm text-muted-foreground">Predicted data for monitoring and analysis up to 3 months</p>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Report Prediction</TabsTrigger>
          <TabsTrigger value="customer">Customer Report Prediction</TabsTrigger>
          <TabsTrigger value="area">Area Report Prediction</TabsTrigger>
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
