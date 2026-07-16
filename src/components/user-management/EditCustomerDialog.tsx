import '@/index.css';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Customer } from '@/types/user';

interface EditCustomerDialogProps {
  customer:       Customer | null;
  editFormData:   Customer | null;
  setEditFormData:(data: Customer) => void;
  onClose:        () => void;
  onSave:         () => void;
}

import { useTranslation } from 'react-i18next';

export const EditCustomerDialog: React.FC<EditCustomerDialogProps> = ({
  customer, editFormData, setEditFormData, onClose, onSave,
}) => {
  const { t } = useTranslation('userManagement');
  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>{t('editCustomerTitle')}</DialogTitle></DialogHeader>
        {editFormData && (
          <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
            <div className="space-y-2">
              <Label>{t('customerName')}</Label>
              <Input value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('nicNumber')}</Label>
              <Input value={editFormData.nic}
                onChange={(e) => setEditFormData({ ...editFormData, nic: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('mobileNumber')}</Label>
              <Input value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('email')}</Label>
              <Input value={editFormData.email || ''}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('connectionTypeLabel')}</Label>
              <Select value={editFormData.connectionType}
                onValueChange={(v) => setEditFormData({ ...editFormData, connectionType: v })}>
                <SelectTrigger><SelectValue placeholder={t('selectType')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="metered">{t('meteredCustomer')}</SelectItem>
                  <SelectItem value="non-metered">{t('nonMeteredCustomer')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={onSave}>{t('saveChanges')}</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>{t('cancel')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
