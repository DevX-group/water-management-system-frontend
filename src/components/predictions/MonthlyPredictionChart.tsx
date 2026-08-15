import '@/index.css';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { monthlyPredictionData } from '@/utils/predictionData';

const PredictionTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
      <p className="font-semibold mb-2">{d.month}</p>
      {d.usage !== null && <><p>Actual Usage: {d.usage.toLocaleString()} L</p><p>Actual Revenue: LKR {d.revenue.toLocaleString()}</p></>}
      {d.predictedUsage !== null && (
        <><p className="text-orange-500">Predicted Usage: {d.predictedUsage.toLocaleString()} L</p>
          <p className="text-orange-500">Predicted Revenue: LKR {d.predictedRevenue.toLocaleString()}</p></>
      )}
    </div>
  );
};

export const MonthlyPredictionChart: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Monthly Usage and Revenue Report Prediction - 2026</CardTitle>
      <CardDescription>Individual customer consumption and billing trends predicted up to 3 months</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyPredictionData}>
            <ReferenceLine x="Jul" stroke="gray" strokeDasharray="3 3" label="Prediction Start" />
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Usage (L)', position: 'top', offset: 10 }} />
            <Tooltip content={<PredictionTooltip />} />
            <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} name="Actual Usage" connectNulls />
            <Line type="monotone" dataKey="predictedUsage" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name="Predicted Usage" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);
