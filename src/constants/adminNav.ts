import { LayoutDashboard, Users, Gauge, Receipt, CreditCard, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  roles: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', roles: ['main_admin'] },
  { icon: Users, label: 'User Management', id: 'users', roles: ['main_admin'] },
  { icon: Gauge, label: 'Meter Reading', id: 'meter', roles: ['meter_reader'] },
  { icon: Receipt, label: 'Billing', id: 'billing', roles: ['main_admin'] },
  { icon: CreditCard, label: 'Add Payment', id: 'payments', roles: ['payment_handler'] },
  { icon: CreditCard, label: 'Payments', id: 'payments', roles: ['main_admin'] },
  { icon: MessageSquare, label: 'Messaging', id: 'messaging', roles: ['main_admin'] },
  { icon: MessageSquare, label: 'Inquiry', id: 'inquiry', roles: ['main_admin'] },
  { icon: BarChart3, label: 'Reports', id: 'reports', roles: ['main_admin'] },
  { icon: TrendingUp, label: 'Predictions', id: 'predictions', roles: ['main_admin'] },
  { icon: MessageSquare, label: 'Blog', id: 'blog', roles: ['main_admin'] },
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
