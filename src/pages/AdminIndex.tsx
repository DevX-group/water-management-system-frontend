import React, { useState, useEffect, ReactNode } from 'react';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardPage } from './DashboardPage';
import { MeterReadingPage } from './MeterReadingPage';
import { PaymentsPage } from './PaymentsPage';
import { BillingPage } from './BillingPage';
import { MessagingPage } from './MessagingPage';
import { ReportsPage } from './ReportsPage';
import { UserManagementPage } from './UserManagementPage';
import { PlaceholderPage } from './PlaceholderPage';

type AdminRole = 'meter_reader' | 'payment_handler' | 'admin' | 'superadmin';

type Section = 'dashboard' | 'users' | 'meter' | 'payments' | 'billing' | 'messaging' | 'reports' | 'predictions';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

interface AdminContextType {
  currentAdmin: Admin;
}

const DashboardContent: React.FC = () => {
  const { currentAdmin } = useAdmin() as AdminContextType;
  
  const [activeSection, setActiveSection] = useState<Section>(() => {
    switch (currentAdmin.role) {
      case 'meter_reader':
        return 'meter';
      case 'payment_handler':
        return 'payments';
      default:
        return 'dashboard';
    }
  });

  useEffect(() => {
    switch (currentAdmin.role) {
      case 'meter_reader':
        setActiveSection('meter');
        break;
      case 'payment_handler':
        setActiveSection('payments');
        break;
      default:
        setActiveSection('dashboard');
    }
  }, [currentAdmin.role]);

  const renderSection = (): ReactNode => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UserManagementPage />;
      case 'meter':
        return <MeterReadingPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'billing':
        return <BillingPage />;
      case 'messaging':
        return <MessagingPage />;
      case 'reports':
        return <ReportsPage />;
      case 'predictions':
        return <PlaceholderPage title="Water Predictions" />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
};

const Index: React.FC = () => (
  <AdminProvider>
    <DashboardContent />
  </AdminProvider>
);

export default Index;