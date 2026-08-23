import '@/index.css';
import { useAdmin } from '@/contexts/AdminContext';
import React from 'react';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeSection }) => {
  const { currentAdmin } = useAdmin();
  const { i18n } = useTranslation();

  useEffect(() => {
    const adminLanguage = localStorage.getItem("admin_language") || "en";
    if (i18n.language !== adminLanguage) {
      i18n.changeLanguage(adminLanguage);
    }
  }, [i18n]);

  return (
    <div className="min-h-screen bg-background relative">
      <AdminNavbar />
      {/* Padding top is 28 (112px) to account for the floating navbar */}
      <div className="pt-28 px-4 sm:px-6 lg:px-8 xl:px-12 py-6" >
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};