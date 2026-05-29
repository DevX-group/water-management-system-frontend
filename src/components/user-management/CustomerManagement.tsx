import '@/index.css';
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserManagement } from '@/hooks/useUserManagement';
import { CustomerTable } from '@/components/user-management/CustomerTable';
import { AddCustomerDialog } from '@/components/user-management/AddCustomerDialog';
import { ViewCustomerDialog } from '@/components/user-management/ViewCustomerDialog';
import { EditCustomerDialog } from '@/components/user-management/EditCustomerDialog';

export const CustomerManagement: React.FC = () => {
  const um = useUserManagement();

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute top-6 right-6 z-10">
          <Button onClick={() => um.setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Add Customer
          </Button>
        </div>

        <CustomerTable
          searchQuery={um.searchQuery}
          setSearchQuery={um.setSearchQuery}
          filterStatus={um.filterStatus}
          setFilterStatus={um.setFilterStatus}
          filterRegion={um.filterRegion}
          setFilterRegion={um.setFilterRegion}
          filterConnectionType={um.filterConnectionType}
          setFilterConnectionType={um.setFilterConnectionType}
          currentPage={um.currentPage}
          setCurrentPage={um.setCurrentPage}
          totalPages={um.totalPages}
          processedCustomers={um.processedCustomers}
          paginatedCustomers={um.paginatedCustomers}
          sortBy={um.sortBy}
          sortOrder={um.sortOrder}
          totalCount={um.customers.length}
          onSort={um.handleSort}
          onView={um.handleViewCustomer}
          onEdit={um.handleEditCustomer}
          onDelete={um.handleDeleteCustomer}
          onClearFilters={() => {
            um.setFilterStatus('');
            um.setFilterRegion('');
            um.setFilterConnectionType('');
            um.setSearchQuery('');
            um.setCurrentPage(1);
          }}
        />
      </div>

      <AddCustomerDialog
        open={um.showAddDialog}
        onOpenChange={um.setShowAddDialog}
        formData={um.formData}
        setFormData={um.setFormData}
        errors={um.errors}
        onAdd={um.handleAddCustomer}
        onReset={um.handleResetForm}
        onFieldChange={um.handleFieldChange}
        onRegionChange={um.handleRegionChange}
      />

      <ViewCustomerDialog
        customer={um.viewingCustomer}
        onClose={() => um.setViewingCustomer(null)}
        onEdit={um.handleEditCustomer}
      />

      <EditCustomerDialog
        customer={um.editingCustomer}
        editFormData={um.editFormData}
        setEditFormData={(data) => um.setEditFormData(data)}
        onClose={() => um.setEditingCustomer(null)}
        onSave={um.handleSaveEdit}
      />
    </div>
  );
};
