import { Pencil, Trash2, MoreVertical, History, Landmark, Receipt, HandCoins, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentHistoryItemResponse, PaymentMethod } from '@/types/payment';
import { formatPaymentMethod } from '@/utils/paymentUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { useTranslation } from 'react-i18next';

interface PaymentHistoryCardProps {
  paymentHistory: PaymentHistoryItemResponse[];
  historyPageSize: number;
  setHistoryPageSize: (val: number) => void;
  setHistoryPage: (page: number | ((prev: number) => number)) => void;
  totalHistoryPages: number;
  historyStart: number;
  historyEnd: number;
  historyTotalItems: number;
  historyPage: number;
  latestManualPaymentId?: string;
  handleEdit: (payment: PaymentHistoryItemResponse) => void;
  handleDelete: (id: string) => void;
  // Filter props
  filterYear: number | undefined;
  setFilterYear: (v: number | undefined) => void;
  filterMethod: PaymentMethod | undefined;
  setFilterMethod: (v: PaymentMethod | undefined) => void;
  onFilterChange: () => void;
}

const getPaymentIcon = (method: string) => {
  switch (method) {
    case "ONLINE": return <Landmark className="w-3.5 h-3.5" />;
    case "BANK_TRANSFER": return <Receipt className="w-3.5 h-3.5" />;
    case "MANUAL": return <HandCoins className="w-3.5 h-3.5" />;
    default: return <Receipt className="w-3.5 h-3.5" />;
  }
};

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

export const PaymentHistoryCard = ({
  paymentHistory,
  historyPageSize,
  setHistoryPageSize,
  setHistoryPage,
  totalHistoryPages,
  historyStart,
  historyEnd,
  historyTotalItems,
  historyPage,
  latestManualPaymentId,
  handleEdit,
  handleDelete,
  filterYear,
  setFilterYear,
  filterMethod,
  setFilterMethod,
  onFilterChange,
}: PaymentHistoryCardProps) => {
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
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border/40 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t('payments.paymentHistory.title')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t('payments.paymentHistory.adminSubtitle')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year filter */}
          <Select
            value={filterYear !== undefined ? String(filterYear) : 'all'}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-8 w-[110px] bg-secondary/50 border-none rounded-lg text-xs font-medium">
              <SelectValue placeholder={t('payments.filters.allYears')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('payments.filters.allYears')}</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Payment Method filter */}
          <Select
            value={filterMethod ?? 'all'}
            onValueChange={handleMethodChange}
          >
            <SelectTrigger className="h-8 w-[130px] bg-secondary/50 border-none rounded-lg text-xs font-medium">
              <SelectValue placeholder={t('payments.filters.allMethods')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('payments.filters.allMethods')}</SelectItem>
              <SelectItem value="ONLINE">{t('payments.filters.online')}</SelectItem>
              <SelectItem value="BANK_TRANSFER">{t('payments.filters.bankTransfer')}</SelectItem>
              <SelectItem value="MANUAL">{t('payments.filters.manual')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border/50"
            >
              <X className="w-3 h-3" />
              {t('payments.filters.clear')}
            </button>
          )}

          {/* Page size */}
          <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-xl">
            <span className="text-xs text-muted-foreground pl-2 pr-1 font-medium">{t('payments.paymentHistory.show')}</span>
            <Select
              value={String(historyPageSize)}
              onValueChange={(value) => {
                setHistoryPageSize(Number(value));
                setHistoryPage(0);
              }}
            >
              <SelectTrigger className="w-[65px] h-8 bg-background border-none rounded-lg shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-0 w-[70px]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {paymentHistory.length === 0 ? (
        <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border/50">
          <p className="text-sm text-muted-foreground">{t('payments.paymentHistory.noPaymentsForCustomer')}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border/60 bg-background">
            <table className="w-full table-fixed">
              <thead className="bg-secondary/40">
                <tr className="text-left">
                  <th className="py-3 px-4 text-sm font-bold text-foreground">{t('payments.paymentHistory.date')}</th>
                  <th className="py-3 px-4 text-sm font-bold text-foreground">{t('payments.paymentHistory.amount')}</th>
                  <th className="py-3 px-4 text-sm font-bold text-foreground">{t('payments.paymentHistory.method')}</th>
                  <th className="py-3 px-4 w-[220px] text-sm font-bold text-foreground">{t('payments.paymentHistory.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paymentHistory.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-sm font-medium text-foreground">
                      {(() => {
                        const dt = formatDateTime(p.createdAt);
                        if (dt === "-") return dt;
                        const [datePart, timePart, ampmPart] = dt.split(' ');
                        const translatedAmPm = ampmPart === 'AM' ? t('payments.filters.am') : t('payments.filters.pm');
                        return (
                          <>
                            {datePart}
                            <span className="text-xs text-muted-foreground block font-normal mt-0.5">
                              {i18n.language === 'si' ? `${translatedAmPm} ${timePart}` : `${timePart} ${translatedAmPm}`}
                            </span>
                          </>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      Rs. {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground border border-border/50">
                        {getPaymentIcon(p.paymentMethod)}
                        {p.paymentMethod === 'ONLINE' ? t('payments.filters.online') :
                         p.paymentMethod === 'BANK_TRANSFER' ? t('payments.filters.bankTransfer') :
                         t('payments.filters.manual')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === "FULL"
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                            }`}
                        >
                          {p.paymentMethod === "MANUAL" && p.paymentType
                            ? `${t(`payments.filters.${p.paymentType.toLowerCase()}`, { defaultValue: p.paymentType })}.${t(`payments.filters.${p.status.toLowerCase()}`, { defaultValue: p.status })}` 
                            : t(`payments.filters.${p.status.toLowerCase()}`, { defaultValue: p.status })}
                        </span>
                        {p.paymentMethod === "MANUAL" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36 rounded-xl">
                              {p.paymentId === latestManualPaymentId && (
                                <DropdownMenuItem onClick={() => handleEdit(p)} className="cursor-pointer">
                                  <Pencil className="w-4 h-4 mr-2" />
                                  {t('payments.adminPayments.edit')}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(p.paymentId)}
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('payments.adminPayments.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalHistoryPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5">
              <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                {t('payments.paymentHistory.showing')} <span className="text-foreground">{historyStart}-{historyEnd}</span> {t('payments.paymentHistory.of')} <span className="text-foreground">{historyTotalItems}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setHistoryPage(0)}
                  disabled={historyPage === 0}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => setHistoryPage((p) => Math.max(p - 1, 0))}
                  disabled={historyPage === 0}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  {"<"}
                </button>
                <div className="text-xs font-medium text-foreground px-3 py-1 bg-secondary/40 rounded-lg border border-border/50">
                  {t('payments.paymentHistory.page')} {historyPage + 1} {t('payments.paymentHistory.of')} {totalHistoryPages}
                </div>
                <button
                  onClick={() => setHistoryPage((p) => Math.min(p + 1, totalHistoryPages - 1))}
                  disabled={historyPage === totalHistoryPages - 1}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  {">"}
                </button>
                <button
                  onClick={() => setHistoryPage(totalHistoryPages - 1)}
                  disabled={historyPage === totalHistoryPages - 1}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  {">>"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
