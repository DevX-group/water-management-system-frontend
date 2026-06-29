import '@/index.css';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerManagement } from '@/components/user-management/CustomerManagement';
import { AdminManagement } from '@/components/user-management/AdminManagement';

export const UserManagementPage = () => {
  const { user } = useAuth();
  
  // Only SUPER_ADMIN can see the admin management tab
  const canManageAdmins = user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">
          {canManageAdmins 
            ? "Manage customer and admin accounts" 
            : "Manage all customer accounts and personal details"}
        </p>
      </div>

      {canManageAdmins ? (
        <Tabs defaultValue="customers" className="w-full animate-fade-in">
          <TabsList className="mb-4">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="mt-0">
            <CustomerManagement />
          </TabsContent>
          
          <TabsContent value="admins" className="mt-0">
            <AdminManagement />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="animate-fade-in">
          <CustomerManagement />
        </div>
      )}
    </div>
  );
};