import { useAdmin } from '@/contexts/AdminContext';
import React from 'react';
import { Search, Globe, User, ChevronDown } from 'lucide-react';

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


export const AdminNavbar: React.FC = () => {
  const { currentAdmin, setCurrentRole, admins } = useAdmin();

  return (
    <header className="h-16 bg-card border-b border-border px-32 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
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
                onClick={() => setCurrentRole(admin.role)}
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
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};