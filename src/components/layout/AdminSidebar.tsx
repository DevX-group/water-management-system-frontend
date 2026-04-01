
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Gauge, Receipt, CreditCard, MessageSquare, BarChart3, TrendingUp, Droplets } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';




interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  roles: string[];
}

interface AdminSidebarProps {
  activeSection: string;
}

const navItems: NavItem[] = [
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
];

const sectionPathMap: Record<string, string> = {
  dashboard: '/admin/dashboard',
  users: '/admin/users',
  meter: '/admin/meter',
  payments: '/admin/payments',
  billing: '/admin/billing',
  messaging: '/admin/messaging',
  inquiry: '/admin/inquiry',
  reports: '/admin/reports',
  predictions: '/admin/predictions',
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection
}) => {
  const { currentAdmin } = useAdmin();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentAdmin.role));

  return (
    <nav className="w-full gradient-sidebar border-b border-sidebar-border">
      <div className="w-full px-32">
        <div className="flex items-center gap-1 overflow-x-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id + item.label}
                onClick={() => {
                  navigate(sectionPathMap[item.id] ?? '/admin/dashboard');
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 transition-all duration-200 whitespace-nowrap border-b-2 relative",
                  isActive 
                    ? "border-sidebar-primary text-sidebar-foreground" 
                    : "border-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground hover:border-sidebar-foreground/30"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};