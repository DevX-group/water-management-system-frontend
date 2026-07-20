import '@/index.css';
import { useAdmin } from '@/contexts/AdminContext';
import React from 'react';
import { Search, Globe, User, ChevronDown, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_ITEMS, SECTION_PATH_MAP } from '@/constants/adminNav';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Role labels and colors
const ROLE_LABELS: Record<string, string> = {
  main_admin: 'Main Admin',
  meter_reader: 'Meter Reader',
  payment_handler: 'Payment Handler',
};

const ROLE_COLORS: Record<string, string> = {
  main_admin: 'bg-red-100 text-red-700',
  meter_reader: 'bg-blue-100 text-blue-700',
  payment_handler: 'bg-green-100 text-green-700',
};

const ROLE_DEFAULT_PATHS: Record<string, string> = {
  main_admin: '/admin/dashboard',
  meter_reader: '/admin/meter',
  payment_handler: '/admin/payments',
};





export const AdminNavbar: React.FC = () => {
  const { currentAdmin, setCurrentRole, admins } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const getSectionFromPath = (pathname: string) => {
    const sections = ['users', 'meter', 'payments', 'billing', 'messaging', 'inquiry', 'reports', 'predictions', 'blog'];
    return sections.find(s => pathname.startsWith(`/admin/${s}`)) || 'dashboard';
  };

  const activeSection = getSectionFromPath(location.pathname);
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentAdmin.role));

  return (
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 gradient-sidebar border-r border-sidebar-border">
            <SheetHeader className="p-6 border-b border-sidebar-border/50">
              <SheetTitle className="text-white text-left flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                WaterAdmin
              </SheetTitle>
            </SheetHeader>
            <div className="py-4">
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
                      "w-full flex items-center gap-3 px-6 py-3 transition-all duration-200",
                      isActive
                        ? "bg-primary/20 text-white border-l-4 border-primary"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers, invoices..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">English</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>සිංහල</DropdownMenuItem>
            <DropdownMenuItem>தமிழ்</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Switcher & Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{currentAdmin.name}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[currentAdmin.role]}`}>
                  {ROLE_LABELS[currentAdmin.role]}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {admins.map((admin) => (
              <DropdownMenuItem
                key={admin.id}
                onClick={() => {
                  setCurrentRole(admin.role);
                  navigate(ROLE_DEFAULT_PATHS[admin.role] ?? '/admin/dashboard');
                }}
                className={currentAdmin.role === admin.role ? 'bg-secondary' : ''}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[admin.role]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{ROLE_LABELS[admin.role]}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};