import '@/index.css';
import React from 'react';
import { Filter } from 'lucide-react';
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { areaWiseData2026 } from '@/utils/predictionData';
import { useTranslation } from 'react-i18next';

interface AreaPredictionChartProps {
  selectedArea:    string;
  areaYear:        string;
  setSelectedArea: (v: string) => void;
}

export const AreaPredictionChart: React.FC<AreaPredictionChartProps> = ({
  selectedArea, areaYear, setSelectedArea,
}) => {
  const { t } = useTranslation('predictions');
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('area.title', { year: areaYear })}</CardTitle>
            <CardDescription>{t('area.description')}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('area.allAreas')}</SelectItem>
                <SelectItem value="area1">{t('area.area1')}</SelectItem>
                <SelectItem value="area2">{t('area.area2')}</SelectItem>
                <SelectItem value="area3">{t('area.area3')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={areaWiseData2026}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: '(L)', angle: -90, position: 'insideBottomLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: '(LKR)', angle: 90, position: 'insideBottomRight' }} />
              <Tooltip /><Legend />

              {(selectedArea === 'all' || selectedArea === 'area1') && (
                <><Bar yAxisId="left" dataKey="area1Usage" name={t('area.series.area1Usage')} fill="#0ea5e9" />
                  <Bar yAxisId="right" dataKey="area1Revenue" name={t('area.series.area1Revenue')} fill="#0369a1" />
                  <Bar yAxisId="left" dataKey="predictedArea1Usage" name={t('area.series.predictedArea1Usage')} fill="#93c5fd" />
                  <Bar yAxisId="right" dataKey="predictedArea1Revenue" name={t('area.series.predictedArea1Revenue')} fill="#60a5fa" /></>
              )}
              {(selectedArea === 'all' || selectedArea === 'area2') && (
                <><Bar yAxisId="left" dataKey="area2Usage" name={t('area.series.area2Usage')} fill="#22c55e" />
                  <Bar yAxisId="right" dataKey="area2Revenue" name={t('area.series.area2Revenue')} fill="#15803d" />
                  <Bar yAxisId="left" dataKey="predictedArea2Usage" name={t('area.series.predictedArea2Usage')} fill="#86efac" />
                  <Bar yAxisId="right" dataKey="predictedArea2Revenue" name={t('area.series.predictedArea2Revenue')} fill="#4ade80" /></>
              )}
              {(selectedArea === 'all' || selectedArea === 'area3') && (
                <><Bar yAxisId="left" dataKey="area3Usage" name={t('area.series.area3Usage')} fill="#f59e0b" />
                  <Bar yAxisId="right" dataKey="area3Revenue" name={t('area.series.area3Revenue')} fill="#b45309" />
                  <Bar yAxisId="left" dataKey="predictedArea3Usage" name={t('area.series.predictedArea3Usage')} fill="#fde68a" />
                  <Bar yAxisId="right" dataKey="predictedArea3Revenue" name={t('area.series.predictedArea3Revenue')} fill="#facc15" /></>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
