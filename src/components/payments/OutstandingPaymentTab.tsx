import '@/index.css';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OutstandingBillResponse } from '@/types/payment';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('payments');
  return (
    <div className="space-y-4">
      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">{t('payments.outstandingTab.title')}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
            {outstandingBills.length} {t('payments.outstandingTab.items')}
          </span>
        </div>

        <div className="mt-3 space-y-2 text-sm">
          {outstandingBills.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('payments.outstandingTab.noOutstandingBills')}
            </p>
          ) : (
            <>
              {currentBills.slice(0, 6).map((b) => (
                <div key={b.billId} className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('payments.outstandingTab.billId')} {b.billId} • {b.billingPeriod}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('payments.outstandingTab.totalBill')}</span>
                    <span className="font-medium text-foreground">
                      {t('payments.billPayment.currency')} {Number(b.totalAmount ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('payments.outstandingTab.alreadyPaid')}</span>
                    <span className="font-medium text-success">
                      {t('payments.billPayment.currency')} {Number(b.paidAmount ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">{t('payments.outstandingTab.balanceDue')}</span>
                    <span className="font-bold text-primary">
                      {t('payments.billPayment.currency')} {Number(b.balanceDue ?? 0).toLocaleString()}
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
                <span className="font-medium text-foreground">{t('payments.outstandingTab.totalDue')}</span>
                <span className="text-xl font-bold text-primary">
                  {t('payments.billPayment.currency')} {totalOutstandingAmount.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-foreground">{t('payments.outstandingTab.addPayment')}</h4>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder={t('payments.outstandingTab.paymentAmount')}
            value={outstandingAmount}
            onChange={(e) => setOutstandingAmount(e.target.value)}
          />
          <Button className="sm:w-[180px]" onClick={handleAddOutstanding}>
            {t('payments.outstandingTab.addPayment')}
          </Button>
        </div>
      </div>
    </div>
  );
};
