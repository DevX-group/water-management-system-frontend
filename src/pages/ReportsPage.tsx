import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

// Mock data for monthly usage and revenue - different data for each year
const monthlyDataByYear = {
  2023: [
    { month: 'Jan', usage: 20500, revenue: 615000 },
    { month: 'Feb', usage: 21200, revenue: 636000 },
    { month: 'Mar', usage: 22100, revenue: 663000 },
    { month: 'Apr', usage: 23800, revenue: 714000 },
    { month: 'May', usage: 24300, revenue: 729000 },
    { month: 'Jun', usage: 25500, revenue: 765000 },
    { month: 'Jul', usage: 26200, revenue: 786000 },
    { month: 'Aug', usage: 25800, revenue: 774000 },
    { month: 'Sep', usage: 24600, revenue: 738000 },
    { month: 'Oct', usage: 23100, revenue: 693000 },
    { month: 'Nov', usage: 22400, revenue: 672000 },
    { month: 'Dec', usage: 23900, revenue: 717000 },
  ],
  2024: [
    { month: 'Jan', usage: 22500, revenue: 675000 },
    { month: 'Feb', usage: 22200, revenue: 666000 },
    { month: 'Mar', usage: 23100, revenue: 693000 },
    { month: 'Apr', usage: 24800, revenue: 744000 },
    { month: 'May', usage: 25300, revenue: 759000 },
    { month: 'Jun', usage: 26500, revenue: 795000 },
    { month: 'Jul', usage: 27200, revenue: 816000 },
    { month: 'Aug', usage: 26800, revenue: 804000 },
    { month: 'Sep', usage: 25600, revenue: 768000 },
    { month: 'Oct', usage: 24100, revenue: 723000 },
    { month: 'Nov', usage: 23400, revenue: 702000 },
    { month: 'Dec', usage: 24900, revenue: 747000 },
  ],
  2025: [
    { month: 'Jan', usage: 24500, revenue: 735000 },
    { month: 'Feb', usage: 23200, revenue: 696000 },
    { month: 'Mar', usage: 25100, revenue: 753000 },
    { month: 'Apr', usage: 26800, revenue: 804000 },
    { month: 'May', usage: 28300, revenue: 849000 },
    { month: 'Jun', usage: 29500, revenue: 885000 },
    { month: 'Jul', usage: 30200, revenue: 906000 },
    { month: 'Aug', usage: 29800, revenue: 894000 },
    { month: 'Sep', usage: 27600, revenue: 828000 },
    { month: 'Oct', usage: 26100, revenue: 783000 },
    { month: 'Nov', usage: 25400, revenue: 762000 },
    { month: 'Dec', usage: 26900, revenue: 807000 },
  ],
  2026: [
    { month: 'Jan', usage: 25800, revenue: 774000 },
    { month: 'Feb', usage: 23200, revenue: 696000 },
  ],
};

