import '@/index.css';
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardPage } from './DashboardPage';
import { MeterReadingPage } from './MeterReadingPage';
import { PaymentsPage } from './PaymentsPage';
import { PaymentsAddingPage } from './PaymentsAddingPage';
import { BillingPage } from './BillingPage';
import { MessagingPage } from './MessagingPage';
import { AdminInquiriesPage } from './AdminInquiriesPage';
import { ReportsPage } from './ReportsPage';
import { PredictionsPage } from './PredictionsPage';  
import { UserManagementPage } from './UserManagementPage';
import NotFound from './NotFound';
import '../admin.css';
import { BankSlipReviewPage } from './BankSlipReviewPage';
import { AdminBlogPage } from './AdminBlogPage';
import { AdminSettings } from './AdminSettings';
import { SystemSettingsPage } from './SystemSettingsPage';
import type { Section } from '@/types/admin';
import { canAccessSection, getDefaultAdminPath, isAdminRole } from '@/utils/adminAccess';

const getSectionFromPath = (pathname: string): Section => {
  const sections: Section[] = ['users', 'meter', 'payments', 'billing', 'messaging', 'inquiry', 'reports', 'predictions', 'blog', 'system-settings'];
  return sections.find(s => pathname.startsWith(`/admin/${s}`)) || 'dashboard';
};

const DashboardContent: React.FC = () => {
  const { currentAdmin } = useAdmin();
  const { user } = useAuth();
  const location = useLocation();
  const adminRole = isAdminRole(user?.role) ? user.role : currentAdmin.role;
  const activeSection = getSectionFromPath(location.pathname);

  if (!canAccessSection(adminRole, activeSection)) {
    return <Navigate to={getDefaultAdminPath(adminRole)} replace />;
  }

  return (
    <div className="admin-wrapper">
      <AdminLayout activeSection={activeSection}>
        <Routes>
          <Route index element={<Navigate to={getDefaultAdminPath(adminRole)} replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="meter" element={<MeterReadingPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/customer/:subscriptionNumber" element={<PaymentsAddingPage />} />
          <Route path="payments/slip/:slipId" element={<BankSlipReviewPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="messaging/*" element={<MessagingPage />} />
          <Route path="inquiry" element={<AdminInquiriesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="system-settings" element={<SystemSettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AdminLayout>
    </div>
  );
};

const Index: React.FC = () => (
  <AdminProvider>
    <DashboardContent />
  </AdminProvider>
);

export default Index;