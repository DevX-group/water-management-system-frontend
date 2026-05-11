import React from 'react';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { exportPDF } from '@/util/exportPDF';

interface CustomerReportTabProps {
  customerSearch: string;
  setCustomerSearch: (v: string) => void;
  customerYear: string;
  setCustomerYear: (v: string) => void;
  customerChartData: any[];
  selectedCustomer: string;
  customerNames: Record<string, string>;
  customerColors: Record<string, string>;
}

export const CustomerReportTab: React.FC<CustomerReportTabProps> = ({
  customerSearch, setCustomerSearch, customerYear, setCustomerYear,
  customerChartData, selectedCustomer, customerNames, customerColors
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Customer-wise Usage and Revenue Report</CardTitle>
          <CardDescription>Individual customer consumption and billing trends for a selected year</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search Customer ID (C001, C002, C003)" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value.toUpperCase())} className="w-48" />
          <Select value={customerYear} onValueChange={setCustomerYear}>
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
          <LineChart data={customerChartData}>
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
            <Line
              type="monotone" dataKey="usage" name={`${customerNames[selectedCustomer as keyof typeof customerNames]} Usage (L)`}
              stroke={customerColors[selectedCustomer as keyof typeof customerColors]} strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => exportPDF({ [customerYear]: customerChartData }, `CustomerReport-${customerSearch}-${customerYear}.pdf`)}>
          <Download className="w-4 h-4 mr-2" /> Export as PDF
        </Button>
      </div>
    </CardContent>
  </Card>
);
