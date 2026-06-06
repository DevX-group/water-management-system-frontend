import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminUser, AdminFormData, AdminStatus } from '@/types/admin';
import { getAdmins, createAdmin, updateAdmin, updateAdminStatus } from '@/services/adminService';
import { validateEmail, validatePhone, validateNIC, validateName } from '@/validations/userValidations';

const EMPTY_FORM: AdminFormData = {
  nic: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  role: 'SYSTEM_ADMIN'
};

export const useAdminManagement = () => {
  const { toast } = useToast();
  
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState<AdminFormData>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<{ [key: string]: boolean }>({});

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      toast({ title: 'Error', description: 'Failed to load admin accounts.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleFieldChange = (fieldName: keyof AdminFormData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleEditFieldChange = (fieldName: keyof AdminFormData, value: string) => {
    setEditFormData(prev => ({ ...prev, [fieldName]: value }));
    if (editErrors[fieldName]) {
      setEditErrors(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleAddAdmin = async () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!validateNIC(formData.nic)) newErrors.nic = true;
    if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = true;
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = true;
    if (!validateName(formData.fullName)) newErrors.fullName = true;
    if (!formData.role) newErrors.role = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newAdmin = await createAdmin(formData);
      setAdmins(prev => [newAdmin, ...prev]);
      setShowAddDialog(false);
      setFormData(EMPTY_FORM);
      toast({ title: 'Admin Created', description: `Admin account (${newAdmin.nic}) created successfully.` });
    } catch (error: any) {
      console.error("Failed to create admin:", error);
      toast({ title: 'Creation Failed', description: error?.response?.data?.message || 'Failed to create admin.', variant: 'destructive' });
    }
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditFormData({
      nic: admin.nic,
      fullName: admin.fullName || '',
      email: admin.email,
      phoneNumber: admin.phoneNumber || '',
      role: admin.role,
    });
    setEditErrors({});
  };

  const handleSaveEdit = async () => {
    if (!editingAdmin) return;

    const newErrors: { [key: string]: boolean } = {};
    if (!validateNIC(editFormData.nic)) newErrors.nic = true;
    if (!validatePhone(editFormData.phoneNumber)) newErrors.phoneNumber = true;
    if (!editFormData.email || !validateEmail(editFormData.email)) newErrors.email = true;
    if (!validateName(editFormData.fullName)) newErrors.fullName = true;
    if (!editFormData.role) newErrors.role = true;

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    try {
      const updatedAdmin = await updateAdmin(editingAdmin.id, editFormData);
      setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? updatedAdmin : a));
      setEditingAdmin(null);
      setEditFormData(EMPTY_FORM);
      setEditErrors({});
      toast({ title: 'Admin Updated', description: `Admin account (${updatedAdmin.nic}) updated successfully.` });
    } catch (error: any) {
      console.error("Failed to update admin:", error);
      toast({ title: 'Update Failed', description: error?.response?.data?.message || 'Failed to update admin.', variant: 'destructive' });
    }
  };

  const handleCloseEdit = () => {
    setEditingAdmin(null);
    setEditFormData(EMPTY_FORM);
    setEditErrors({});
  };

  const handleStatusChange = async (id: string, newStatus: AdminStatus) => {
    try {
      const updatedAdmin = await updateAdminStatus(id, newStatus);
      setAdmins(prev => prev.map(a => a.id === id ? updatedAdmin : a));
      toast({ title: 'Status Updated', description: 'Admin status changed successfully.' });
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast({ title: 'Update Failed', description: 'Failed to change admin status.', variant: 'destructive' });
    }
  };

  return {
    admins,
    loading,
    showAddDialog,
    setShowAddDialog,
    editingAdmin,
    setEditingAdmin,
    formData,
    errors,
    editFormData,
    setEditFormData,
    editErrors,
    handleFieldChange,
    handleEditFieldChange,
    handleAddAdmin,
    handleEditAdmin,
    handleSaveEdit,
    handleCloseEdit,
    handleStatusChange,
    setFormData: (data: AdminFormData) => setFormData(data),
    resetForm: () => { setFormData(EMPTY_FORM); setErrors({}); }
  };
};
