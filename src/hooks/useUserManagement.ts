import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Customer, CustomerFormData, SortOrder } from '@/types/user';
import { getCustomers, createCustomer, searchCustomersApi, updateCustomer, deleteCustomer } from '@/services/customerService';
import {
  validateEmail,
  validatePhone,
  validateNIC,
  validateName,
  validateAddress,
} from '@/validations/userValidations';

export const REGION_CONFIG = {
  north:  { code: 'R001', label: 'North' },
  south:  { code: 'R002', label: 'South' },
  east:   { code: 'R003', label: 'East' },
  west:   { code: 'R004', label: 'West' },
  center: { code: 'R005', label: 'Center' },
};

const EMPTY_FORM: CustomerFormData = {
  name: '', nic: '', address: '', phone: '', email: '',
  region: '', connectionType: 'metered'
};

export const useUserManagement = (initialCustomers: Customer[] = []) => {
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState<CustomerFormData>(EMPTY_FORM);
  const [editFormData, setEditFormData] = useState<CustomerFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const [sortBy, setSortBy] = useState<keyof Customer>('registeredDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [filterConnectionType, setFilterConnectionType] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        const data = await searchCustomersApi(searchQuery);
        setCustomers(data);
      } else {
        const data = await getCustomers();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast({ title: 'Error', description: 'Failed to load customers from the server', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  const processedCustomers = useMemo(() => {
    return customers
      .filter(c => !filterStatus || filterStatus === 'all' || c.status === filterStatus)
      .filter(c => !filterRegion || filterRegion === 'all' || c.region === filterRegion)
      .filter(c => !filterConnectionType || filterConnectionType === 'all' || c.connectionType === filterConnectionType)
      .sort((a, b) => {
        const aVal = String(a[sortBy]);
        const bVal = String(b[sortBy]);
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
  }, [customers, filterStatus, filterRegion, filterConnectionType, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(processedCustomers.length / rowsPerPage));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedCustomers.slice(start, start + rowsPerPage);
  }, [processedCustomers, currentPage, rowsPerPage]);

  const handleSort = (column: string) => {
    const key = column as keyof Customer;
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: false });
    }
  };

  const handleRegionChange = (value: string) => {
    handleFieldChange('region', value);
  };

  const handleAddCustomer = async () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!validateName(formData.name))           newErrors.name = true;
    if (!validateNIC(formData.nic))             newErrors.nic = true;
    if (!validateAddress(formData.address))     newErrors.address = true;
    if (!validatePhone(formData.phone))         newErrors.phone = true;
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = true;
    if (!formData.region)                       newErrors.region = true;
    if (!formData.connectionType)               newErrors.connectionType = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newCustomer = await createCustomer(formData);
      setCustomers(prev => [newCustomer, ...prev]);
      setShowAddDialog(false);
      handleResetForm();
      toast({ title: 'Customer Added', description: `${formData.name} has been registered successfully.` });
    } catch (error: any) {
      console.error("Failed to create customer:", error);
      toast({ title: 'Registration Failed', description: error?.response?.data?.message || "Failed to create customer.", variant: 'destructive' });
    }
  };

  const handleResetForm = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const handleViewCustomer = (customer: Customer) => setViewingCustomer(customer);

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name,
      nic: customer.nic,
      address: customer.address,
      phone: customer.phone,
      email: customer.email || '',
      region: customer.region,
      connectionType: customer.connectionType,
    });
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !editingCustomer) return;
    
    if (!validateName(editFormData.name)) {
      toast({ title: 'Error', description: 'Customer Name must be at least 2 characters', variant: 'destructive' });
      return;
    }
    if (!validateNIC(editFormData.nic)) {
      toast({ title: 'Error', description: 'Please enter a valid NIC number', variant: 'destructive' });
      return;
    }
    if (!validatePhone(editFormData.phone)) {
      toast({ title: 'Error', description: 'Please enter a valid phone number', variant: 'destructive' });
      return;
    }
    if (editFormData.email && !validateEmail(editFormData.email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }
    
    try {
      const updatedCustomer = await updateCustomer(editingCustomer.id, editFormData);
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? updatedCustomer : c
      ));
      setEditingCustomer(null);
      setEditFormData(EMPTY_FORM);
      toast({ title: 'Success', description: `${editFormData.name} has been updated successfully.` });
    } catch (error: any) {
      console.error("Failed to update customer:", error);
      toast({ title: 'Update Failed', description: error?.response?.data?.message || "Failed to update customer.", variant: 'destructive' });
    }
  };

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to deactivate ${customerName}? This action can be reversed by reactivating the account.`)) {
      try {
        await deleteCustomer(customerId);
        setCustomers(customers.map(c =>
          c.id === customerId ? { ...c, status: 'INACTIVE', isDeleted: true } : c
        ));
        toast({ title: 'Customer Deactivated', description: `${customerName} has been deactivated.` });
      } catch (error: any) {
        console.error("Failed to delete customer:", error);
        toast({ title: 'Delete Failed', description: error?.response?.data?.message || "Failed to delete customer.", variant: 'destructive' });
      }
    }
  };

  return {
    loading,
    customers,
    searchQuery, setSearchQuery,
    showAddDialog, setShowAddDialog,
    viewingCustomer, setViewingCustomer,
    editingCustomer, setEditingCustomer,
    editFormData, setEditFormData,
    formData, setFormData,
    errors,
    sortBy, sortOrder,
    filterStatus, setFilterStatus,
    filterRegion, setFilterRegion,
    filterConnectionType, setFilterConnectionType,
    currentPage, setCurrentPage,
    rowsPerPage, totalPages,
    processedCustomers, paginatedCustomers,
    handleSort, handleRegionChange, handleFieldChange,
    handleAddCustomer, handleResetForm,
    handleViewCustomer, handleEditCustomer,
    handleSaveEdit, handleDeleteCustomer,
  };
};