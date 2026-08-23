import '@/index.css';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Search, Globe, User, ChevronDown, Menu, Droplets, Receipt, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_ITEMS, SECTION_PATH_MAP } from '@/constants/adminNav';
import type { NavItem } from '@/constants/adminNav';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { motion } from 'framer-motion';
import { useSystemDetails } from '@/context/SystemDetailsContext';

const ROLE_LABELS: Record<string, string> = {
  main_admin: 'Main Admin',
  meter_reader: 'Meter Reader',
  payment_handler: 'Customer Handler',
  SUPER_ADMIN: 'Super Admin',
  SYSTEM_ADMIN: 'System Admin',
  CUSTOMER_HANDLER: 'Customer Handler',
  PAYMENT_HANDLER: 'Customer Handler',
  METER_READER: 'Meter Reader',
};

const ROLE_COLORS: Record<string, string> = {
  main_admin: 'bg-red-100 text-red-700',
  meter_reader: 'bg-blue-100 text-blue-700',
  payment_handler: 'bg-green-100 text-green-700',
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  SYSTEM_ADMIN: 'bg-red-100 text-red-700',
  CUSTOMER_HANDLER: 'bg-green-100 text-green-700',
  PAYMENT_HANDLER: 'bg-green-100 text-green-700',
  METER_READER: 'bg-blue-100 text-blue-700',
};

const languages = [
  { code: "en", name: "English" },
  { code: "si", name: "සිංහල" },
  { code: "ta", name: "தமிழ்" },
];

