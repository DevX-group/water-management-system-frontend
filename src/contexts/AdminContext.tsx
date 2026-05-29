import '@/index.css';
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminRole } from '@/types/admin';

interface Admin {
  id: string;
  name: string;
  role: AdminRole;
  email: string;
}

interface AdminContextType {
  currentAdmin: Admin;
  setCurrentRole: (role: string) => void;
  admins: Admin[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const currentAdmin = useMemo<Admin>(() => {
    const mapRole = (role?: string | null): AdminRole | null => {
      if (role === 'SUPER_ADMIN' || role === 'SYSTEM_ADMIN') return 'main_admin';
      if (role === 'METER_READER') return 'meter_reader';
      if (role === 'PAYMENT_HANDLER') return 'payment_handler';
      return null;
    };

    const mappedRole = mapRole(user?.role) ?? 'main_admin';
    const nic = user?.nic ?? 'admin';

    return {
      id: nic,
      name: user?.nic ?? 'Admin User',
      role: mappedRole,
      email: '',
    };
  }, [user]);

  const setCurrentRole = (): void => {
    // Role switching is disabled; admin role is derived from authenticated user.
  };

  const value: AdminContextType = {
    currentAdmin,
    setCurrentRole,
    admins: [currentAdmin],
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};