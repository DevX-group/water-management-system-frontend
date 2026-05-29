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
  searchQuery:            string;
  setSearchQuery:         (v: string) => void;
  filterStatus:           string;
  setFilterStatus:        (v: string) => void;
  filterRegion:           string;
  setFilterRegion:        (v: string) => void;
  filterConnectionType:   string;
  setFilterConnectionType:(v: string) => void;
  currentPage:            number;
  setCurrentPage:         (v: number) => void;
  totalPages:             number;
  processedCustomers:     Customer[];
  paginatedCustomers:     Customer[];
  sortBy:                 string;
  sortOrder:              'asc' | 'desc';
  totalCount:             number;
  onSort:                 (col: string) => void;
  onView:                 (c: Customer) => void;
  onEdit:                 (c: Customer) => void;
  onDelete:               (id: string, name: string) => void;
  onClearFilters:         () => void;
}

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
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">All Customers</h3>
          <p className="text-sm text-muted-foreground">
            Showing {processedCustomers.length} of {totalCount} customers
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, NIC, or subscription number..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="pl-10 bg-accent/30"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Filter by Status</Label>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="bg-accent/30"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="PENDING_ACTIVATION">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Filter by Region</Label>
          <Select value={filterRegion} onValueChange={(v) => { setFilterRegion(v); setCurrentPage(1); }}>
            <SelectTrigger className="bg-accent/30"><SelectValue placeholder="All Regions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.entries(REGION_CONFIG).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Filter by Connection Type</Label>
          <Select value={filterConnectionType} onValueChange={(v) => { setFilterConnectionType(v); setCurrentPage(1); }}>
            <SelectTrigger className="bg-accent/30"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="metered">Metered</SelectItem>
              <SelectItem value="non-metered">Non Metered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filterStatus || filterRegion || filterConnectionType || searchQuery) && (
        <div className="mb-4">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground cursor-pointer hover:bg-accent/50 rounded transition-colors"
                onClick={() => onSort('name')}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">NIC</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Subscription No</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Phone</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Region</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground cursor-pointer hover:bg-accent/50 rounded transition-colors"
                onClick={() => onSort('registeredDate')}>
                Registered {sortBy === 'registeredDate' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Status</th>
              <th className="pb-3 px-2 py-2 text-sm font-bold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className={`border-b border-border/50 last:border-0 ${customer.isDeleted ? 'opacity-50' : ''}`}>
                <td className="py-4 text-sm text-foreground">{customer.name}</td>
                <td className="py-4 text-sm text-muted-foreground">{customer.nic}</td>
                <td className="py-4 text-sm text-muted-foreground">{customer.subscriptionNo}</td>
                <td className="py-4 text-sm text-muted-foreground">{customer.phone}</td>
                <td className="py-4 text-sm text-muted-foreground capitalize">{customer.region}</td>
                <td className="py-4 text-sm text-muted-foreground">
                  {new Date(customer.registeredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'ACTIVE' ? 'bg-success/10 text-success' : customer.status === 'INACTIVE' ? 'bg-muted text-muted-foreground' : 'bg-blue-500/10 text-blue-500'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onView(customer)} className="p-1 hover:bg-accent rounded" title="View">
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                    <button onClick={() => onEdit(customer)} disabled={customer.isDeleted}
                      className="p-1 hover:bg-accent rounded disabled:opacity-50" title="Edit">
                      <Edit className="w-4 h-4 text-green-600" />
                    </button>
                    <button onClick={() => onDelete(customer.id, customer.name)} disabled={customer.isDeleted}
                      className="p-1 hover:bg-accent rounded disabled:opacity-50" title="Deactivate">
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
          <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
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
