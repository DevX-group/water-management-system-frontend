import '@/index.css';
import React from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTranslation } from 'react-i18next';

/**
 * Customer-facing dashboard.
 * The DashboardGrid fetches the CUSTOMER-role dashboard config from
 * GET /api/dashboards/me and renders widgets via the allow-listed WidgetRenderer.
 */
const Dashboard: React.FC = () => {
  const { t } = useTranslation('widgetManagement');

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <DashboardGrid
          greeting={t('dashboardPage.customerGreeting')}
          subtitle={t('dashboardPage.customerSubtitle')}
          role="CUSTOMER"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;