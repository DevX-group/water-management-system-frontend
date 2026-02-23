import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Wallet, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCustomers } from '@/data/mockData';
import { toast } from 'sonner';

import {
  addPayment,
  getCustomerPaymentSummary,
  getCurrentBill,
  getOutstandingBills,
  type CurrentBillResponse,
  type OutstandingBillItemResponse,
  PaymentHistoryItemResponse,
  getPaymentHistory,
} from '@/services/paymentService';

type TabKey = 'monthly' | 'outstanding';

type UiStatus = 'paid' | 'partial' | 'overdue';

export const PaymentsAddingPage = () => {
  const navigate = useNavigate();
  const { subscriptionNo } = useParams<{ subscriptionNo: string }>();
  console.log("subscriptionNo param =", subscriptionNo);

  const customer = useMemo(() => {
    return mockCustomers.find((c) => c.subscriptionNo === subscriptionNo) || null;
  }, [subscriptionNo]);

  const [activeTab, setActiveTab] = useState<TabKey>('monthly');

  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItemResponse[]>([]);

  const [summary, setSummary] = useState<null | {
    subscriptionNumber: string;
    monthlyDue: number;
    outstandingBalance: number;
    totalDue: number;
    billStatus: string;
  }>(null);

  const [currentBill, setCurrentBill] = useState<CurrentBillResponse | null>(null);
  const [outstandingBills, setOutstandingBills] = useState<OutstandingBillItemResponse[]>([]);

  const statusStyles = {
    paid: 'bg-success/10 text-success',
    partial: 'bg-warning/10 text-warning',
    overdue: 'bg-destructive/10 text-destructive',
  } as const;

  const statusIcons = {
    paid: CheckCircle,
    partial: Clock,
    overdue: AlertCircle,
  } as const;

  const loadAll = async (subscriptionNo: string) => {
    try {
      const [sum, bill, outs, history] = await Promise.all([
        getCustomerPaymentSummary(subscriptionNo),
        getCurrentBill(subscriptionNo),
        getOutstandingBills(subscriptionNo),
        getPaymentHistory(subscriptionNo),
      ]);

      setSummary(sum);
      setCurrentBill(bill);
      setOutstandingBills(outs);
      setPaymentHistory(history);
    } catch (e) {
      toast.error('Failed to load payment data');
    }
  };

  useEffect(() => {
    if (!subscriptionNo) return;
    loadAll(subscriptionNo);
  }, [subscriptionNo]);

  const handleAddMonthly = async () => {
    if (!customer) return;

    const amount = Number(monthlyAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid amount', { className: "toast-error" });
      return;
    }

    const due = Number(monthlyDue ?? 0);

    const isFull = Math.abs(amount - due) < 0.0001;
    const status = isFull ? 'FULL' : 'PARTIAL';

    try {
      const res = await addPayment({
        subscriptionNumber: customer.subscriptionNo,
        amount,
        status,
        paymentType: 'MONTHLY',
      });

      toast.success(res.message || 'Payment added successfully!', { className: "toast-success" });
      setMonthlyAmount('');

      await loadAll(customer.subscriptionNo);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to add payment';
      toast.error(msg, { className: "toast-error" });
    }
  };

  const handleAddOutstanding = async () => {
    if (!customer) return;

    const amount = Number(outstandingAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid amount', { className: "toast-error" });
      return;
    }

    const due = Number(totalOutstanding ?? 0);

    const isFull = Math.abs(amount - due) < 0.0001;
    const status = isFull ? 'FULL' : 'PARTIAL';

    try {
      const res = await addPayment({
        subscriptionNumber: customer.subscriptionNo,
        amount,
        status,
        paymentType: 'OUTSTANDING',
      });

      toast.success(res.message || 'Payment added successfully!', { className: "toast-success" });
      setOutstandingAmount('');

      await loadAll(customer.subscriptionNo);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to add payment';
      toast.error(msg, { className: "toast-error" });
    }
  };

  if (!customer) {
    return (
      <div className="p-6">
        <div className="bg-card rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">Customer not found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            The selected customer does not exist in mock data.
          </p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Monthly tab values 
  const currentMonthLabel = currentBill?.billingPeriod
    ? currentBill.billingPeriod
    : new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const monthlyBill = currentBill?.totalAmount ?? 0;
  const monthlyDue = currentBill?.balanceDue ?? summary?.monthlyDue ?? 0;
  const alreadyPaid = Math.max(monthlyBill - monthlyDue, 0);

  const billStatus = (currentBill?.status ?? summary?.billStatus ?? '').toUpperCase();

  const monthlyStatus: UiStatus =
    monthlyDue === 0
      ? 'paid'
      : billStatus === 'OVERDUE'
        ? 'overdue'
        : alreadyPaid > 0
          ? 'partial'
          : 'overdue';

  const MonthlyIcon = statusIcons[monthlyStatus];

  //Outstanding tab values
  const totalOutstanding = outstandingBills.reduce((sum, b) => sum + (b.balanceDue ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Payment</h1>
            <p className="text-muted-foreground">
              {customer?.name ?? "Customer"} • {subscriptionNo}
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs section */}
        <div className="lg:w-[65%] space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-md">
            {/* Tabs header */}
            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'monthly'
                  ? 'bg-primary/5 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Monthly Payments
              </button>
              <button
                onClick={() => setActiveTab('outstanding')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'outstanding'
                  ? 'bg-primary/5 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Outstanding Payments
              </button>
            </div>

            {/* Tab content */}
            <div className="mt-6">
              {activeTab === 'monthly' ? (
                <div className="space-y-4">
                  {/* Monthly Summary */}
                  <div className="bg-secondary/40 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium text-foreground">Current Month Summary</h4>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[monthlyStatus]}`}
                      >
                        <MonthlyIcon className="w-3 h-3" />
                        {monthlyStatus}
                      </span>
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

                      {currentBill?.status && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Bill Status: {currentBill.status}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Add Payment Form */}
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
              ) : (
                <div className="space-y-4">
                  {/* Outstanding Summary */}
                  <div className="bg-secondary/40 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Outstanding Payment Summary</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
                        {outstandingBills.length} items
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      {outstandingBills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No outstanding bills found.</p>
                      ) : (
                        outstandingBills.slice(0, 6).map((b) => (
                          <div key={b.billId} className="flex justify-between">
                            <span className="text-muted-foreground">
                              Bill Id:{b.billId} • {b.billingPeriod}
                            </span>
                            <span className="font-medium text-foreground">
                              Rs. {Number(b.balanceDue ?? 0).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}

                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-medium text-foreground">Total Due</span>
                        <span className="text-xl font-bold text-primary">
                          Rs. {totalOutstanding.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add Payment Form */}
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
              )}
            </div>
          </div>
        </div>


        <div className="lg:w-[35%] space-y-6">
          {/* Customer Details (from mock customer) */}
          <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${customer.customerType === 'with_meter'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
                  }`}
              >
                {customer.customerType === 'with_meter' ? 'With Meter' : 'No Meter'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subscription No.</p>
                <p className="font-medium text-foreground">{customer.subscriptionNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIC</p>
                <p className="font-medium text-foreground">{customer.nic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Region</p>
                <p className="font-medium text-foreground capitalize">{customer.region}</p>
              </div>
            </div>
          </div>


          <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
              <span className="text-sm text-muted-foreground">
                {paymentHistory.length}
              </span>
            </div>

            {paymentHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments found.</p>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map((p) => (
                  <div
                    key={p.paymentId}
                    className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        Rs. {Number(p.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {p.subscriptionNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${p.status === "FULL"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                          }`}
                      >
                        {p.status.toLowerCase()}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}


          </div>

        </div>
      </div>
    </div>
  );
};