const GROUP_CONFIG = [
  { id: 'dashboard', items: ['dashboard'] },
  { id: 'users', items: ['users'] },
  { id: 'meter', items: ['meter'] },
  { id: 'finance', label: 'Finance', icon: Receipt, items: ['billing', 'payments'] },
  { id: 'communications', label: 'Communications', icon: MessageSquare, items: ['messaging', 'internal-chat', 'inquiry', 'blog'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, items: ['reports', 'predictions'] },
  { id: 'settings', label: 'Settings', icon: Settings, items: ['activity-logs', 'widget-management', 'system-settings'] }
];

export const AdminNavbar: React.FC = () => {
  const { systemDetails } = useSystemDetails();
  const companyName = systemDetails?.companyName || 'Galle Pradeshiya Sabha';
  const { currentAdmin } = useAdmin();
  const { logout, user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user?.nic ?? currentAdmin.name;
  const displayNic = user?.nic ?? '';
  const backendRole = user?.role ?? '';
  const roleLabel = ROLE_LABELS[backendRole] ?? ROLE_LABELS[currentAdmin.role] ?? backendRole ?? 'Unknown Role';
  const roleColor = ROLE_COLORS[backendRole] ?? ROLE_COLORS[currentAdmin.role] ?? 'bg-slate-100 text-slate-700';

  const getSectionFromPath = (pathname: string) => {
    const sections = ['users', 'meter', 'payments', 'billing', 'messaging', 'inquiry', 'reports', 'predictions', 'blog', 'activity-logs', 'widget-management', 'system-settings'];
    return sections.find(s => pathname.startsWith(`/admin/${s}`)) || 'dashboard';
  };

  const activeSection = getSectionFromPath(location.pathname);
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentAdmin.role));

  const adminLanguage = localStorage.getItem("admin_language") || "en";
  const changeAdminLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("admin_language", lang);
  };

  const renderSingleItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.id + item.label}>
        <button
          onClick={() => navigate(SECTION_PATH_MAP[item.id] ?? '/admin/dashboard')}
          className={cn(
            "inline-flex items-center justify-center gap-2 h-9 px-3 text-sm font-medium rounded-lg relative transition-all duration-300 outline-none",
            isActive
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/50"
          )}
        >
          <Icon className="w-4 h-4" />
          {t(`navbar:admin.${item.id}`, item.label)}
        </button>
      </motion.div>
    );
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass rounded-2xl px-4 lg:px-6 py-3 flex items-center justify-between max-w-[1400px] mx-auto shadow-sm">
          {/* Mobile Menu */}
          <div className="xl:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-xl w-10 h-10 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white transition-colors outline-none">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="admin-wrapper w-72 p-0 border-r border-sidebar-border">
                <div className="w-full h-full gradient-sidebar flex flex-col justify-between">
                  <div className="flex-1 overflow-y-auto">
                    <SheetHeader className="p-4 border-b border-sidebar-border/50">
                      <SheetTitle className="text-white text-left flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft shrink-0">
                          <Droplets className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex flex-col items-start justify-center gap-[1px]">
                          <span className="text-sm font-bold leading-none text-white py-[1px]">
                            {companyName}
                          </span>
                          <span className="text-[10px] font-semibold leading-none text-slate-400">
                            Water Management System
                          </span>
                        </div>
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
                            <span className="font-medium text-sm">{t(`navbar:admin.${item.id}`, item.label)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-4 border-t border-sidebar-border/50 bg-slate-900/40">
                    <PWAInstallButton size="default" className="w-full justify-center shadow-md py-2.5" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col items-start justify-center gap-[1px]">
              <span className="text-[10px] font-semibold leading-none text-muted-foreground hidden sm:block">
                ගාල්ල ප්‍රාදේශීය සභාව
              </span>
              <span className="text-sm font-bold leading-none text-primary py-[1px]">
                Galle Pradeshiya Sabha
              </span>
              <span className="text-[10px] font-semibold leading-none text-muted-foreground hidden sm:block">
                காலி பிரதேச සபை
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center bg-secondary/50 rounded-xl p-1 gap-1 mx-2 overflow-hidden">
            {GROUP_CONFIG.map(group => {
              const accessibleItems = filteredNavItems.filter(nav => group.items.includes(nav.id));
              if (accessibleItems.length === 0) return null;

              if (accessibleItems.length === 1 && !group.label) {
                return renderSingleItem(accessibleItems[0]);
              }

              const isGroupActive = accessibleItems.some(nav => nav.id === activeSection);
              const GroupIcon = group.icon || accessibleItems[0].icon;

              return (
                <DropdownMenu key={group.id}>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <button
                        className={cn(
                          "inline-flex items-center justify-center gap-1 h-9 px-2.5 text-sm font-medium rounded-lg relative transition-all duration-300 outline-none",
                          isGroupActive
                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/50"
                        )}
                      >
                        <GroupIcon className="w-4 h-4 mr-1" />
                        {group.label || t(`navbar:admin.${accessibleItems[0].id}`, accessibleItems[0].label)}
                        <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
                      </button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48 bg-card text-card-foreground rounded-xl">
                    {accessibleItems.map(item => {
                      const ItemIcon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => navigate(SECTION_PATH_MAP[item.id] ?? '/admin/dashboard')}
                          className={cn(
                            "flex items-center gap-2 cursor-pointer rounded-lg m-1",
                            "focus:bg-secondary focus:text-foreground hover:bg-secondary hover:text-foreground",
                            isActive && "bg-secondary text-foreground"
                          )}
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

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto xl:ml-0">
            {/* PWA Install Button for Meter Readers */}
            <div className="flex items-center">
              <PWAInstallButton size="sm" />
            </div>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-xl w-9 h-9 flex text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white transition-colors outline-none">
                  <Globe className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeAdminLanguage(lang.code)}
                    className={cn(
                      "rounded-lg m-1 cursor-pointer",
                      "focus:bg-secondary focus:text-foreground hover:bg-secondary hover:text-foreground",
                      adminLanguage === lang.code && "bg-secondary"
                    )}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft cursor-pointer"
                >
                  <User className="w-5 h-5 text-primary-foreground" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>{t('navbar:admin.myAccount', 'My Account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                  {displayNic ? (
                    <p className="text-xs text-muted-foreground">NIC: {displayNic}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground mt-1">Role: <span className={cn("inline-block px-1.5 py-0.5 rounded text-[10px] font-medium", roleColor)}>{roleLabel}</span></p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="cursor-pointer rounded-lg m-1 focus:bg-secondary focus:text-foreground hover:bg-secondary hover:text-foreground">
                  {t('navbar:admin.profileSettings', 'Profile Settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10 cursor-pointer rounded-lg m-1">{t('navbar:admin.logout', 'Logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