// Mock data for customer-wise usage and revenue, keyed by year
const customerWiseDataByYear: Record<string, { month: string; customer1: number; customer2: number; customer3: number }[]> = {
  '2023': [
    { month: 'Jan', customer1: 40000, customer2: 35000, customer3: 48000 },
    { month: 'Feb', customer1: 42000, customer2: 37000, customer3: 49000 },
    { month: 'Mar', customer1: 44000, customer2: 39000, customer3: 51000 },
    { month: 'Apr', customer1: 46000, customer2: 41000, customer3: 54000 },
    { month: 'May', customer1: 48000, customer2: 43000, customer3: 56000 },
    { month: 'Jun', customer1: 50000, customer2: 45000, customer3: 59000 },
    { month: 'Jul', customer1: 52000, customer2: 47000, customer3: 61000 },
    { month: 'Aug', customer1: 51000, customer2: 46000, customer3: 60000 },
    { month: 'Sep', customer1: 49000, customer2: 44000, customer3: 58000 },
    { month: 'Oct', customer1: 47000, customer2: 42000, customer3: 56000 },
    { month: 'Nov', customer1: 45000, customer2: 40000, customer3: 54000 },
    { month: 'Dec', customer1: 48000, customer2: 43000, customer3: 56000 },
  ],
  '2024': [
    { month: 'Jan', customer1: 43000, customer2: 37000, customer3: 51000 },
    { month: 'Feb', customer1: 45000, customer2: 39000, customer3: 52000 },
    { month: 'Mar', customer1: 47000, customer2: 41000, customer3: 54000 },
    { month: 'Apr', customer1: 49000, customer2: 43000, customer3: 56000 },
    { month: 'May', customer1: 51000, customer2: 45000, customer3: 58000 },
    { month: 'Jun', customer1: 53000, customer2: 47000, customer3: 60000 },
    { month: 'Jul', customer1: 55000, customer2: 49000, customer3: 62000 },
    { month: 'Aug', customer1: 54000, customer2: 48000, customer3: 61000 },
    { month: 'Sep', customer1: 52000, customer2: 46000, customer3: 59000 },
    { month: 'Oct', customer1: 50000, customer2: 44000, customer3: 57000 },
    { month: 'Nov', customer1: 48000, customer2: 42000, customer3: 55000 },
    { month: 'Dec', customer1: 51000, customer2: 45000, customer3: 58000 },
  ],
  '2025': [
    { month: 'Jan', customer1: 45000, customer2: 38000, customer3: 52000 },
    { month: 'Feb', customer1: 48000, customer2: 42000, customer3: 50000 },
    { month: 'Mar', customer1: 50000, customer2: 45000, customer3: 58000 },
    { month: 'Apr', customer1: 52000, customer2: 48000, customer3: 62000 },
    { month: 'May', customer1: 55000, customer2: 50000, customer3: 65000 },
    { month: 'Jun', customer1: 58000, customer2: 52000, customer3: 68000 },
    { month: 'Jul', customer1: 61000, customer2: 54000, customer3: 71000 },
    { month: 'Aug', customer1: 59000, customer2: 52000, customer3: 69000 },
    { month: 'Sep', customer1: 57000, customer2: 50000, customer3: 67000 },
    { month: 'Oct', customer1: 53000, customer2: 48000, customer3: 63000 },
    { month: 'Nov', customer1: 51000, customer2: 46000, customer3: 61000 },
    { month: 'Dec', customer1: 55000, customer2: 50000, customer3: 65000 },
  ],
  '2026': [
    { month: 'Jan', customer1: 48000, customer2: 42000, customer3: 54000 },
    { month: 'Feb', customer1: 46000, customer2: 40000, customer3: 52000 },
  ],
};

// Mock data for area-wise usage and revenue
const areaWiseData = [
  { month: 'Jan', area1Revenue: 120000, area1Usage: 45000, area2Revenue: 280000, area2Usage: 95000, area3Revenue: 335000, area3Usage: 115000 },
  { month: 'Feb', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 275000, area2Usage: 92000, area3Revenue: 296000, area3Usage: 105000 },
  { month: 'Mar', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 290000, area2Usage: 98000, area3Revenue: 333000, area3Usage: 112000 },
  { month: 'Apr', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 364000, area3Usage: 125000 },
  { month: 'May', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 389000, area3Usage: 133000 },
  { month: 'Jun', area1Revenue: 145000, area1Usage: 56000, area2Revenue: 335000, area2Usage: 113000, area3Revenue: 405000, area3Usage: 138000 },
];

