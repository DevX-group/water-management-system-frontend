import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    { month: 'Mar', usage: 25100, revenue: 753000 },
  ],
};

// Mock data for customer-wise usage and revenue
const customerWiseData = [
  { month: 'Jan', customer1: 45000, customer2: 38000, customer3: 52000 },
  { month: 'Feb', customer1: 48000, customer2: 42000, customer3: 50000 },
  { month: 'Mar', customer1: 50000, customer2: 45000, customer3: 58000 },
  { month: 'Apr', customer1: 52000, customer2: 48000, customer3: 62000 },
  { month: 'May', customer1: 55000, customer2: 50000, customer3: 65000 },
  { month: 'Jun', customer1: 58000, customer2: 52000, customer3: 68000 },
];

// Mock data for area-wise usage and revenue
const areaWiseData = [
  { month: 'Jan', area1: 120000, area2: 280000, area3: 335000 },
  { month: 'Feb', area1: 125000, area2: 275000, area3: 296000 },
  { month: 'Mar', area1: 130000, area2: 290000, area3: 333000 },
  { month: 'Apr', area1: 135000, area2: 305000, area3: 364000 },
  { month: 'May', area1: 140000, area2: 320000, area3: 389000 },
  { month: 'Jun', area1: 145000, area2: 335000, area3: 405000 },
];

// Mock data for paid vs unpaid bills
const billsData = [
  { status: 'Paid', count: 856 },
  { status: 'Unpaid', count: 124 },
];

const billsTableData = [
  { id: 'BL001', customer: 'John Doe', amount: 5500, dueDate: '2025-12-31', status: 'Paid' },
  { id: 'BL002', customer: 'Jane Smith', amount: 6200, dueDate: '2026-01-15', status: 'Paid' },
  { id: 'BL003', customer: 'Mike Johnson', amount: 4800, dueDate: '2026-01-20', status: 'Unpaid' },
  { id: 'BL004', customer: 'Sarah Williams', amount: 7100, dueDate: '2026-01-25', status: 'Paid' },
  { id: 'BL005', customer: 'Robert Brown', amount: 5900, dueDate: '2026-02-05', status: 'Unpaid' },
];

// Mock data for overdue payments
const overdueTableData = [
  { id: 'BL006', customer: 'Alice Davis', amount: 6500, dueDate: '2025-11-30', daysOverdue: 71 },
  { id: 'BL007', customer: 'Tom Wilson', amount: 5200, dueDate: '2025-12-15', daysOverdue: 55 },
  { id: 'BL008', customer: 'Emma Garcia', amount: 7800, dueDate: '2025-12-20', daysOverdue: 50 },
  { id: 'BL009', customer: 'David Martinez', amount: 4900, dueDate: '2026-01-05', daysOverdue: 35 },
  { id: 'BL010', customer: 'Lisa Anderson', amount: 6100, dueDate: '2026-01-10', daysOverdue: 30 },
];

export const ReportsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [customerSearch, setCustomerSearch] = useState('C001');
  const [selectedArea, setSelectedArea] = useState('all');

  const totalOverdueAmount = overdueTableData.reduce((sum, item) => sum + item.amount, 0);

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

  const customerChartData = customerWiseData.map((m) => {
    const usage = selectedCustomer === 'customer2' ? m.customer2 : selectedCustomer === 'customer3' ? m.customer3 : m.customer1;
    return {
      month: m.month,
      usage,
      revenue: usage * CUSTOMER_UNIT_RATE,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Summarized and detailed views of system data for monitoring and analysis</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaWiseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`LKR ${value.toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Bar dataKey="area1" name="Area 1" fill="hsl(187, 75%, 35%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="area2" name="Area 2" fill="hsl(152, 70%, 40%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="area3" name="Area 3" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billsTableData.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.id}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
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

              {/* Overdue Bills Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueTableData.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.id}</TableCell>
                        <TableCell>{bill.customer}</TableCell>
                        <TableCell>LKR {bill.amount.toLocaleString()}</TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            {bill.daysOverdue} days
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
