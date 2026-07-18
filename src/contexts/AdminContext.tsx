import '@/index.css';
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminRole } from '@/types/admin';
import { isAdminRole } from '@/utils/adminAccess';

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
    const resolvedRole: AdminRole = isAdminRole(user?.role) ? user.role : 'SYSTEM_ADMIN';
    const nic = user?.nic ?? 'admin';

    return {
      id: nic,
      name: user?.nic ?? 'Admin User',
      role: resolvedRole,
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