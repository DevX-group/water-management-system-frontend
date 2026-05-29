import '@/index.css';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Customer, CustomerFormData } from '@/types/user';

interface EditCustomerDialogProps {
  customer:       Customer | null;
  editFormData:   CustomerFormData | null;
  setEditFormData:(data: CustomerFormData) => void;
  onClose:        () => void;
  onSave:         () => void;
}

export const EditCustomerDialog: React.FC<EditCustomerDialogProps> = ({
  customer, editFormData, setEditFormData, onClose, onSave,
}) => {
  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="admin-wrapper max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
        {editFormData && (
          <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>NIC Number *</Label>
              <Input value={editFormData.nic}
                onChange={(e) => setEditFormData({ ...editFormData, nic: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number *</Label>
              <Input value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editFormData.email || ''}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <Select value={editFormData.connectionType}
                onValueChange={(v) => setEditFormData({ ...editFormData, connectionType: v })}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="metered">Metered Customer</SelectItem>
                  <SelectItem value="non_metered">Non Metered Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={onSave}>Save Changes</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
