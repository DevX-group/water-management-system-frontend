import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentHistoryItemResponse } from '@/services/paymentService';
import { formatPaymentMethod } from '@/util/paymentUtils';

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
    <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">
          Payment History
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select
            value={String(historyPageSize)}
            onValueChange={(value) => {
              setHistoryPageSize(Number(value));
              setHistoryPage(0);
            }}
          >
            <SelectTrigger className="w-[65px] h-9">
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
        <p className="text-sm text-muted-foreground">No payments found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-white px-6">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left">
                  <th className="py-3 px-2 text-sm font-bold text-foreground">Date</th>
                  <th className="py-3 px-2 text-sm font-bold text-foreground">Amount</th>
                  <th className="py-3 px-2 text-sm font-bold text-foreground">Method</th>
                  <th className="py-3 px-2 w-[220px] text-sm font-bold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p) => (
                  <tr key={p.paymentId} className="border-b border-border hover:bg-primary/5 transition">
                    <td className="py-4 px-2 text-sm text-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-2 font-medium text-foreground">
                      Rs. {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-4 px-2 text-sm text-foreground">
                      {formatPaymentMethod(p.paymentMethod)}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${p.status === "FULL"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                              }`}
                          >
                            {p.paymentMethod === "MANUAL" ? `${p.paymentType}.${p.status}` : p.status}
                          </span>
                        </div>
                        {p.paymentMethod === "MANUAL" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-md hover:bg-secondary transition">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              {p.paymentId === latestManualPaymentId && (
                                <DropdownMenuItem onClick={() => handleEdit(p)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(p.paymentId)}
                                className="text-red-600 focus:text-red-600"
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                {historyStart}-{historyEnd} of {historyTotalItems} items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHistoryPage(0)}
                  disabled={historyPage === 0}
                  className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => setHistoryPage((p) => Math.max(p - 1, 0))}
                  disabled={historyPage === 0}
                  className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                >
                  {"<"}
                </button>
                <div className="text-sm px-3">
                  Page {historyPage + 1} of {totalHistoryPages}
                </div>
                <button
                  onClick={() => setHistoryPage((p) => Math.min(p + 1, totalHistoryPages - 1))}
                  disabled={historyPage === totalHistoryPages - 1}
                  className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                >
                  {">"}
                </button>
                <button
                  onClick={() => setHistoryPage(totalHistoryPages - 1)}
                  disabled={historyPage === totalHistoryPages - 1}
                  className="px-2 py-1 border rounded text-xs disabled:opacity-40"
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
