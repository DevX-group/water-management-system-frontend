import { AdminUser, AdminFormData, AdminStatus } from '@/types/admin';
import { api } from './api';

export const getAdmins = async (): Promise<AdminUser[]> => {
  // Pass role if we only want admins, but the endpoint handles it if we don't, 
  // or we can fetch all users and filter. 
  // The API allows `?role=SYSTEM_ADMIN` etc. Let's just fetch all and filter in UI for flexibility, 
  // or fetch specific roles. For Admin Management, we usually want SYSTEM_ADMIN and maybe other staff.
  const res = await api.get<AdminUser[]>('/users');
  return res.data.filter(u => u.role !== 'CUSTOMER');
};

export const createAdmin = async (data: AdminFormData): Promise<AdminUser> => {
  const res = await api.post<AdminUser>('/users', data);
  return res.data;
};

export const updateAdmin = async (id: string, data: AdminFormData): Promise<AdminUser> => {
  const res = await api.put<AdminUser>(`/users/${id}`, data);
  return res.data;
};

export const updateAdminStatus = async (id: string, status: AdminStatus): Promise<AdminUser> => {
  const res = await api.patch<AdminUser>(`/users/${id}/status?status=${status}`);
  return res.data;
};
