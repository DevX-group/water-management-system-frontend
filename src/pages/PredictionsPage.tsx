import "@/index.css";
import React, { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { MonthlyPredictionChart } from "@/components/predictions/MonthlyPredictionChart";
import { CustomerPredictionChart } from "@/components/predictions/CustomerPredictionChart";
import { AreaPredictionChart } from "@/components/predictions/AreaPredictionChart";

export const PredictionsPage = () => {
  const [searchId, setSearchId] =
    useState("C001");

  const [selectedArea, setSelectedArea] =
    useState("all");

  /*
   * Predictions use the current year automatically.
   * Historical years remain available on the Reports page.
   */
  const predictionYear =
    new Date().getFullYear().toString();

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Predictions
        </h1>

        <p className="mt-1 text-muted-foreground">
          Predicted data for monitoring and analysis
          up to 3 months
        </p>
      </div>

      <Tabs
        defaultValue="monthly"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">
            Monthly Report Prediction
          </TabsTrigger>

          <TabsTrigger value="customer">
            Customer Report Prediction
          </TabsTrigger>

          <TabsTrigger value="area">
            Area Report Prediction
          </TabsTrigger>
        </TabsList>

        {/* Monthly prediction */}
        <TabsContent
          value="monthly"
          className="space-y-6"
        >
          <MonthlyPredictionChart
            selectedYear={predictionYear}
          />
        </TabsContent>

        {/* Customer prediction */}
        <TabsContent
          value="customer"
          className="space-y-6"
        >
          <CustomerPredictionChart
            searchId={searchId}
            setSearchId={setSearchId}
            selectedYear={predictionYear}
          />
        </TabsContent>

        {/* Area prediction */}
        <TabsContent
          value="area"
          className="space-y-6"
        >
          <AreaPredictionChart
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedYear={predictionYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

