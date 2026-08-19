import '@/index.css';
import React from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Customer } from '@/types/user';
import { REGION_CONFIG } from '@/hooks/useUserManagement';

interface CustomerTableProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterRegion: string;
  setFilterRegion: (v: string) => void;
  filterConnectionType: string;
  setFilterConnectionType: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  totalPages: number;
  processedCustomers: Customer[];
  paginatedCustomers: Customer[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  totalCount: number;
  onSort: (col: string) => void;
  onView: (c: Customer) => void;
  onEdit: (c: Customer) => void;
  onDelete: (id: string, name: string) => void;
  onClearFilters: () => void;
}

import { useTranslation } from 'react-i18next';

export const CustomerTable: React.FC<CustomerTableProps> = ({
  searchQuery, setSearchQuery,
  filterStatus, setFilterStatus,
  filterRegion, setFilterRegion,
  filterConnectionType, setFilterConnectionType,
  currentPage, setCurrentPage,
  totalPages, processedCustomers, paginatedCustomers,
  sortBy, sortOrder, totalCount,
  onSort, onView, onEdit, onDelete, onClearFilters,
}) => {
  const { t, i18n } = useTranslation('userManagement');
  const siMonths = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (i18n.language?.startsWith('si')) {
      return `${d.getFullYear()} ${siMonths[d.getMonth()]} ${d.getDate()}`;
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t('allCustomers')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('showing', { count: processedCustomers.length, total: totalCount })}
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="pl-10 bg-background"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">{t('filterByStatus')}</Label>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="bg-background"><SelectValue placeholder={t('allStatus')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatus')}</SelectItem>
              <SelectItem value="ACTIVE">{t('active')}</SelectItem>
              <SelectItem value="INACTIVE">{t('inactive')}</SelectItem>
              <SelectItem value="PENDING_ACTIVATION">{t('pending')}</SelectItem>
              <SelectItem value="SUSPENDED">{t('suspended')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">{t('filterByRegion')}</Label>
          <Select value={filterRegion} onValueChange={(v) => { setFilterRegion(v); setCurrentPage(1); }}>
            <SelectTrigger className="bg-background"><SelectValue placeholder={t('allRegions')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allRegions')}</SelectItem>
              {Object.values(REGION_CONFIG).map((val) => (
                <SelectItem key={val.code} value={val.code}>{t(`regions.${val.code}`, val.label)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">{t('filterByConnectionType')}</Label>
          <Select value={filterConnectionType} onValueChange={(v) => { setFilterConnectionType(v); setCurrentPage(1); }}>
            <SelectTrigger className="bg-background"><SelectValue placeholder={t('allTypes')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="metered">{t('metered')}</SelectItem>
              <SelectItem value="non-metered">{t('nonMetered')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filterStatus || filterRegion || filterConnectionType || searchQuery) && (
        <div className="mb-4">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}>
            {t('clearAllFilters')}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground cursor-pointer hover:bg-accent/50 rounded transition-colors"
                onClick={() => onSort('name')}>
                {t('name')} {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">{t('nic')}</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">{t('subscriptionNo')}</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">{t('phone')}</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">{t('region')}</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground cursor-pointer hover:bg-accent/50 rounded transition-colors"
                onClick={() => onSort('registeredDate')}>
                {t('registered')} {sortBy === 'registeredDate' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">{t('status')}</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className={`border-b border-border/50 last:border-0 ${customer.isDeleted ? 'opacity-50' : ''}`}>
                <td className="py-4 text-sm text-foreground">{customer.name}</td>
                <td className="py-4 text-sm text-muted-foreground">{customer.nic}</td>
                <td className="py-4 text-sm text-muted-foreground">{customer.subscriptionNo}</td>
                <td className="py-4 text-sm text-muted-foreground">{customer.phone}</td>
                <td className="py-4 text-sm text-muted-foreground">
                  {t(`regions.${customer.region}`, Object.values(REGION_CONFIG).find(r => r.code === customer.region)?.label || customer.region)}
                </td>
                <td className="py-4 text-sm text-muted-foreground">
                  {formatDate(customer.registeredDate)}
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'ACTIVE' ? 'bg-success/10 text-success' : customer.status === 'INACTIVE' ? 'bg-muted text-muted-foreground' : 'bg-blue-500/10 text-blue-500'}`}>
                    {customer.status === 'ACTIVE' ? t('active') : customer.status === 'INACTIVE' ? t('inactive') : customer.status === 'PENDING_ACTIVATION' ? t('pending') : customer.status === 'SUSPENDED' ? t('suspended') : customer.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onView(customer)} className="p-1 hover:bg-accent rounded" title={t('view')}>
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                    <button onClick={() => onEdit(customer)} disabled={customer.isDeleted}
                      className="p-1 hover:bg-accent rounded disabled:opacity-50" title={t('edit')}>
                      <Edit className="w-4 h-4 text-green-600" />
                    </button>
                    <button onClick={() => onDelete(customer.id, customer.name)} disabled={customer.isDeleted}
                      className="p-1 hover:bg-accent rounded disabled:opacity-50" title={t('deactivate')}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">{t('page', { current: currentPage, total: totalPages })}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button key={page} variant={page === currentPage ? 'default' : 'outline'}
                size="sm" className="w-8 h-8 p-0" onClick={() => setCurrentPage(page)}>
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
