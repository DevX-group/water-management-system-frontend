import '@/index.css';
import React from 'react';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { exportPDF } from '@/util/exportPDF';
import { monthlyDataByYear } from '@/utils/reportData';

interface MonthlyReportTabProps {
  selectedYear: string;
  setSelectedYear: (y: string) => void;
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ selectedYear, setSelectedYear }) => (
  <Card id="monthly-report">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Monthly Usage and Revenue Report</CardTitle>
          <CardDescription>Usage and revenue trends across months for a selected year</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyDataByYear[selectedYear as '2023' | '2024' | '2025' | '2026'] || monthlyDataByYear['2025']}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Usage (L)', position: 'top', offset: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length && payload[0]?.payload) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-sm">
                      <p className="text-foreground">Usage: {Number(data.usage).toLocaleString()} L</p>
                      <p className="text-foreground">Revenue: LKR {Number(data.revenue).toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="usage" name="Usage (L)" stroke="hsl(187, 75%, 35%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => exportPDF(monthlyDataByYear, `MonthlyReport-${selectedYear}.pdf`)}>
          <Download className="w-4 h-4 mr-2" /> Export as PDF
        </Button>
      </div>
    </CardContent>
  </Card>
);
