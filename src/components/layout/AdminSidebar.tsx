import '@/index.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SECTION_PATH_MAP } from '@/constants/adminNav';






interface AdminSidebarProps {
  activeSection: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection
}) => {
  const { currentAdmin } = useAdmin();
  const navigate = useNavigate();

  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentAdmin.role));

  return (
    <nav className="w-full gradient-sidebar border-b border-sidebar-border hidden lg:block">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-1 overflow-x-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id + item.label}
                onClick={() => {
                  navigate(SECTION_PATH_MAP[item.id] ?? '/admin/dashboard');
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 transition-all duration-200 whitespace-nowrap border-b-2 relative",
                  isActive 
                    ? "border-primary text-white" 
                    : "border-transparent text-slate-300 hover:text-white hover:border-white/30"
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