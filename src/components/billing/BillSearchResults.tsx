import '@/index.css';
import React from 'react';
import { FileText, Eye, Download, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BillResponse } from '@/types/billing';
import { STATUS_STYLES } from '@/utils/billingUtils';

interface BillSearchResultsProps {
  searchQuery:    string;
  setSearchQuery: (v: string) => void;
  loadingBills:   boolean;
  hasSearched:    boolean;
  searchedSub:    string;
  bills:          BillResponse[];
  billIndex:      number;
  setBillIndex:   (fn: (prev: number) => number) => void;
  billsPerPage:   number;
  onSearch:       () => void;
  onDownload:     (billId: number) => void;
}

export const BillSearchResults: React.FC<BillSearchResultsProps> = ({
  searchQuery, setSearchQuery, loadingBills, hasSearched,
  searchedSub, bills, billIndex, setBillIndex, billsPerPage,
  onSearch, onDownload,
}) => {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Search input */}
      <div className="bg-card rounded-2xl p-6 shadow-md">
        <h3 className="text-base font-semibold text-foreground mb-4">Search Bills by Subscription Number</h3>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="e.g., SUB-0001"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="max-w-sm"
          />
          <Button onClick={onSearch} disabled={loadingBills || !searchQuery.trim()}>
            {loadingBills && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {loadingBills ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="bg-card rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bills for {searchedSub}</h3>
              <p className="text-sm text-muted-foreground">
                {loadingBills ? 'Loading...' : `${bills.length} bill${bills.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>

          {loadingBills ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading bills...
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No bills found for this subscription number.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bills.slice(billIndex, billIndex + billsPerPage).map((b) => (
                <div key={b.billId} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">Bill #{b.billId}</p>
                      <p className="text-sm text-muted-foreground">Period: {b.billingPeriod}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div><p className="text-muted-foreground text-xs">Bill Date</p><p className="font-medium text-foreground">{b.billDate}</p></div>
                    <div><p className="text-muted-foreground text-xs">Due Date</p><p className="font-medium text-foreground">{b.dueDate}</p></div>
                    <div><p className="text-muted-foreground text-xs">Usage</p><p className="font-medium text-foreground">{b.usageUnits} units</p></div>
                    <div><p className="text-muted-foreground text-xs">Balance Due</p><p className="font-medium text-foreground">LKR {Number(b.balanceDue).toFixed(2)}</p></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">LKR {Number(b.totalAmount).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => window.location.href = '/customer/bills'}>
                        <Eye className="w-3 h-3 mr-1" /> View Details
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDownload(b.billId)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {bills.length > billsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button variant="outline" size="sm"
                    onClick={() => setBillIndex(prev => Math.max(0, prev - billsPerPage))}
                    disabled={billIndex === 0}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm font-medium">
                    {billIndex + 1} - {Math.min(billIndex + billsPerPage, bills.length)} of {bills.length}
                  </span>
                  <Button variant="outline" size="sm"
                    onClick={() => setBillIndex(prev => Math.min(bills.length - billsPerPage, prev + billsPerPage))}
                    disabled={billIndex + billsPerPage >= bills.length}>
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
