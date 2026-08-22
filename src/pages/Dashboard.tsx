import '@/index.css';
import React from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

/**
 * Customer-facing dashboard.
 * The DashboardGrid fetches the CUSTOMER-role dashboard config from
 * GET /api/dashboards/me and renders widgets via the allow-listed WidgetRenderer.
 */
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <DashboardGrid
          greeting="Welcome Back"
          subtitle="Your water account at a glance"
        />
      </div>
    </div>
  );
};

export default Dashboard;