import '@/index.css';
import React from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { MainLayout } from '@/components/layout/MainLayout';

/**
 * Customer-facing dashboard.
 * The DashboardGrid fetches the CUSTOMER-role dashboard config from
 * GET /api/dashboards/me and renders widgets via the allow-listed WidgetRenderer.
 */
const Dashboard: React.FC = () => {
  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <DashboardGrid
          greeting="Welcome Back"
          subtitle="Your water account at a glance"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;