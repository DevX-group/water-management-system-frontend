import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import { AdminTable } from '@/components/user-management/AdminTable';
import { AddAdminDialog } from '@/components/user-management/AddAdminDialog';

export const AdminManagement: React.FC = () => {
  const am = useAdminManagement();

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex justify-end mb-4">
          <Button onClick={() => am.setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Create Admin
          </Button>
        </div>

        {am.loading ? (
          <div className="py-12 text-center text-muted-foreground bg-card rounded-md border border-border">
            Loading administrators...
          </div>
        ) : (
          <AdminTable 
            admins={am.admins} 
            onStatusChange={am.handleStatusChange} 
          />
        )}
      </div>

      <AddAdminDialog
        open={am.showAddDialog}
        onOpenChange={am.setShowAddDialog}
        formData={am.formData}
        errors={am.errors}
        onFieldChange={am.handleFieldChange}
        onAdd={am.handleAddAdmin}
        onReset={am.resetForm}
      />
    </div>
  );
};

