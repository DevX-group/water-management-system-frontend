import React, { useState } from 'react';
import { Users, Plus, Search, Phone, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
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
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', nic: '', address: '', phone: '', email: '', region: '', connectionType: '', subscriptionNumber: '',
  });
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [filterConnectionType, setFilterConnectionType] = useState<string>('');

  // Generate subscription number based on region
  const generateSubscriptionNumber = (region: string) => {
    if (!region) return '';
    
    const regionConfig = REGION_CONFIG[region as keyof typeof REGION_CONFIG];
    if (!regionConfig) return '';
    
    const prefix = regionConfig.code;
    // Generate a 6-digit number
    const numPart = Math.floor(Math.random() * 900000) + 100000;
    
    return `${prefix}-${numPart}`;
  };

  const handleRegionChange = (value: string) => {
    const subscriptionNumber = generateSubscriptionNumber(value);
    setFormData({...formData, region: value, subscriptionNumber});
  };

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Data processing: search -> filter -> sort
  const processedCustomers = mockCustomers
    .filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nic.includes(searchQuery) ||
      c.subscriptionNo.includes(searchQuery)
    )
    .filter(c => !filterStatus || filterStatus === 'all' || c.status === filterStatus)
    .filter(c => !filterRegion || filterRegion === 'all' || c.region === filterRegion)
    .filter(c => !filterConnectionType || filterConnectionType === 'all' || c.connectionType === filterConnectionType)
    .sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

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

  const handleResetForm = () => {
    setFormData({ name: '', nic: '', address: '', phone: '', email: '', region: '', connectionType: '', subscriptionNumber: '' });
    setErrors({});
  };

  // Handle view customer
  const handleViewCustomer = (customer: any) => {
    setViewingCustomer(customer);
  };

  // Handle edit customer
  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setEditFormData({...customer});
  };

  // Handle save edit
  const handleSaveEdit = () => {
    // Validation
    if (!validateName(editFormData.name)) {
      toast({ title: "Error", description: "Customer Name must be at least 2 characters" });
      return;
    }
    if (!validateNIC(editFormData.nic)) {
      toast({ title: "Error", description: "Please enter a valid NIC number (9 digits + letter or 12 digits)" });
      return;
    }
    if (!validatePhone(editFormData.phone)) {
      toast({ title: "Error", description: "Please enter a valid phone number (10 digits)" });
      return;
    }
    if (editFormData.email && !validateEmail(editFormData.email)) {
      toast({ title: "Error", description: "Please enter a valid email address" });
      return;
    }
    toast({ title: "Success", description: `${editFormData.name} has been updated.` });
    setEditingCustomer(null);
    setEditFormData(null);
  };

  // Handle delete customer (soft delete)
  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    toast({ title: "Deleted", description: `${customerName} has been marked as deleted.` });
    // In actual implementation, this would call the API to mark as deleted
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
            <p className="text-sm text-muted-foreground">Showing {processedCustomers.length} of {mockCustomers.length} customers</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Add Customer
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, NIC, or subscription number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-accent/30" />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Filter by Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-accent/30"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Filter by Region</Label>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="bg-accent/30"><SelectValue placeholder="All Regions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Object.entries(REGION_CONFIG).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Filter by Connection Type</Label>
            <Select value={filterConnectionType} onValueChange={setFilterConnectionType}>
              <SelectTrigger className="bg-accent/30"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="metered">Metered</SelectItem>
                <SelectItem value="non-metered">Non Metered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filterStatus || filterRegion || filterConnectionType || searchQuery) && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setFilterStatus(''); setFilterRegion(''); setFilterConnectionType(''); setSearchQuery(''); }}>
              Clear all filters
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground cursor-pointer hover:bg-accent/50 rounded transition-colors" onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">NIC</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Subscription No</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Phone</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Region</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground cursor-pointer hover:bg-accent/50 rounded transition-colors" onClick={() => handleSort('registeredDate')}>Registered {sortBy === 'registeredDate' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Status</th>
                <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedCustomers.map((customer) => (
                <tr key={customer.id} className={`border-b border-border/50 last:border-0 ${customer.isDeleted ? 'opacity-50' : ''}`}>
                  <td className="py-4 text-sm text-foreground">{customer.name}</td>
                  <td className="py-4 text-sm text-muted-foreground">{customer.nic}</td>
                  <td className="py-4 text-sm text-muted-foreground">{customer.subscriptionNo}</td>
                  <td className="py-4 text-sm text-muted-foreground">{customer.phone}</td>
                  <td className="py-4 text-sm text-muted-foreground capitalize">{customer.region}</td>
                  <td className="py-4 text-sm text-muted-foreground">{new Date(customer.registeredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleViewCustomer(customer)} className="p-1 hover:bg-accent rounded" title="View">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleEditCustomer(customer)} disabled={customer.isDeleted} className="p-1 hover:bg-accent rounded disabled:opacity-50" title="Edit">
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                      <button onClick={() => handleDeleteCustomer(customer.id, customer.name)} disabled={customer.isDeleted} className="p-1 hover:bg-accent rounded disabled:opacity-50" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
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
          <div className="flex gap-3 mt-4">
            <Button className="flex-1" onClick={handleAddCustomer}>Register Customer</Button>
            <Button variant="outline" className="flex-1" onClick={handleResetForm}>Clear</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader><DialogTitle>Customer Profile</DialogTitle></DialogHeader>
          {viewingCustomer && (
            <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="text-sm font-medium">{viewingCustomer.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">NIC</Label>
                <p className="text-sm font-medium">{viewingCustomer.nic}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Subscription Number</Label>
                <p className="text-sm font-medium">{viewingCustomer.subscriptionNo}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="text-sm font-medium">{viewingCustomer.phone}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium">{viewingCustomer.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Address</Label>
                <p className="text-sm font-medium">{viewingCustomer.address}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Region</Label>
                <p className="text-sm font-medium capitalize">{viewingCustomer.region}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Connection Type</Label>
                <p className="text-sm font-medium capitalize">{viewingCustomer.connectionType}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <p className="text-sm font-medium capitalize">{viewingCustomer.status}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <Button className="flex-1" onClick={() => {handleEditCustomer(viewingCustomer); setViewingCustomer(null);}}>Edit Details</Button>
            <Button variant="outline" className="flex-1" onClick={() => setViewingCustomer(null)}>Go to Profile</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
          {editFormData && (
            <div className="space-y-4 pt-4 overflow-y-auto flex-1 px-1">
              <div className="space-y-2"><Label>Customer Name *</Label><Input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>NIC Number *</Label><Input value={editFormData.nic} onChange={(e) => setEditFormData({...editFormData, nic: e.target.value})} /></div>
              <div className="space-y-2"><Label>Mobile Number *</Label><Input value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} /></div>
              <div className="space-y-2"><Label>Connection Type</Label><Select value={editFormData.connectionType} onValueChange={(v) => setEditFormData({...editFormData, connectionType: v})}><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger><SelectContent><SelectItem value="metered">Metered Customer</SelectItem><SelectItem value="non-metered">Non Metered Customer</SelectItem></SelectContent></Select></div>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <Button className="flex-1" onClick={handleSaveEdit}>Save Changes</Button>
            <Button variant="outline" className="flex-1" onClick={() => setEditingCustomer(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};