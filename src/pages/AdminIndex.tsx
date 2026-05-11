import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
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
import type { AdminRole, Section } from '@/types/admin';

const sectionPathMap: Record<Section, string> = {
  dashboard: '/admin/dashboard',
  users: '/admin/users',
  meter: '/admin/meter',
  payments: '/admin/payments',
  billing: '/admin/billing',
  messaging: '/admin/messaging',
  inquiry: '/admin/inquiry',
  reports: '/admin/reports',
  predictions: '/admin/predictions',
  blog: '/admin/blog',
};

const getDefaultAdminPath = (role: AdminRole): string => {
  if (role === 'meter_reader') return sectionPathMap.meter;
  if (role === 'payment_handler') return sectionPathMap.payments;
  return sectionPathMap.dashboard;
};

const getSectionFromPath = (pathname: string): Section => {
  const sections: Section[] = ['users', 'meter', 'payments', 'billing', 'messaging', 'inquiry', 'reports', 'predictions', 'blog'];
  return sections.find(s => pathname.startsWith(`/admin/${s}`)) || 'dashboard';
};

const DashboardContent: React.FC = () => {
  const { currentAdmin } = useAdmin();
  const location = useLocation();

  return (
    <div className="admin-wrapper">
      <AdminLayout activeSection={getSectionFromPath(location.pathname)}>
        <Routes>
          <Route index element={<Navigate to={getDefaultAdminPath(currentAdmin.role)} replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="meter" element={<MeterReadingPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/customer/:subscriptionNo" element={<PaymentsAddingPage />} />
          <Route path="payments/slip/:slipId" element={<BankSlipReviewPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="messaging/*" element={<MessagingPage />} />
          <Route path="inquiry" element={<AdminInquiriesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
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