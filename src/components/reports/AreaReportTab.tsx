import React from 'react';
import { Download, Filter } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { exportPDF } from '@/util/exportPDF';

interface AreaReportTabProps {
  selectedArea: string;
  setSelectedArea: (v: string) => void;
  areaYear: string;
  setAreaYear: (v: string) => void;
  areaDataForYear: any[];
}

export const AreaReportTab: React.FC<AreaReportTabProps> = ({
  selectedArea, setSelectedArea, areaYear, setAreaYear, areaDataForYear
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Area-wise Usage and Revenue Report</CardTitle>
          <CardDescription>Usage and revenue trends summarized by area for comparison across regions</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="area1">Area 1</SelectItem>
              <SelectItem value="area2">Area 2</SelectItem>
              <SelectItem value="area3">Area 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={areaYear} onValueChange={setAreaYear}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['2023', '2024', '2025', '2026'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={areaDataForYear}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" label={{ value: '(L)', angle: -90, position: 'insideBottom' }} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" label={{ value: '(LKR)', angle: 90, position: 'insideBottom' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length && payload[0]?.payload) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-sm">
                      {(selectedArea === 'all' || selectedArea === 'area1') && <><p className="text-foreground">Area 1 Usage: {Number(data.area1Usage).toLocaleString()} L</p><p className="text-foreground">Area 1 Revenue: LKR {Number(data.area1Revenue).toLocaleString()}</p></>}
                      {(selectedArea === 'all' || selectedArea === 'area2') && <><p className="text-foreground">Area 2 Usage: {Number(data.area2Usage).toLocaleString()} L</p><p className="text-foreground">Area 2 Revenue: LKR {Number(data.area2Revenue).toLocaleString()}</p></>}
                      {(selectedArea === 'all' || selectedArea === 'area3') && <><p className="text-foreground">Area 3 Usage: {Number(data.area3Usage).toLocaleString()} L</p><p className="text-foreground">Area 3 Revenue: LKR {Number(data.area3Revenue).toLocaleString()}</p></>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {(selectedArea === 'all' || selectedArea === 'area1') && <Bar yAxisId="left" dataKey="area1Usage" name="Area 1 Usage (L)" fill="hsl(187, 75%, 35%)" radius={[4, 4, 0, 0]} />}
            {(selectedArea === 'all' || selectedArea === 'area2') && <Bar yAxisId="left" dataKey="area2Usage" name="Area 2 Usage (L)" fill="hsl(152, 70%, 40%)" radius={[4, 4, 0, 0]} />}
            {(selectedArea === 'all' || selectedArea === 'area3') && <Bar yAxisId="left" dataKey="area3Usage" name="Area 3 Usage (L)" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />}
            {(selectedArea === 'all' || selectedArea === 'area1') && <Line yAxisId="right" type="monotone" dataKey="area1Revenue" name="Area 1 Revenue (LKR)" stroke="hsl(187, 75%, 55%)" strokeWidth={2} />}
            {(selectedArea === 'all' || selectedArea === 'area2') && <Line yAxisId="right" type="monotone" dataKey="area2Revenue" name="Area 2 Revenue (LKR)" stroke="hsl(152, 70%, 60%)" strokeWidth={2} />}
            {(selectedArea === 'all' || selectedArea === 'area3') && <Line yAxisId="right" type="monotone" dataKey="area3Revenue" name="Area 3 Revenue (LKR)" stroke="hsl(38, 92%, 75%)" strokeWidth={2} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => exportPDF({ [areaYear]: areaDataForYear.map(r => ({ month: r.month, usage: r.area1Usage + r.area2Usage + r.area3Usage, revenue: r.area1Revenue + r.area2Revenue + r.area3Revenue })) }, `AreaReport-${areaYear}.pdf`)}>
          <Download className="w-4 h-4 mr-2" /> Export as PDF
        </Button>
      </div>
    </CardContent>
  </Card>
);
