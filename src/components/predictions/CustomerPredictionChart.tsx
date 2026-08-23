import '@/index.css';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { customerPredictionData } from '@/utils/predictionData';
import { useTranslation } from 'react-i18next';

const CustomerTooltip = ({ active, payload }: any) => {
  const { t } = useTranslation('predictions');
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
      <p className="font-semibold mb-2">{d.month}</p>
      {d.usage !== null && <p>{t('customer.tooltipActualUsage', { value: d.usage.toLocaleString() })}</p>}
      {d.revenue !== null && <p>{t('customer.tooltipActualRevenue', { value: d.revenue.toLocaleString() })}</p>}
      {d.predictedUsage !== null && (
        <><p className="text-orange-500">{t('customer.tooltipPredictedUsage', { value: d.predictedUsage.toLocaleString() })}</p>
          <p className="text-orange-500">{t('customer.tooltipPredictedRevenue', { value: d.predictedRevenue.toLocaleString() })}</p></>
      )}
    </div>
  );
};

interface CustomerPredictionChartProps {
  searchId:    string;
  setSearchId: (v: string) => void;
}

export const CustomerPredictionChart: React.FC<CustomerPredictionChartProps> = ({ searchId, setSearchId }) => {
  const { t } = useTranslation('predictions');
  const filteredData = customerPredictionData.filter(d => d.customerId === searchId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('customer.title')}</CardTitle>
            <CardDescription>{t('customer.description')}</CardDescription>
          </div>
          <Input
            placeholder={t('customer.searchPlaceholder')}
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
              <ReferenceLine x="Jul" stroke="gray" strokeDasharray="3 3" label={t('customer.predictionStart')} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: t('customer.usageLabel'), angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomerTooltip />} />
              <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} name={t('customer.actualUsage')} connectNulls />
              <Line type="monotone" dataKey="predictedUsage" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name={t('customer.predictedUsage')} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
