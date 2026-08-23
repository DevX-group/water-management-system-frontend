import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import '@/index.css';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomerNotificationBell } from "@/components/notifications/CustomerNotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Droplets,
  Menu,
  Globe,
  Home,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useTranslation } from 'react-i18next';

const navLinks = [
  { name: "Dashboard", path: "/customer/dashboard", icon: Home },
  { name: "Bills", path: "/customer/bills", icon: FileText },
  { name: "Payments", path: "/customer/payments", icon: CreditCard },
  { name: "Usage", path: "/customer/usage", icon: BarChart3 },
  { name: "Alerts", path: "/customer/notifications", icon: Bell },
  { name: "Inquiry", path: "/customer/inquiry", icon: Bell },
];

import { useSystemDetails } from "@/context/SystemDetailsContext";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "si", name: "සිංහල", flag: "🇱🇰" },
  { code: "ta", name: "தமிழ்", flag: "🇱🇰" },
];

interface NavbarProps {
  isAuthenticated?: boolean;
}

export const Navbar = ({ isAuthenticated = false }: NavbarProps) => {
  const { systemDetails } = useSystemDetails();
  const companyName = systemDetails?.companyName || 'Galle Pradeshiya Sabha';
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };


  const isActive = (path: string) => location.pathname === path;

  const [customerData, setCustomerData] = useState<{ name: string, email: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      import('@/services/api').then(({ api }) => {
        api.get('/customers/me')
          .then(res => {
            if (res.data) {
              setCustomerData({
                name: res.data.accountHolderName || 'Customer',
                email: res.data.user?.email || 'No email provided'
              });
            }
          })
          .catch(err => console.error('Failed to fetch customer for navbar', err));
      });
    }
  }, [isAuthenticated]);

  const CompanyNameBlock = () => (
    <div className="hidden sm:flex flex-col items-start justify-center gap-[1px]">
      <span className="text-[10px] font-semibold leading-none text-muted-foreground">
        ගාල්ල ප්‍රාදේශීය සභාව
      </span>
      <span className="text-sm font-bold leading-none text-gradient py-[1px]">
        Galle Pradeshiya Sabha
      </span>
      <span className="text-[10px] font-semibold leading-none text-muted-foreground">
        காலி பிரதேச சபை
      </span>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <nav className="glass rounded-2xl px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
              >
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div className="hidden sm:block"><CompanyNameBlock /></div>
            </Link>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">{languages.find(l => l.code === language)?.flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`gap-3 rounded-lg ${language === lang.code ? "bg-secondary" : ""}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/login">
                <Button variant="ghost" className="rounded-xl">{t('navbar:customer.signin', 'Sign in')}</Button>
              </Link>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="gradient-primary shadow-soft rounded-xl gap-2 btn-shine">
                    <Sparkles className="w-4 h-4" />
                    {t('navbar:customer.getStarted', 'Get Started')}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass rounded-2xl px-4 lg:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/customer/dashboard" className="hidden lg:flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
            >
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <CompanyNameBlock />
          </Link>
          <div className="hidden lg:flex items-center bg-secondary/50 rounded-xl p-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 rounded-lg relative transition-all duration-300 ${active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t(`navbar:customer.${link.name.toLowerCase()}`)}
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <CustomerNotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl w-9 h-9">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl min-w-[150px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`gap-3 rounded-lg ${language === lang.code ? "bg-secondary" : ""}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <div className="px-3 py-2 mb-2">
                  <p className="font-medium">{customerData?.name || 'Customer'}</p>
                  <p className="text-sm text-muted-foreground">{customerData?.email || ''}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link to="/customer/profile" className="flex items-center gap-3 cursor-pointer">
                    <User className="w-4 h-4" />
                    {t('navbar:customer.profile', 'Profile')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link to="/customer/settings" className="flex items-center gap-3 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    {t('navbar:customer.settings', 'Settings')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="rounded-lg text-destructive focus:text-destructive cursor-pointer">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    {t('navbar:customer.signout', 'Sign out')}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                    <Droplets className="w-5 h-5 text-primary-foreground" />
                  </div>

                  {/* Company Name in Mobile Menu (Optional, using stacked logic or simple name) */}
                  <div className="flex flex-col items-start justify-center gap-[1px]">
                    <span className="text-[10px] font-semibold leading-none text-muted-foreground">ජාතික ජල සම්පාදන මණ්ඩලය</span>
                    <span className="text-sm font-bold leading-none text-gradient py-[1px]">Water Supply Board</span>
                    <span className="text-[15px] font-semibold leading-none text-muted-foreground">தேசிய நீர் வழங்கல் சபை</span>
                  </div>
                </div>
                <nav className="space-y-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant={active ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 h-12 rounded-xl ${active ? "shadow-sm" : ""}`}
                          >
                            <Icon className="w-5 h-5" />
                            {t(`navbar:customer.${link.name.toLowerCase()}`)}
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};