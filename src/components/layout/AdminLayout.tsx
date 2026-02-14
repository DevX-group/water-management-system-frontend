import { useAdmin } from '@/contexts/AdminContext';
import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminNavbar } from '@/components/layout/AdminNavbar';


interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeSection, onSectionChange }) => {
  const { currentAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <AdminNavbar />
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={onSectionChange} 
        />
      </div>
      <div className="mx-auto px-8 py-6" style={{ maxWidth: 'calc(100% - 16rem)' }}>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};