// Per-year area-wise mock data (with both revenue and usage)
const areaWiseDataByYear: Record<string, { month: string; area1Revenue: number; area1Usage: number; area2Revenue: number; area2Usage: number; area3Revenue: number; area3Usage: number }[]> = {
  '2023': [
    { month: 'Jan', area1Revenue: 110000, area1Usage: 42000, area2Revenue: 260000, area2Usage: 88000, area3Revenue: 310000, area3Usage: 105000 },
    { month: 'Feb', area1Revenue: 115000, area1Usage: 44000, area2Revenue: 255000, area2Usage: 86000, area3Revenue: 295000, area3Usage: 100000 },
    { month: 'Mar', area1Revenue: 120000, area1Usage: 46000, area2Revenue: 270000, area2Usage: 91000, area3Revenue: 320000, area3Usage: 108000 },
    { month: 'Apr', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 285000, area2Usage: 96000, area3Revenue: 345000, area3Usage: 116000 },
    { month: 'May', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 370000, area3Usage: 125000 },
    { month: 'Jun', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 315000, area2Usage: 106000, area3Revenue: 385000, area3Usage: 130000 },
    { month: 'Jul', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 330000, area2Usage: 111000, area3Revenue: 400000, area3Usage: 135000 },
    { month: 'Aug', area1Revenue: 138000, area1Usage: 53000, area2Revenue: 325000, area2Usage: 109000, area3Revenue: 395000, area3Usage: 133000 },
    { month: 'Sep', area1Revenue: 136000, area1Usage: 52000, area2Revenue: 320000, area2Usage: 107000, area3Revenue: 390000, area3Usage: 131000 },
    { month: 'Oct', area1Revenue: 132000, area1Usage: 50000, area2Revenue: 310000, area2Usage: 104000, area3Revenue: 380000, area3Usage: 128000 },
    { month: 'Nov', area1Revenue: 128000, area1Usage: 49000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 370000, area3Usage: 125000 },
    { month: 'Dec', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 375000, area3Usage: 127000 },
  ],
  '2024': [
    { month: 'Jan', area1Revenue: 115000, area1Usage: 44000, area2Revenue: 270000, area2Usage: 91000, area3Revenue: 320000, area3Usage: 108000 },
    { month: 'Feb', area1Revenue: 120000, area1Usage: 46000, area2Revenue: 275000, area2Usage: 93000, area3Revenue: 310000, area3Usage: 105000 },
    { month: 'Mar', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 285000, area2Usage: 96000, area3Revenue: 330000, area3Usage: 112000 },
    { month: 'Apr', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 355000, area3Usage: 120000 },
    { month: 'May', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 315000, area2Usage: 106000, area3Revenue: 380000, area3Usage: 129000 },
    { month: 'Jun', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 330000, area2Usage: 111000, area3Revenue: 395000, area3Usage: 134000 },
    { month: 'Jul', area1Revenue: 145000, area1Usage: 56000, area2Revenue: 345000, area2Usage: 116000, area3Revenue: 410000, area3Usage: 139000 },
    { month: 'Aug', area1Revenue: 143000, area1Usage: 55000, area2Revenue: 340000, area2Usage: 114000, area3Revenue: 405000, area3Usage: 137000 },
    { month: 'Sep', area1Revenue: 141000, area1Usage: 54000, area2Revenue: 335000, area2Usage: 113000, area3Revenue: 400000, area3Usage: 135000 },
    { month: 'Oct', area1Revenue: 137000, area1Usage: 52000, area2Revenue: 325000, area2Usage: 109000, area3Revenue: 390000, area3Usage: 132000 },
    { month: 'Nov', area1Revenue: 133000, area1Usage: 51000, area2Revenue: 315000, area2Usage: 106000, area3Revenue: 380000, area3Usage: 129000 },
    { month: 'Dec', area1Revenue: 136000, area1Usage: 52000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 385000, area3Usage: 130000 },
  ],
  '2025': [
    { month: 'Jan', area1Revenue: 120000, area1Usage: 45000, area2Revenue: 280000, area2Usage: 95000, area3Revenue: 335000, area3Usage: 115000 },
    { month: 'Feb', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 275000, area2Usage: 92000, area3Revenue: 296000, area3Usage: 105000 },
    { month: 'Mar', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 290000, area2Usage: 98000, area3Revenue: 333000, area3Usage: 112000 },
    { month: 'Apr', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 364000, area3Usage: 125000 },
    { month: 'May', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 389000, area3Usage: 133000 },
    { month: 'Jun', area1Revenue: 145000, area1Usage: 56000, area2Revenue: 335000, area2Usage: 113000, area3Revenue: 405000, area3Usage: 138000 },
    { month: 'Jul', area1Revenue: 150000, area1Usage: 58000, area2Revenue: 350000, area2Usage: 118000, area3Revenue: 420000, area3Usage: 143000 },
    { month: 'Aug', area1Revenue: 148000, area1Usage: 57000, area2Revenue: 345000, area2Usage: 116000, area3Revenue: 415000, area3Usage: 141000 },
    { month: 'Sep', area1Revenue: 146000, area1Usage: 56000, area2Revenue: 340000, area2Usage: 114000, area3Revenue: 410000, area3Usage: 139000 },
    { month: 'Oct', area1Revenue: 142000, area1Usage: 54000, area2Revenue: 330000, area2Usage: 111000, area3Revenue: 400000, area3Usage: 136000 },
    { month: 'Nov', area1Revenue: 138000, area1Usage: 53000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 390000, area3Usage: 133000 },
    { month: 'Dec', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 325000, area2Usage: 110000, area3Revenue: 395000, area3Usage: 134000 },
  ],
  '2026': [
    { month: 'Jan', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 360000, area3Usage: 122000 },
    { month: 'Feb', area1Revenue: 128000, area1Usage: 49000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 350000, area3Usage: 118000 },
  ],
};

