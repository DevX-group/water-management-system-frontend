import '@/index.css';
import React from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { useAdmin } from '@/contexts/AdminContext';
import { useTranslation } from 'react-i18next';

/**
 * Admin dashboard page — served to SUPER_ADMIN, SYSTEM_ADMIN,
 * CUSTOMER_HANDLER, and METER_READER.
 */
export const DashboardPage: React.FC = () => {
  const { currentAdmin } = useAdmin();
  const { t } = useTranslation('widgetManagement');

  const role = currentAdmin.role;
  const greeting = t(`dashboardPage.roleGreeting.${role}`, t('page.title'));
  const subtitle = t(`dashboardPage.roleSubtitle.${role}`, '');

  return (
    <div className="w-full">
      <DashboardGrid
        greeting={greeting}
        subtitle={subtitle}
        role={role}
      />
    </div>
  );
};

