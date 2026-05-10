import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Customer, CustomerFormData, SortOrder } from '@/types/user';
import {
  validateEmail,
  validatePhone,
  validateNIC,
  validateName,
  validateAddress,
} from '@/validations/userValidations';

// Region configuration with unique codes
export const REGION_CONFIG = {
  north:  { code: 'NOR', label: 'North' },
  south:  { code: 'SOU', label: 'South' },
  east:   { code: 'EAS', label: 'East' },
  west:   { code: 'WES', label: 'West' },
  center: { code: 'CEN', label: 'Center' },
};

const EMPTY_FORM: CustomerFormData = {
  name: '', nic: '', address: '', phone: '', email: '',
  region: '', connectionType: '', subscriptionNumber: '',
};

export const useUserManagement = (customers: Customer[]) => {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery]       = useState('');
  const [showAddDialog, setShowAddDialog]   = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData]     = useState<Customer | null>(null);
  const [formData, setFormData]             = useState<CustomerFormData>(EMPTY_FORM);
  const [errors, setErrors]                 = useState<{ [key: string]: boolean }>({});

  // Sorting & filtering
  const [sortBy, setSortBy]                         = useState<string>('name');
  const [sortOrder, setSortOrder]                   = useState<SortOrder>('asc');
  const [filterStatus, setFilterStatus]             = useState<string>('');
  const [filterRegion, setFilterRegion]             = useState<string>('');
  const [filterConnectionType, setFilterConnectionType] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Generate subscription number based on region
  const generateSubscriptionNumber = (region: string) => {
    if (!region) return '';
    const regionConfig = REGION_CONFIG[region as keyof typeof REGION_CONFIG];
    if (!regionConfig) return '';
    const numPart = Math.floor(Math.random() * 900000) + 100000;
    return `${regionConfig.code}-${numPart}`;
  };

  const handleRegionChange = (value: string) => {
    const subscriptionNumber = generateSubscriptionNumber(value);
    setFormData({ ...formData, region: value, subscriptionNumber });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Data processing: search → filter → sort
  const processedCustomers = customers
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

  const totalPages = Math.max(1, Math.ceil(processedCustomers.length / rowsPerPage));
  const paginatedCustomers = processedCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleFieldChange = (fieldName: string, value: string) => {
    if (errors[fieldName]) setErrors({ ...errors, [fieldName]: false });
  };

  const handleAddCustomer = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!validateName(formData.name))           newErrors.name = true;
    if (!validateNIC(formData.nic))             newErrors.nic = true;
    if (!validateAddress(formData.address))     newErrors.address = true;
    if (!validatePhone(formData.phone))         newErrors.phone = true;
    if (formData.email && !validateEmail(formData.email)) newErrors.email = true;
    if (!formData.region)                       newErrors.region = true;
    if (!formData.connectionType)               newErrors.connectionType = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    toast({ title: 'Customer Added', description: `${formData.name} has been registered.` });
    setShowAddDialog(false);
    setErrors({});
    setFormData(EMPTY_FORM);
  };

  const handleResetForm = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const handleViewCustomer = (customer: Customer) => setViewingCustomer(customer);

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditFormData({ ...customer });
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    if (!validateName(editFormData.name)) {
      toast({ title: 'Error', description: 'Customer Name must be at least 2 characters' });
      return;
    }
    if (!validateNIC(editFormData.nic)) {
      toast({ title: 'Error', description: 'Please enter a valid NIC number (9 digits + letter or 12 digits)' });
      return;
    }
    if (!validatePhone(editFormData.phone)) {
      toast({ title: 'Error', description: 'Please enter a valid phone number (10 digits)' });
      return;
    }
    if (editFormData.email && !validateEmail(editFormData.email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address' });
      return;
    }
    toast({ title: 'Success', description: `${editFormData.name} has been updated.` });
    setEditingCustomer(null);
    setEditFormData(null);
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    toast({ title: 'Deleted', description: `${customerName} has been marked as deleted.` });
  };

  return {
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
