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
  const { t } = useTranslation('userManagement');
  const regionLabel = customer
    ? t(`regions.${customer.region}`, Object.values(REGION_CONFIG).find(r => r.code === customer.region)?.label || customer.region)
    : '';
  const connectionLabel = customer
    ? customer.connectionType === 'metered' ? t('meteredCustomer') : customer.connectionType === 'non_metered' ? t('nonMeteredCustomer') : customer.connectionType
    : '';
  const statusLabel = customer
    ? customer.status === 'ACTIVE' ? t('active') : customer.status === 'INACTIVE' ? t('inactive') : customer.status === 'PENDING_ACTIVATION' ? t('pending') : customer.status === 'SUSPENDED' ? t('suspended') : customer.status
    : '';

  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>{t('customerProfile')}</DialogTitle></DialogHeader>
        {customer && (
          <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
            {[
              { label: t('name'), value: customer.name },
              { label: t('nic'), value: customer.nic },
              { label: t('subscriptionNumber'), value: customer.subscriptionNo },
              { label: t('phone'), value: customer.phone },
              { label: t('email'), value: customer.email || t('na') },
              { label: t('addressLabel'), value: customer.address },
              { label: t('region'), value: regionLabel },
              { label: t('connectionTypeLabel'), value: connectionLabel },
              { label: t('status'), value: statusLabel },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <p className="text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
          <Button className="flex-1 h-auto py-2 whitespace-normal text-center" onClick={() => { if (customer) { onEdit(customer); onClose(); } }}>
            {t('editDetails')}
          </Button>
          <Button variant="outline" className="flex-1 h-auto py-2 whitespace-normal text-center" onClick={onClose}>{t('close')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
