import { useAdmin } from '@/contexts/AdminContext';
import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminNavbar } from '@/components/layout/AdminNavbar';


interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeSection }) => {
  const { currentAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <AdminNavbar />
        <AdminSidebar 
          activeSection={activeSection}
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6" >
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};