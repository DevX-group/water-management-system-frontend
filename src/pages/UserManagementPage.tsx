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

// Region configuration with unique codes
const REGION_CONFIG = {
  north: { code: 'NOR', label: 'North' },
  south: { code: 'SOU', label: 'South' },
  east: { code: 'EAS', label: 'East' },
  west: { code: 'WES', label: 'West' },
  center: { code: 'CEN', label: 'Center' },
  // Future regions can be easily added without conflicts
  // northeast: { code: 'NOE', label: 'North East' },
};

export const UserManagementPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '', nic: '', address: '', phone: '', email: '', region: '', connectionType: '', subscriptionNumber: '',
  });
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  // Generate subscription number based on region
  const generateSubscriptionNumber = (region: string) => {
    if (!region) return '';
    
    const regionConfig = REGION_CONFIG[region as keyof typeof REGION_CONFIG];
    if (!regionConfig) return '';
    
    const prefix = regionConfig.code;
    // Generate a 6-digit number
    const numPart = Math.floor(Math.random() * 900000) + 100000;
    
    return `${prefix}${numPart}`;
  };

  const handleRegionChange = (value: string) => {
    const subscriptionNumber = generateSubscriptionNumber(value);
    setFormData({...formData, region: value, subscriptionNumber});
  };

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    const newErrors: {[key: string]: boolean} = {};

    // Validate required fields
    if (!validateName(formData.name)) newErrors.name = true;
    if (!validateNIC(formData.nic)) newErrors.nic = true;
    if (!validateAddress(formData.address)) newErrors.address = true;
    if (!validatePhone(formData.phone)) newErrors.phone = true;
    if (formData.email && !validateEmail(formData.email)) newErrors.email = true;
    if (!formData.region) newErrors.region = true;
    if (!formData.connectionType) newErrors.connectionType = true;

    // If there are errors, highlight them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // All validations passed
    toast({ title: "Customer Added", description: `${formData.name} has been registered.` });
    setShowAddDialog(false);
    setErrors({});
    setFormData({ name: '', nic: '', address: '', phone: '', email: '', region: '', connectionType: '', subscriptionNumber: '' });
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Remove error highlighting when user starts typing
    if (errors[fieldName]) {
      setErrors({...errors, [fieldName]: false});
    }
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/; // Expects 10 digits
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateNIC = (nic: string): boolean => {
    // Sri Lanka NIC: Either 9 digits + letter or 12 digits
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    return nicRegex.test(nic.trim());
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateAddress = (address: string): boolean => {
    return address.trim().length >= 5;
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
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader><DialogTitle>Register Customer</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
            <div className="space-y-2"><Label>Customer Name *</Label><Input placeholder="Enter Customer Name" value={formData.name} onChange={(e) => {setFormData({...formData, name: e.target.value}); handleFieldChange('name', e.target.value);}} className={errors.name ? 'border-red-500 border-2' : ''} /></div>
            <div className="space-y-2"><Label>NIC Number *</Label><Input placeholder="Enter Customer NIC Number" value={formData.nic} onChange={(e) => {setFormData({...formData, nic: e.target.value}); handleFieldChange('nic', e.target.value);}} className={errors.nic ? 'border-red-500 border-2' : ''} /></div>
            <div className="space-y-2"><Label>Address *</Label><Input placeholder="Enter Address" value={formData.address} onChange={(e) => {setFormData({...formData, address: e.target.value}); handleFieldChange('address', e.target.value);}} className={errors.address ? 'border-red-500 border-2' : ''} /></div>
            <div className="space-y-2"><Label>Mobile Number *</Label><Input placeholder="Enter Mobile Number" value={formData.phone} onChange={(e) => {setFormData({...formData, phone: e.target.value}); handleFieldChange('phone', e.target.value);}} className={errors.phone ? 'border-red-500 border-2' : ''} /></div>
            <div className="space-y-2"><Label>Email (Optional)</Label><Input placeholder="Enter Email" value={formData.email} onChange={(e) => {setFormData({...formData, email: e.target.value}); handleFieldChange('email', e.target.value);}} className={errors.email ? 'border-red-500 border-2' : ''} /></div>
            <div className="space-y-2"><Label>Connection Type *</Label><Select value={formData.connectionType} onValueChange={(v) => {setFormData({...formData, connectionType: v}); handleFieldChange('connectionType', v);}}><SelectTrigger className={errors.connectionType ? 'border-red-500' : ''}><SelectValue placeholder="Select Type" /></SelectTrigger><SelectContent><SelectItem value="metered">Metered Customer</SelectItem><SelectItem value="non-metered">Non Metered Customer</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Region *</Label><Select value={formData.region} onValueChange={(v) => {handleRegionChange(v); handleFieldChange('region', v);}}><SelectTrigger className={errors.region ? 'border-red-500' : ''}><SelectValue placeholder="Select Region" /></SelectTrigger><SelectContent>{Object.entries(REGION_CONFIG).map(([key, value]) => (<SelectItem key={key} value={key}>{value.label}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Subscription Number</Label><Input placeholder="Auto-generated" value={formData.subscriptionNumber} disabled className="bg-accent/30 cursor-not-allowed" /></div>
            <p className="text-xs text-muted-foreground">Subscription number generated automatically</p>
          </div>
          <Button className="w-full mt-4" onClick={handleAddCustomer}>Register Customer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
