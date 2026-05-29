import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminUser, AdminFormData, AdminStatus } from '@/types/admin';
import { getAdmins, createAdmin, updateAdminStatus } from '@/services/adminService';
import { validateEmail, validatePhone, validateNIC } from '@/validations/userValidations';

const EMPTY_FORM: AdminFormData = {
  nic: '',
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

  const handleAddAdmin = async () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!validateNIC(formData.nic)) newErrors.nic = true;
    if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = true;
    if (!validateEmail(formData.email)) newErrors.email = true;
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
    formData,
    errors,
    handleFieldChange,
    handleAddAdmin,
    handleStatusChange,
    setFormData: (data: AdminFormData) => setFormData(data),
    resetForm: () => { setFormData(EMPTY_FORM); setErrors({}); }
  };
};
