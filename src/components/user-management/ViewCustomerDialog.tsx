import '@/index.css';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Customer } from '@/types/user';
import { REGION_CONFIG } from '@/hooks/useUserManagement';

interface ViewCustomerDialogProps {
  customer:    Customer | null;
  onClose:     () => void;
  onEdit:      (c: Customer) => void;
}

export const ViewCustomerDialog: React.FC<ViewCustomerDialogProps> = ({ customer, onClose, onEdit }) => {
  const regionLabel = customer
    ? Object.values(REGION_CONFIG).find(r => r.code === customer.region)?.label || customer.region
    : '';
  const connectionLabel = customer
    ? customer.connectionType.replace('_', ' ')
    : '';
  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>Customer Profile</DialogTitle></DialogHeader>
        {customer && (
          <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
            {[
              { label: 'Name',              value: customer.name },
              { label: 'NIC',               value: customer.nic },
              { label: 'Subscription Number', value: customer.subscriptionNo },
              { label: 'Phone',             value: customer.phone },
              { label: 'Email',             value: customer.email || 'N/A' },
              { label: 'Address',           value: customer.address },
              { label: 'Region',            value: regionLabel },
              { label: 'Connection Type',   value: connectionLabel },
              { label: 'Status',            value: customer.status },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <p className="text-sm font-medium capitalize">{value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={() => { if (customer) { onEdit(customer); onClose(); } }}>
            Edit Details
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>Go to Profile</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
