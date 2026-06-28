import '@/index.css';
import React, { RefObject } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Receipt, HandCoins, X } from "lucide-react";
import { PaymentHistoryItemResponse, PaymentMethod } from "@/types/payment";
import { formatDateTime } from "@/utils/dateUtils";
import { formatPaymentMethod } from "@/utils/paymentUtils";
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();
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
          <CardTitle>{t('payments.paymentHistory.title')}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('payments.paymentHistory.subtitle')}
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
              <SelectItem value="all">{t('payments.filters.allYears')}</SelectItem>
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
              <SelectItem value="all">{t('payments.filters.allMethods')}</SelectItem>
              <SelectItem value="ONLINE">{t('payments.filters.online')}</SelectItem>
              <SelectItem value="BANK_TRANSFER">{t('payments.filters.bankTransfer')}</SelectItem>
              <SelectItem value="MANUAL">{t('payments.filters.manual')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 h-9 px-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border/50"
            >
              <X className="w-3 h-3" />
              {t('payments.filters.clear')}
            </button>
          )}

          {/* Page size */}
          <span className="text-sm text-muted-foreground">{t('payments.paymentHistory.itemsPerPage')}</span>
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
          <div className="text-sm text-muted-foreground">{t('payments.paymentHistory.loadingHistory')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-secondary/50">
                <tr>
                  {["Date", "Amount", "Method", "Status"].map((h) => (
                    <th key={h} className="text-left p-4 font-medium text-sm">{t(`payments.paymentHistory.${h.toLowerCase()}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-sm text-muted-foreground text-center">
                      {t('payments.paymentHistory.noPaymentsFound')}
                    </td>
                  </tr>
                ) : (
                  <>
                    {history.map((p) => {
                      const isManual = p.paymentMethod === "MANUAL";
                      const translatedStatus = p.status === "FULL" ? t('payments.filters.full') :
                                               p.status === "PARTIAL" ? t('payments.filters.partial') :
                                               p.status === "PENDING" ? t('payments.filters.pending') : p.status;
                                               
                      const translatedType = p.paymentType === "MONTHLY" ? t('payments.filters.monthly') :
                                             p.paymentType === "OUTSTANDING" ? t('payments.filters.outstanding') : p.paymentType;
                                             
                      const displayStatus = isManual && p.paymentType ? `${translatedType} - ${translatedStatus}` : translatedStatus;
                      
                      let formattedDate = formatDateTime(p.createdAt);
                      if (i18n.language === 'si') {
                        const parts = formattedDate.split(" ");
                        if (parts.length === 3) {
                          const translatedAmPm = parts[2] === "AM" ? t('payments.filters.am') : t('payments.filters.pm');
                          formattedDate = `${parts[0]} ${translatedAmPm} ${parts[1]}`;
                        }
                      } else {
                        formattedDate = formattedDate
                          .replace("AM", t('payments.filters.am'))
                          .replace("PM", t('payments.filters.pm'));
                      }

                      return (
                        <tr key={p.paymentId} className="border-t border-border">
                          <td className="p-4 text-sm">{formattedDate}</td>
                          <td className="p-4 text-sm font-mono">
                            {t("payments.billPayment.currency")} {p.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-sm">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {getPaymentIcon(p.paymentMethod)}
                              {p.paymentMethod === "ONLINE" ? t('payments.filters.online') :
                               p.paymentMethod === "BANK_TRANSFER" ? t('payments.filters.bankTransfer') :
                               p.paymentMethod === "MANUAL" ? t('payments.filters.manual') :
                               formatPaymentMethod(p.paymentMethod)}
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
                  {historyStart}-{historyEnd} {t('payments.paymentHistory.of')} {historyTotalItems} {t('payments.paymentHistory.items')}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setHistoryPage(0)} disabled={historyPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;&lt;</button>
                  <button onClick={() => setHistoryPage((p) => Math.max(p - 1, 0))} disabled={historyPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;</button>
                  <div className="text-sm px-3">{t('payments.paymentHistory.page')} {historyPage + 1} {t('payments.paymentHistory.of')} {historyTotalPages}</div>
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
