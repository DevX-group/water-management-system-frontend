import '@/index.css';
import { CalendarDays, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MonthlyPaymentTabProps {
  currentMonthLabel: string;
  monthlyBill: number;
  alreadyPaid: number;
  monthlyDue: number;
  currentBillStatus?: string;
  monthlyAmount: string;
  setMonthlyAmount: (val: string) => void;
  handleAddMonthly: () => void;
}

export const MonthlyPaymentTab = ({
  currentMonthLabel,
  monthlyBill,
  alreadyPaid,
  monthlyDue,
  currentBillStatus,
  monthlyAmount,
  setMonthlyAmount,
  handleAddMonthly,
}: MonthlyPaymentTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-secondary/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium text-foreground">Current Month Summary</h4>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Month</span>
            <span className="font-medium text-foreground">{currentMonthLabel}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Bill</span>
            <span className="font-medium text-foreground">
              Rs. {monthlyBill.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Already Paid</span>
            <span className="font-medium text-success">
              Rs. {alreadyPaid.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-medium text-foreground">Total Due</span>
            <span className="text-xl font-bold text-primary">
              Rs. {monthlyDue.toLocaleString()}
            </span>
          </div>

          {currentBillStatus && (
            <p className="text-xs text-muted-foreground mt-2">
              Bill Status: {currentBillStatus}
            </p>
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
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
          />
          <Button className="sm:w-[180px]" onClick={handleAddMonthly}>
            Add Payment
          </Button>
        </div>
      </div>
    </div>
  );
};
