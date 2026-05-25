import React, { RefObject } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Receipt, HandCoins, X } from "lucide-react";
import { PaymentHistoryItemResponse, PaymentMethod } from "@/types/payment";
import { formatDateTime } from "@/utils/dateUtils";
import { formatPaymentMethod } from "@/utils/paymentUtils";

interface CustomerPaymentHistoryTableProps {
  historyRef: RefObject<HTMLDivElement>;
  historyPageSize: number;
  setHistoryPageSize: (v: number) => void;
  setHistoryPage: React.Dispatch<React.SetStateAction<number>>;
  historyLoading: boolean;
  history: PaymentHistoryItemResponse[];
  historyTotalPages: number;
  historyStart: number;
  historyEnd: number;
  historyTotalItems: number;
  historyPage: number;
  // Filter props
  filterYear: number | undefined;
  setFilterYear: (v: number | undefined) => void;
  filterMethod: PaymentMethod | undefined;
  setFilterMethod: (v: PaymentMethod | undefined) => void;
  onFilterChange: () => void;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

export const CustomerPaymentHistoryTable: React.FC<CustomerPaymentHistoryTableProps> = ({
  historyRef, historyPageSize, setHistoryPageSize, setHistoryPage, historyLoading,
  history, historyTotalPages, historyStart, historyEnd, historyTotalItems, historyPage,
  filterYear, setFilterYear, filterMethod, setFilterMethod, onFilterChange
}) => {
  const hasActiveFilter = filterYear !== undefined || filterMethod !== undefined;

  const handleYearChange = (val: string) => {
    setFilterYear(val === 'all' ? undefined : Number(val));
    onFilterChange();
  };

  const handleMethodChange = (val: string) => {
    setFilterMethod(val === 'all' ? undefined : (val as PaymentMethod));
    onFilterChange();
  };

  const clearFilters = () => {
    setFilterYear(undefined);
    setFilterMethod(undefined);
    onFilterChange();
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "ONLINE": return <Landmark className="w-3 h-3" />;
      case "BANK_TRANSFER": return <Receipt className="w-3 h-3" />;
      case "MANUAL": return <HandCoins className="w-3 h-3" />;
      default: return <Receipt className="w-3 h-3" />;
    }
  };

  return (
    <Card ref={historyRef} className="shadow-card border-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <CardTitle>Payment History</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            View your completed and pending payment records
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Year filter */}
          <Select
            value={filterYear !== undefined ? String(filterYear) : 'all'}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-9 w-[110px] rounded-lg bg-secondary/40 text-xs font-medium">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Method filter */}
          <Select
            value={filterMethod ?? 'all'}
            onValueChange={handleMethodChange}
          >
            <SelectTrigger className="h-9 w-[130px] rounded-lg bg-secondary/40 text-xs font-medium">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 h-9 px-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border/50"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          {/* Page size */}
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select
            value={String(historyPageSize)}
            onValueChange={(value) => {
              setHistoryPageSize(Number(value));
              setHistoryPage(0);
            }}
          >
            <SelectTrigger className="w-[65px] h-9 rounded-lg bg-secondary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-0 w-[70px]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <div className="text-sm text-muted-foreground">Loading payment history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-secondary/50">
                <tr>
                  {["Date", "Amount", "Method", "Status"].map((h) => (
                    <th key={h} className="text-left p-4 font-medium text-sm">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-sm text-muted-foreground text-center">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  <>
                    {history.map((p) => {
                      const isManual = p.paymentMethod === "MANUAL";
                      const displayStatus = isManual && p.paymentType ? `${p.paymentType} - ${p.status}` : p.status;
                      return (
                        <tr key={p.paymentId} className="border-t border-border">
                          <td className="p-4 text-sm">{formatDateTime(p.createdAt)}</td>
                          <td className="p-4 text-sm font-mono">
                            Rs. {p.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-sm">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {getPaymentIcon(p.paymentMethod)}
                              {formatPaymentMethod(p.paymentMethod)}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge className={p.status === "FULL" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                              {displayStatus}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>

            {historyTotalPages > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                <div className="text-sm text-muted-foreground">
                  {historyStart}-{historyEnd} of {historyTotalItems} items
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setHistoryPage(0)} disabled={historyPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;&lt;</button>
                  <button onClick={() => setHistoryPage((p) => Math.max(p - 1, 0))} disabled={historyPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;</button>
                  <div className="text-sm px-3">Page {historyPage + 1} of {historyTotalPages}</div>
                  <button onClick={() => setHistoryPage((p) => Math.min(p + 1, historyTotalPages - 1))} disabled={historyPage === historyTotalPages - 1} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&gt;</button>
                  <button onClick={() => setHistoryPage(historyTotalPages - 1)} disabled={historyPage === historyTotalPages - 1} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&gt;&gt;</button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
