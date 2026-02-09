import React from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { mockRevenueData, mockExpensesData } from '@/data/mockData';

const overdueData = [
  { name: '30 days', value: 45, color: 'hsl(38, 92%, 55%)' },
  { name: '60 days', value: 28, color: 'hsl(25, 95%, 53%)' },
  { name: '90+ days', value: 12, color: 'hsl(0, 84%, 60%)' },
];

const revenueForcast = [
  { name: 'Jan', actual: 380000, forecast: 400000 },
  { name: 'Feb', actual: 420000, forecast: 430000 },
  { name: 'Mar', actual: 390000, forecast: 420000 },
  { name: 'Apr', actual: null, forecast: 460000 },
  { name: 'May', actual: null, forecast: 490000 },
  { name: 'Jun', actual: null, forecast: 520000 },
];

export const ReportsPage = () => {
  const incomeVsExpenses = mockRevenueData.map((item, index) => ({
    name: item.name,
    income: item.value,
    expenses: mockExpensesData[index]?.value || 0,
    profit: item.value - (mockExpensesData[index]?.value || 0),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground">Detailed financial performance and analytics</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-md animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">LKR 5.4M</p>
          <div className="flex items-center gap-1 text-success text-sm mt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+12% YoY</span>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-md animate-slide-up" style={{ animationDelay: '50ms' }}>
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-foreground">LKR 3.2M</p>
          <div className="flex items-center gap-1 text-destructive text-sm mt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+8% YoY</span>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-success">LKR 2.2M</p>
          <div className="flex items-center gap-1 text-success text-sm mt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+18% YoY</span>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-md animate-slide-up" style={{ animationDelay: '150ms' }}>
          <p className="text-sm text-muted-foreground mb-1">Collection Rate</p>
          <p className="text-2xl font-bold text-foreground">94.5%</p>
          <div className="flex items-center gap-1 text-success text-sm mt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+2.3% MoM</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Income vs Expenses</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`LKR ${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="hsl(152, 70%, 40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Forecast</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueForcast}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number | null) => value ? [`LKR ${value.toLocaleString()}`, ''] : ['N/A', '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual" 
                  stroke="hsl(187, 75%, 35%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(187, 75%, 35%)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast" 
                  stroke="hsl(38, 92%, 55%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(38, 92%, 55%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Overdue Analysis */}
      <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-6">Overdue Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overdueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {overdueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`${value} customers`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {overdueData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-foreground">{item.name} overdue</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{item.value} customers</p>
                  <p className="text-sm text-muted-foreground">LKR {(item.value * 1500).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-medium text-foreground">Total Overdue</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-destructive">85 customers</p>
                <p className="text-sm text-muted-foreground">LKR 127,500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
