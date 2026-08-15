import '@/index.css';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { customerPredictionData } from '@/utils/predictionData';

const CustomerTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
      <p className="font-semibold mb-2">{d.month}</p>
      {d.usage !== null && <p>Actual Usage: {d.usage.toLocaleString()} L</p>}
      {d.revenue !== null && <p>Actual Revenue: LKR {d.revenue.toLocaleString()}</p>}
      {d.predictedUsage !== null && (
        <><p className="text-orange-500">Predicted Usage: {d.predictedUsage.toLocaleString()} L</p>
          <p className="text-orange-500">Predicted Revenue: LKR {d.predictedRevenue.toLocaleString()}</p></>
      )}
    </div>
  );
};

interface CustomerPredictionChartProps {
  searchId:    string;
  setSearchId: (v: string) => void;
}

export const CustomerPredictionChart: React.FC<CustomerPredictionChartProps> = ({ searchId, setSearchId }) => {
  const filteredData = customerPredictionData.filter(d => d.customerId === searchId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Usage Prediction - 2026</CardTitle>
            <CardDescription>Forecasted usage for selected customer up to 3 months</CardDescription>
          </div>
          <Input
            placeholder="Customer ID (e.g., C001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            className="w-48"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <ReferenceLine x="Jul" stroke="gray" strokeDasharray="3 3" label="Prediction Start" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Usage (L)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomerTooltip />} />
              <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} name="Actual Usage" connectNulls />
              <Line type="monotone" dataKey="predictedUsage" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name="Predicted Usage" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
