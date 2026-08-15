import '@/index.css';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Customer } from '@/types/user';
import { REGION_CONFIG } from '@/hooks/useUserManagement';

interface ViewCustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onEdit: (c: Customer) => void;
}

import { useTranslation } from 'react-i18next';

export const ViewCustomerDialog: React.FC<ViewCustomerDialogProps> = ({ customer, onClose, onEdit }) => {
  const regionLabel = customer
    ? Object.values(REGION_CONFIG).find(r => r.code === customer.region)?.label || customer.region
    : '';
  const connectionLabel = customer
    ? customer.connectionType.replace('_', ' ')
    : '';
  const { t } = useTranslation('userManagement');
  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>{t('customerProfile')}</DialogTitle></DialogHeader>
        {customer && (
          <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
            {[
              { label: 'Name', value: customer.name },
              { label: 'NIC', value: customer.nic },
              { label: 'Subscription Number', value: customer.subscriptionNo },
              { label: 'Phone', value: customer.phone },
              { label: 'Email', value: customer.email || 'N/A' },
              { label: 'Address', value: customer.address },
              { label: 'Region', value: regionLabel },
              { label: 'Connection Type', value: connectionLabel },
              { label: 'Status', value: customer.status },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <p className="text-sm font-medium capitalize">{value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
          <Button className="flex-1 h-auto py-2 whitespace-normal text-center" onClick={() => { if (customer) { onEdit(customer); onClose(); } }}>
            {t('editDetails')}
          </Button>
          <Button variant="outline" className="flex-1 h-auto py-2 whitespace-normal text-center" onClick={onClose}>{t('goToProfile')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
