import '@/index.css';
import React from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { useAdmin } from '@/contexts/AdminContext';

/**
 * Admin dashboard page — served to SUPER_ADMIN, SYSTEM_ADMIN,
 * CUSTOMER_HANDLER, and METER_READER.
 */
export const DashboardPage: React.FC = () => {
  const { currentAdmin } = useAdmin();

  const roleGreeting: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin Dashboard',
    SYSTEM_ADMIN: 'System Admin Dashboard',
    CUSTOMER_HANDLER: 'Customer Handler Dashboard',
    METER_READER: 'Meter Reader Dashboard',
  };

  const roleSubtitle: Record<string, string> = {
    SUPER_ADMIN: 'Full system overview and management',
    SYSTEM_ADMIN: 'System operations and monitoring',
    CUSTOMER_HANDLER: 'Customer payments, slips, and inquiries',
    METER_READER: 'Meter reading entry and history',
  };

  return (
    <div className="w-full">
      <DashboardGrid
        greeting={roleGreeting[currentAdmin.role] ?? 'Dashboard'}
        subtitle={roleSubtitle[currentAdmin.role]}
        role={currentAdmin.role}
      />
    </div>
  );
};
