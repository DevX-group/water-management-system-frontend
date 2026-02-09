import React from 'react';
import { Users, DollarSign, Droplets, AlertTriangle } from 'lucide-react';
import { mockDashboardStats } from '@/data/mockData';
import { StatCard } from '@/components/common/StatCard';
import { UsageChart}  from '@/components/charts/UsageChart';
import { IncomeChart } from '@/components/charts/IncomeChart';

export const DashboardPage = () => {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your water utility overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          trend={stats.customerGrowth}
          subtitle="from last month"
          icon={Users}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Monthly Revenue"
          value={`LKR ${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          trend={stats.revenueGrowth}
          subtitle="from last month"
          icon={DollarSign}
          variant="success"
          delay={50}
        />
        <StatCard
          title="Water Distributed"
          value={`${stats.waterDistributed.toLocaleString()} L`}
          trend={12}
          subtitle="from last month"
          icon={Droplets}
          variant="default"
          delay={100}
        />
        <StatCard
          title="Outstanding Bills"
          value={stats.outstandingBills}
          subtitle={`${stats.overdueCount} overdue bills`}
          icon={AlertTriangle}
          variant="accent"
          delay={150}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart />
        <IncomeChart />
      </div>
    </div>
  );
};
