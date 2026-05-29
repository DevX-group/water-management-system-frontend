import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminFormData } from '@/types/admin';

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AdminFormData;
  errors: { [key: string]: boolean };
  onFieldChange: (field: keyof AdminFormData, value: string) => void;
  onAdd: () => void;
  onReset: () => void;
}

export const AddAdminDialog: React.FC<AddAdminDialogProps> = ({
  open, onOpenChange, formData, errors, onFieldChange, onAdd, onReset
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Administrator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>NIC Number *</Label>
            <Input 
              placeholder="e.g. 199012345678 or 901234567V" 
              value={formData.nic}
              onChange={(e) => onFieldChange('nic', e.target.value)}
              className={errors.nic ? 'border-red-500' : ''} 
            />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input 
              type="email"
              placeholder="admin@example.com" 
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''} 
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number *</Label>
            <Input 
              placeholder="0712345678" 
              value={formData.phoneNumber}
              onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
              className={errors.phoneNumber ? 'border-red-500' : ''} 
            />
          </div>
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select 
              value={formData.role}
              onValueChange={(v) => onFieldChange('role', v)}
            >
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
          <Button className="flex-1" onClick={onAdd}>Create</Button>
          <Button variant="outline" className="flex-1" onClick={onReset}>Clear</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
