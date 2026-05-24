import { Pencil, Trash2, MoreVertical, History, Landmark, Receipt, HandCoins } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentHistoryItemResponse } from '@/types/payment';
import { formatPaymentMethod } from '@/utils/paymentUtils';
import { formatDateTime } from '@/utils/dateUtils';

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
}

const getPaymentIcon = (method: string) => {
  switch (method) {
    case "ONLINE": return <Landmark className="w-3.5 h-3.5" />;
    case "BANK_TRANSFER": return <Receipt className="w-3.5 h-3.5" />;
    case "MANUAL": return <HandCoins className="w-3.5 h-3.5" />;
    default: return <Receipt className="w-3.5 h-3.5" />;
  }
};

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
  handleDelete
}: PaymentHistoryCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border/40 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Payment History
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Recent transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
          <span className="text-xs text-muted-foreground pl-3 pr-1 font-medium">Show</span>
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

      {paymentHistory.length === 0 ? (
        <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border/50">
          <p className="text-sm text-muted-foreground">No payments found for this customer.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border/60 bg-background">
            <table className="w-full table-fixed">
              <thead className="bg-secondary/40">
                <tr className="text-left">
                  <th className="py-3 px-4 text-sm font-bold text-foreground">Date</th>
                  <th className="py-3 px-4 text-sm font-bold text-foreground">Amount</th>
                  <th className="py-3 px-4 text-sm font-bold text-foreground">Method</th>
                  <th className="py-3 px-4 w-[220px] text-sm font-bold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paymentHistory.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-sm font-medium text-foreground">
                      {formatDateTime(p.createdAt).split(' ')[0]}
                      <span className="text-xs text-muted-foreground block font-normal mt-0.5">
                        {formatDateTime(p.createdAt).split(' ').slice(1).join(' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      Rs. {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground border border-border/50">
                        {getPaymentIcon(p.paymentMethod)}
                        {formatPaymentMethod(p.paymentMethod)}
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
                          {p.paymentMethod === "MANUAL" ? `${p.paymentType}.${p.status}` : p.status}
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
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(p.paymentId)}
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
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
                Showing <span className="text-foreground">{historyStart}-{historyEnd}</span> of <span className="text-foreground">{historyTotalItems}</span>
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
                  Page {historyPage + 1} of {totalHistoryPages}
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
