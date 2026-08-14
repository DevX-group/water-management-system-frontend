import '@/index.css';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Search, Globe, User, ChevronDown, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_ITEMS, SECTION_PATH_MAP } from '@/constants/adminNav';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';

// Role labels and colors
const ROLE_LABELS: Record<string, string> = {
  main_admin: 'Main Admin',
  meter_reader: 'Meter Reader',
  payment_handler: 'Payment Handler',
  SUPER_ADMIN: 'Super Admin',
  SYSTEM_ADMIN: 'System Admin',
  PAYMENT_HANDLER: 'Payment Handler',
  METER_READER: 'Meter Reader',
};

const ROLE_COLORS: Record<string, string> = {
  main_admin: 'bg-red-100 text-red-700',
  meter_reader: 'bg-blue-100 text-blue-700',
  payment_handler: 'bg-green-100 text-green-700',
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  SYSTEM_ADMIN: 'bg-red-100 text-red-700',
  PAYMENT_HANDLER: 'bg-green-100 text-green-700',
  METER_READER: 'bg-blue-100 text-blue-700',
};

const languages = [
  { code: "en", name: "English" },
  { code: "si", name: "සිංහල" },
  { code: "ta", name: "தமிழ்" },
];

export const AdminNavbar: React.FC = () => {
  const { currentAdmin } = useAdmin();
  const { logout, user } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user?.nic ?? currentAdmin.name;
  const displayNic = user?.nic ?? '';
  const backendRole = user?.role ?? '';
  const roleLabel = ROLE_LABELS[backendRole] ?? ROLE_LABELS[currentAdmin.role] ?? backendRole ?? 'Unknown Role';
  const roleColor = ROLE_COLORS[backendRole] ?? ROLE_COLORS[currentAdmin.role] ?? 'bg-slate-100 text-slate-700';

  const getSectionFromPath = (pathname: string) => {
    const sections = ['users', 'meter', 'payments', 'billing', 'messaging', 'inquiry', 'reports', 'predictions', 'blog'];
    return sections.find(s => pathname.startsWith(`/admin/${s}`)) || 'dashboard';
  };

  const activeSection = getSectionFromPath(location.pathname);
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentAdmin.role));

  const adminLanguage = localStorage.getItem("admin_language") || "en";
  const changeAdminLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("admin_language", lang);
  };

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
        {/* PWA Install Button for Meter Readers */}
        <PWAInstallButton size="sm" />

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">
                {languages.find(l => l.code === adminLanguage)?.name || "English"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeAdminLanguage(lang.code)}
                className={adminLanguage === lang.code ? "bg-secondary" : ""}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
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
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleColor}`}>
                  {roleLabel}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              {displayNic ? (
                <p className="text-xs text-muted-foreground">NIC: {displayNic}</p>
              ) : null}
              <p className="text-xs text-muted-foreground">Role: {roleLabel}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};