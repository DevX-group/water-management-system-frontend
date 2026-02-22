import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';    

export const PredictionsPage = () => {
    return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Predictions</h1>
          <p className="text-sm text-muted-foreground">Predicted data for monitoring and analysis</p>

    </div>

    <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Report Prediction</TabsTrigger>
          <TabsTrigger value="customer">Customer Report Prediction</TabsTrigger>
          <TabsTrigger value="area">Area Report Prediction</TabsTrigger>
        </TabsList>  
    </Tabs> 

    </div>);
}