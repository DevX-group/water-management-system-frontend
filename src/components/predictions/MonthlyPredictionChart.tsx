import '@/index.css';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { monthlyPredictionData } from '@/utils/predictionData';
import { useTranslation } from 'react-i18next';

const PredictionTooltip = ({ active, payload }: any) => {
  const { t } = useTranslation('predictions');
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
      <p className="font-semibold mb-2">{d.month}</p>
      {d.usage !== null && <><p>{t('monthly.tooltipActualUsage', { value: d.usage.toLocaleString() })}</p><p>{t('monthly.tooltipActualRevenue', { value: d.revenue.toLocaleString() })}</p></>}
      {d.predictedUsage !== null && (
        <><p className="text-orange-500">{t('monthly.tooltipPredictedUsage', { value: d.predictedUsage.toLocaleString() })}</p>
          <p className="text-orange-500">{t('monthly.tooltipPredictedRevenue', { value: d.predictedRevenue.toLocaleString() })}</p></>
      )}
    </div>
  );
};

export const MonthlyPredictionChart: React.FC = () => {
  const { t } = useTranslation('predictions');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('monthly.title')}</CardTitle>
        <CardDescription>{t('monthly.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPredictionData}>
              <ReferenceLine x="Jul" stroke="gray" strokeDasharray="3 3" label={t('monthly.predictionStart')} />
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: t('monthly.usageLabel'), position: 'top', offset: 10 }} />
              <Tooltip content={<PredictionTooltip />} />
              <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} name={t('monthly.actualUsage')} connectNulls />
              <Line type="monotone" dataKey="predictedUsage" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name={t('monthly.predictedUsage')} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
