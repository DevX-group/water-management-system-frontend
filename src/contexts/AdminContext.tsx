import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockAdmins } from '@/data/mockData';

interface Admin {
  id: string;
  name: string;
  role: 'main_admin' | 'meter_reader' | 'payment_handler';
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
  const [currentAdmin, setCurrentAdmin] = useState<Admin>(mockAdmins[0]);

  const setCurrentRole = (role: string): void => {
    const admin = mockAdmins.find(a => a.role === role);
    if (admin) {
      setCurrentAdmin(admin);
    }
  };

  const value: AdminContextType = {
    currentAdmin,
    setCurrentRole,
    admins: mockAdmins,
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