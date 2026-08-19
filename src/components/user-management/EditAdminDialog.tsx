import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminFormData, AdminUser } from '@/types/admin';
import { useTranslation } from 'react-i18next';

interface EditAdminDialogProps {
  admin: AdminUser | null;
  formData: AdminFormData;
  errors: { [key: string]: boolean };
  onFieldChange: (field: keyof AdminFormData, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EditAdminDialog: React.FC<EditAdminDialogProps> = ({
  admin, formData, errors, onFieldChange, onSave, onClose,
}) => {
  const { t } = useTranslation('userManagement');
  return (
    <Dialog open={!!admin} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('editAdminTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
          <div className="space-y-2">
            <Label>{t('fullNameRequired')}</Label>
            <Input
              placeholder={t('enterFullName')}
              value={formData.fullName}
              onChange={(e) => onFieldChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('nicNumber')}</Label>
            <Input
              placeholder={t('enterNICPlaceholder')}
              value={formData.nic}
              onChange={(e) => onFieldChange('nic', e.target.value)}
              className={errors.nic ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('emailRequired')}</Label>
            <Input
              type="email"
              placeholder={t('enterEmailPlaceholder')}
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={errors.email ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('phoneRequired')}</Label>
            <Input
              placeholder={t('enterPhonePlaceholder')}
              value={formData.phoneNumber}
              onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
              className={errors.phoneNumber ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('roleRequired')}</Label>
            <Select value={formData.role} onValueChange={(v) => onFieldChange('role', v)}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SYSTEM_ADMIN">{t('roles.systemAdmin')}</SelectItem>
                <SelectItem value="PAYMENT_HANDLER">{t('roles.paymentHandler')}</SelectItem>
                <SelectItem value="METER_READER">{t('roles.meterReader')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={onSave}>{t('saveChanges')}</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>{t('cancel')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