// Mock data for paid vs unpaid bills
const billsData = [
  { status: 'Paid', count: 856 },
  { status: 'Unpaid', count: 124 },
];

const billsTableData = [
  { id: 'BL101', customerid: 'C001', customer: 'John Doe', amount: 5500, dueDate: '2025-12-31', status: 'Paid' },
  { id: 'BL112', customerid: 'C002', customer: 'Jane Smith', amount: 6200, dueDate: '2026-01-15', status: 'Unpaid' },
  { id: 'BL213', customerid: 'C003', customer: 'Mike Johnson', amount: 4800, dueDate: '2026-01-20', status: 'Paid' },
];

// Mock data for overdue payments
const overdueTableData = [
  { id: 'BL006', customerid: 'C001', customer: 'Alice Davis', amount: 6500, dueDate: '2025-11-30', daysOverdue: 71 },
  { id: 'BL007', customerid: 'C002', customer: 'Tom Wilson', amount: 5200, dueDate: '2025-12-15', daysOverdue: 55 },
  { id: 'BL008', customerid: 'C003', customer: 'Emma Garcia', amount: 7800, dueDate: '2025-12-20', daysOverdue: 50 },
  { id: 'BL009', customerid: 'C004', customer: 'David Martinez', amount: 4900, dueDate: '2026-01-05', daysOverdue: 35 },
  { id: 'BL010', customerid: 'C005', customer: 'Lisa Anderson', amount: 6100, dueDate: '2026-01-10', daysOverdue: 30 },
];

