import '@/index.css';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OutstandingBillResponse } from '@/services/paymentService';

interface OutstandingPaymentTabProps {
  outstandingBills: OutstandingBillResponse[];
  currentBills: OutstandingBillResponse[];
  totalPages: number;
  outstandingPage: number;
  setOutstandingPage: (page: number | ((prev: number) => number)) => void;
  totalOutstandingAmount: number;
  outstandingAmount: string;
  setOutstandingAmount: (val: string) => void;
  handleAddOutstanding: () => void;
}

export const OutstandingPaymentTab = ({
  outstandingBills,
  currentBills,
  totalPages,
  outstandingPage,
  setOutstandingPage,
  totalOutstandingAmount,
  outstandingAmount,
  setOutstandingAmount,
  handleAddOutstanding,
}: OutstandingPaymentTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Outstanding Payment Summary</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
            {outstandingBills.length} items
          </span>
        </div>

        <div className="mt-3 space-y-2 text-sm">
          {outstandingBills.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No outstanding bills found.
            </p>
          ) : (
            <>
              {currentBills.slice(0, 6).map((b) => (
                <div key={b.billId} className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Bill Id: {b.billId} • {b.billingPeriod}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Bill</span>
                    <span className="font-medium text-foreground">
                      Rs. {Number(b.totalAmount ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Already Paid</span>
                    <span className="font-medium text-success">
                      Rs. {Number(b.paidAmount ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Balance Due</span>
                    <span className="font-bold text-primary">
                      Rs. {Number(b.balanceDue ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <hr className="border-border mt-1" />
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-3">
                  <button
                    onClick={() => setOutstandingPage((prev) => Math.max(prev - 1, 1))}
                    disabled={outstandingPage === 1}
                    className="px-2 py-1 border rounded"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setOutstandingPage(i + 1)}
                      className={`px-3 py-1 border rounded ${outstandingPage === i + 1 ? 'bg-primary text-white' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setOutstandingPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={outstandingPage === totalPages}
                    className="px-2 py-1 border rounded"
                  >
                    &gt;
                  </button>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-none">
                <span className="font-medium text-foreground">Total Due</span>
                <span className="text-xl font-bold text-primary">
                  Rs. {totalOutstandingAmount.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-foreground">Add Payment</h4>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Payment amount"
            value={outstandingAmount}
            onChange={(e) => setOutstandingAmount(e.target.value)}
          />
          <Button className="sm:w-[180px]" onClick={handleAddOutstanding}>
            Add Payment
          </Button>
        </div>
      </div>
    </div>
  );
};
