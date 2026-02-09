import React, { useState } from 'react';
import { Users, Plus, Search, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockCustomers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserManagementPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '', nic: '', address: '', phone: '', email: '', region: '', connectionType: '',
  });

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    toast({ title: "Customer Added", description: `${formData.name} has been registered.` });
    setShowAddDialog(false);
    setFormData({ name: '', nic: '', address: '', phone: '', email: '', region: '', connectionType: '' });
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage all customer accounts and personal details</p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">All Customers</h3>
            <p className="text-sm text-muted-foreground">Total customers: {mockCustomers.length}</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Add Customer
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-accent/30" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 text-sm font-medium text-muted-foreground">Customer ID</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Phone</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Region</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/50 last:border-0">
                  <td className="py-4 text-sm font-medium text-foreground">{customer.id}</td>
                  <td className="py-4 text-sm text-foreground">{customer.name}</td>
                  <td className="py-4 text-sm text-muted-foreground">{customer.phone}</td>
                  <td className="py-4 text-sm text-muted-foreground capitalize">{customer.region}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Register Customer</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2"><Label>Customer Name *</Label><Input placeholder="Enter Customer Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>NIC Number *</Label><Input placeholder="Enter Customer NIC Number" value={formData.nic} onChange={(e) => setFormData({...formData, nic: e.target.value})} /></div>
            <div className="space-y-2"><Label>Address *</Label><Input placeholder="Enter Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>
            <div className="space-y-2"><Label>Mobile Number *</Label><Input placeholder="Enter Mobile Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email (Optional)</Label><Input placeholder="Enter Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
            <div className="space-y-2"><Label>Region *</Label><Select value={formData.region} onValueChange={(v) => setFormData({...formData, region: v})}><SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger><SelectContent><SelectItem value="north">North</SelectItem><SelectItem value="south">South</SelectItem><SelectItem value="east">East</SelectItem><SelectItem value="west">West</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Connection Type *</Label><Select value={formData.connectionType} onValueChange={(v) => setFormData({...formData, connectionType: v})}><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger><SelectContent><SelectItem value="residential">Residential</SelectItem><SelectItem value="commercial">Commercial</SelectItem><SelectItem value="industrial">Industrial</SelectItem></SelectContent></Select></div>
            <p className="text-xs text-muted-foreground">Subscription number generated automatically</p>
            <Button className="w-full" onClick={handleAddCustomer}>Register Customer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