export const ReportsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2026');

  const [customerSearch, setCustomerSearch] = useState('C001');
  const [customerYear, setCustomerYear] = useState('2026');

  const [selectedArea, setSelectedArea] = useState('all');
  const [areaYear, setAreaYear] = useState('2026');

  const [customerSearchBill, setCustomerSearchBill] = useState(""); 

  const [overdueBill, setoverdueBill] = useState("");

  // Map customer ID to internal customer reference
  const getCustomerKeyFromId = (customerId: string): string => {
    const idMap: Record<string, string> = {
      'C001': 'customer1',
      'C002': 'customer2',
      'C003': 'customer3',
    };
    return idMap[customerId.toUpperCase()] || 'customer1';
  };

  const selectedCustomer = getCustomerKeyFromId(customerSearch);

  // Prepare customer-specific chart data (only the selected customer)
  const customerNames: Record<string, string> = {
    customer1: 'Customer 1',
    customer2: 'Customer 2',
    customer3: 'Customer 3',
  };

  const customerColors: Record<string, string> = {
    customer1: 'hsl(187, 75%, 35%)',
    customer2: 'hsl(152, 70%, 40%)',
    customer3: 'hsl(38, 92%, 55%)',
  };

  // For customers we only have usage in mock data; derive revenue using a per-unit rate
  const CUSTOMER_UNIT_RATE = 15; // LKR per unit (mock)

  const customerDataForYear = customerWiseDataByYear[customerYear] || customerWiseDataByYear['2026'];

  const customerChartData = customerDataForYear.map((m) => {
    const usage = selectedCustomer === 'customer2' ? m.customer2 : selectedCustomer === 'customer3' ? m.customer3 : m.customer1;
    return {
      month: m.month,
      usage,
      revenue: usage * CUSTOMER_UNIT_RATE,
    };
  });

  const areaDataForYear = areaWiseDataByYear[areaYear] || areaWiseData;

  //Seach Bar for bills report + default shows all bills  
  const filteredBills = customerSearchBill
    ? billsTableData.filter((bill) =>
        bill.customerid.toUpperCase().includes(customerSearchBill)
      )
    : billsTableData;

  //Serach bar for Overdue report + default shows all overdue bills
  const filteredOverdue = overdueBill
    ? overdueTableData.filter((overdue) =>
        overdue.customerid.toUpperCase().includes(overdueBill)
    )
    : overdueTableData;

  const totalOverdueAmount = overdueTableData.reduce((sum, item) => sum + item.amount, 0);  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Summarized and detailed views of system data for monitoring and analysis</p>
      </div>

      {/* Tabs for different report types */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="customer">Customer Report</TabsTrigger>
          <TabsTrigger value="area">Area Report</TabsTrigger>
          <TabsTrigger value="bills">Bills Report</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Report</TabsTrigger>
        </TabsList>

        {/* Monthly Usage and Revenue Report */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Usage and Revenue Report</CardTitle>
                  <CardDescription>Usage and revenue trends across months for a selected year</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
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
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload;
                          if (data) {
                            return (
                              <div className="bg-card border border-border rounded-lg p-2 text-sm">
                                <p className="text-foreground">{`Usage: ${Number(data.usage).toLocaleString()} L`}</p>
                                <p className="text-foreground">{`Revenue: LKR ${Number(data.revenue).toLocaleString()}`}</p>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="usage" name="Usage (L)" stroke="hsl(187, 75%, 35%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end">
                <Button>
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer-wise Usage and Revenue Report */}
        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer-wise Usage and Revenue Report</CardTitle>
                  <CardDescription>Individual customer consumption and billing trends for a selected year</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search Customer ID (C001, C002, C003)"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value.toUpperCase())}
                    className="w-48"
                  />
                  <Select value={customerYear} onValueChange={setCustomerYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
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
                  <LineChart data={customerChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Usage (L)', position: 'top', offset: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload;
                          if (data) {
                            return (
                              <div className="bg-card border border-border rounded-lg p-2 text-sm">
                                <p className="text-foreground">{`Usage: ${Number(data.usage).toLocaleString()} L`}</p>
                                <p className="text-foreground">{`Revenue: LKR ${Number(data.revenue).toLocaleString()}`}</p>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      name={`${customerNames[selectedCustomer as keyof typeof customerNames]} Usage (L)`}
                      stroke={customerColors[selectedCustomer as keyof typeof customerColors]}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end">
                <Button>
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Area-wise Usage and Revenue Report */}
        <TabsContent value="area" className="space-y-6">
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
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="area1">Area 1</SelectItem>
                      <SelectItem value="area2">Area 2</SelectItem>
                      <SelectItem value="area3">Area 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={areaYear} onValueChange={setAreaYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
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
                  <ComposedChart data={areaDataForYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" label={{ value: '(L)', angle: -90, position: 'insideBottom' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" label={{ value: '(LKR)', angle: 90, position: 'insideBottom' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload;
                          if (data) {
                            return (
                              <div className="bg-card border border-border rounded-lg p-2 text-sm">
                                {(selectedArea === 'all' || selectedArea === 'area1') && (
                                  <>
                                    <p className="text-foreground">{`Area 1 Usage: ${Number(data.area1Usage).toLocaleString()} L`}</p>
                                    <p className="text-foreground">{`Area 1 Revenue: LKR ${Number(data.area1Revenue).toLocaleString()}`}</p>
                                  </>
                                )}
                                {(selectedArea === 'all' || selectedArea === 'area2') && (
                                  <>
                                    <p className="text-foreground">{`Area 2 Usage: ${Number(data.area2Usage).toLocaleString()} L`}</p>
                                    <p className="text-foreground">{`Area 2 Revenue: LKR ${Number(data.area2Revenue).toLocaleString()}`}</p>
                                  </>
                                )}
                                {(selectedArea === 'all' || selectedArea === 'area3') && (
                                  <>
                                    <p className="text-foreground">{`Area 3 Usage: ${Number(data.area3Usage).toLocaleString()} L`}</p>
                                    <p className="text-foreground">{`Area 3 Revenue: LKR ${Number(data.area3Revenue).toLocaleString()}`}</p>
                                  </>
                                )}
                              </div>
                            );
                          }
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
              <div className="flex justify-end">
                <Button>
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paid vs Unpaid Bills Report */}
        <TabsContent value="bills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paid vs Unpaid Bills Report</CardTitle>
              <CardDescription>Overview of bill payment status with comparison and detailed listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" name="Number of Bills" fill="hsl(187, 75%, 35%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end">
                  <Input 
                    placeholder="Search Customer ID (C001, C002, C003)"
                    value={customerSearchBill}
                    onChange={(e) => setCustomerSearchBill(e.target.value.toUpperCase())}
                    className="w-48"
                  />
              </div>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.length > 0 ? (
                      filteredBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.id}</TableCell>
                        <TableCell>{bill.customerid}</TableCell>
                        <TableCell>{bill.customer}</TableCell>
                        <TableCell>LKR {bill.amount.toLocaleString()}</TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bill.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bill.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                    ) : (     //condition ? valueIfTrue : valueIfFalse in jsx
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button>
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue Payments Report */}
        <TabsContent value="overdue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments Report</CardTitle>
              <CardDescription>Unpaid bills that have passed their due dates with financial risk analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Overdue Amount</p>
                  <p className="text-3xl font-bold text-destructive">LKR {totalOverdueAmount.toLocaleString()}</p>
                </div>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Number of Overdue Bills</p>
                  <p className="text-3xl font-bold text-destructive">{overdueTableData.length}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Input 
                  placeholder="Search Customer ID (C001, C002, C003)"
                  value={overdueBill}
                  onChange={(e) => setoverdueBill(e.target.value.toUpperCase())}
                  className="w-48"
                />
              </div>

              {/* Overdue Bills Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOverdue.length > 0 ? (
                    filteredOverdue.map((overdue) => (
                      <TableRow key={overdue.id}>
                        <TableCell className="font-medium">{overdue.id}</TableCell>
                        <TableCell>{overdue.customerid}</TableCell>
                        <TableCell>{overdue.customer}</TableCell>
                        <TableCell>LKR {overdue.amount.toLocaleString()}</TableCell>
                        <TableCell>{overdue.dueDate}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            {overdue.daysOverdue} days
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
                  )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button>
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
