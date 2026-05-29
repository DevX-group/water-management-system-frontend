import { LayoutDashboard, Users, Gauge, Receipt, CreditCard, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import type { AdminRole } from '@/types/admin';

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  roles: AdminRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  { icon: Users, label: 'User Management', id: 'users', roles: ['SUPER_ADMIN'] },
  { icon: Gauge, label: 'Meter Reading', id: 'meter', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'METER_READER'] },
  { icon: Receipt, label: 'Billing', id: 'billing', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  { icon: CreditCard, label: 'Add Payment', id: 'payments', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'PAYMENT_HANDLER'] },
  { icon: CreditCard, label: 'Payments', id: 'payments', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'PAYMENT_HANDLER'] },
  { icon: MessageSquare, label: 'Messaging', id: 'messaging', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  { icon: MessageSquare, label: 'Inquiry', id: 'inquiry', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  { icon: BarChart3, label: 'Reports', id: 'reports', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  { icon: TrendingUp, label: 'Predictions', id: 'predictions', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  { icon: MessageSquare, label: 'Blog', id: 'blog', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
];

export const SECTION_PATH_MAP: Record<string, string> = {
  dashboard: '/admin/dashboard',
  users: '/admin/users',
  meter: '/admin/meter',
  payments: '/admin/payments',
  billing: '/admin/billing',
  messaging: '/admin/messaging',
  inquiry: '/admin/inquiry',
  reports: '/admin/reports',
  predictions: '/admin/predictions',
  blog: '/admin/blog',
};
