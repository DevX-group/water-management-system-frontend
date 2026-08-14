import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminFormData, AdminUser } from '@/types/admin';

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
  return (
    <Dialog open={!!admin} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Administrator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => onFieldChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>NIC Number *</Label>
            <Input
              placeholder="e.g. 199012345678 or 901234567V"
              value={formData.nic}
              onChange={(e) => onFieldChange('nic', e.target.value)}
              className={errors.nic ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={errors.email ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number *</Label>
            <Input
              placeholder="0712345678"
              value={formData.phoneNumber}
              onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
              className={errors.phoneNumber ? 'border-red-500 border-2' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select value={formData.role} onValueChange={(v) => onFieldChange('role', v)}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SYSTEM_ADMIN">System Administrator</SelectItem>
                <SelectItem value="PAYMENT_HANDLER">Payment Handler</SelectItem>
                <SelectItem value="METER_READER">Meter Reader</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={onSave}>Save Changes</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
