export type AdminRole = 'SUPER_ADMIN' | 'SYSTEM_ADMIN' | 'CUSTOMER_HANDLER' | 'METER_READER';
export type Section = 'dashboard' | 'users' | 'meter' | 'payments' | 'billing' | 'messaging' | 'internal-chat' | 'inquiry' | 'reports' | 'predictions' | 'blog' | 'settings' | 'system-settings' | 'widget-management' | 'customers';
export type AdminStatus = 'PENDING_ACTIVATION' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AdminUser {
  id: string;
  nic: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFormData {
  nic: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: AdminRole;
}
