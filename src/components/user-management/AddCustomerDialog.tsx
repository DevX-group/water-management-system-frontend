import '@/index.css';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CustomerFormData } from '@/types/user';
import { REGION_CONFIG } from '@/hooks/useUserManagement';

interface AddCustomerDialogProps {
  open:              boolean;
  onOpenChange:      (open: boolean) => void;
  formData:          CustomerFormData;
  setFormData:       (data: CustomerFormData) => void;
  errors:            { [key: string]: boolean };
  onAdd:             () => void;
  onReset:           () => void;
  onFieldChange:     (field: string, value: string) => void;
  onRegionChange:    (value: string) => void;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open, onOpenChange, formData, setFormData, errors,
  onAdd, onReset, onFieldChange, onRegionChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>Register Customer</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
          <div className="space-y-2">
            <Label>Customer Name *</Label>
            <Input placeholder="Enter Customer Name" value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); onFieldChange('name', e.target.value); }}
              className={errors.name ? 'border-red-500 border-2' : ''} />
          </div>
          <div className="space-y-2">
            <Label>NIC Number *</Label>
            <Input placeholder="Enter Customer NIC Number" value={formData.nic}
              onChange={(e) => { setFormData({ ...formData, nic: e.target.value }); onFieldChange('nic', e.target.value); }}
              className={errors.nic ? 'border-red-500 border-2' : ''} />
          </div>
          <div className="space-y-2">
            <Label>Address *</Label>
            <Input placeholder="Enter Address" value={formData.address}
              onChange={(e) => { setFormData({ ...formData, address: e.target.value }); onFieldChange('address', e.target.value); }}
              className={errors.address ? 'border-red-500 border-2' : ''} />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number *</Label>
            <Input placeholder="Enter Mobile Number" value={formData.phone}
              onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); onFieldChange('phone', e.target.value); }}
              className={errors.phone ? 'border-red-500 border-2' : ''} />
          </div>
          <div className="space-y-2">
            <Label>Email (Optional)</Label>
            <Input placeholder="Enter Email" value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); onFieldChange('email', e.target.value); }}
              className={errors.email ? 'border-red-500 border-2' : ''} />
          </div>
          <div className="space-y-2">
            <Label>Connection Type *</Label>
            <Select value={formData.connectionType}
              onValueChange={(v) => { setFormData({ ...formData, connectionType: v }); onFieldChange('connectionType', v); }}>
              <SelectTrigger className={errors.connectionType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metered">Metered Customer</SelectItem>
                <SelectItem value="non-metered">Non Metered Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Region *</Label>
            <Select value={formData.region}
              onValueChange={(v) => { onRegionChange(v); onFieldChange('region', v); }}>
              <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REGION_CONFIG).map(([key, value]) => (
                  <SelectItem key={key} value={value.code}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={onAdd}>Register Customer</Button>
          <Button variant="outline" className="flex-1" onClick={onReset}>Clear</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
