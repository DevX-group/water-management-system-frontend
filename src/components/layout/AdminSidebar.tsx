import '@/index.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SECTION_PATH_MAP } from '@/constants/adminNav';
import type { NavItem } from '@/constants/adminNav';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Receipt, MessageSquare, BarChart3, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection
}) => {
  const { currentAdmin } = useAdmin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentAdmin.role));

  const GROUP_CONFIG = [
    { id: 'dashboard', items: ['dashboard'] },
    { id: 'users', items: ['users'] },
    { id: 'meter', items: ['meter'] },
    { id: 'finance', label: 'Finance', icon: Receipt, items: ['billing', 'payments'] },
    { id: 'communications', label: 'Communications', icon: MessageSquare, items: ['messaging', 'internal-chat', 'inquiry', 'blog'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, items: ['reports', 'predictions'] },
    { id: 'settings', label: 'Settings', icon: Settings, items: ['activity-logs', 'widget-management', 'system-settings'] }
  ];

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    return (
      <button
        key={item.id + item.label}
        onClick={() => {
          navigate(SECTION_PATH_MAP[item.id] ?? '/admin/dashboard');
        }}
        className={cn(
          "flex items-center gap-2 px-4 py-3 transition-all duration-200 whitespace-nowrap border-b-2 relative outline-none",
          isActive 
            ? "border-primary-foreground text-primary-foreground bg-white/10" 
            : "border-transparent text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/5"
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium text-sm">{t(`navbar:admin.${item.id}`, item.label)}</span>
      </button>
    );
  };

  return (
    <nav className="w-full bg-primary border-b border-primary/20 hidden lg:block">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-1 overflow-x-auto">
          {GROUP_CONFIG.map(group => {
            const accessibleItems = filteredNavItems.filter(nav => group.items.includes(nav.id));
            if (accessibleItems.length === 0) return null;

            if (accessibleItems.length === 1 && !group.label) {
              return renderItem(accessibleItems[0]);
            }
            
            // If it's a designated group or has multiple items, render a dropdown
            const isGroupActive = accessibleItems.some(nav => nav.id === activeSection);
            const GroupIcon = group.icon || accessibleItems[0].icon;
            
            return (
              <DropdownMenu key={group.id}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 transition-all duration-200 whitespace-nowrap border-b-2 relative outline-none",
                      isGroupActive 
                        ? "border-primary-foreground text-primary-foreground bg-white/10" 
                        : "border-transparent text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/5"
                    )}
                  >
                    <GroupIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium text-sm">{group.label || t(`navbar:admin.${accessibleItems[0].id}`, accessibleItems[0].label)}</span>
                    <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-card text-card-foreground">
                  {accessibleItems.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => navigate(SECTION_PATH_MAP[item.id] ?? '/admin/dashboard')}
                        className={cn("flex items-center gap-2 cursor-pointer", isActive && "bg-accent/50 text-accent-foreground")}
                      >
                        <ItemIcon className="w-4 h-4" />
                        <span className="text-sm">{t(`navbar:admin.${item.id}`, item.label)}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
