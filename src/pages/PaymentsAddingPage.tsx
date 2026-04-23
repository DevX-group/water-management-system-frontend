import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Wallet, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  getPaymentCustomerInfo,
  type PaymentCustomerInfoResponse,
  updatePayment,
} from '@/services/paymentService';
import { Label } from 'recharts';
import { motion } from 'framer-motion';

type TabKey = 'monthly' | 'outstanding';

type UiStatus = 'paid' | 'partial' | 'overdue';

export const PaymentsAddingPage = () => {
  const navigate = useNavigate();
  const { subscriptionNumber } = useParams<{ subscriptionNumber: string }>();
  console.log("subscriptionNumber param =", subscriptionNumber);

  const [activeTab, setActiveTab] = useState<TabKey>('monthly');

  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItemResponse[]>([]);
  const [customerInfo, setCustomerInfo] = useState<PaymentCustomerInfoResponse | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [updatedAmount, setUpdatedAmount] = useState("");

  const [amountError, setAmountError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const [outstandingPage, setOutstandingPage] = useState(1);
  const billsPerPage = 6;

  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 6;



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

  const loadAll = async (subscriptionNumber: string) => {
    try {
      const [sum, bill, outs, history, customerInfo] = await Promise.all([
        getCustomerPaymentSummary(subscriptionNumber),
        getCurrentBill(subscriptionNumber),
        getOutstandingBills(subscriptionNumber),
        getPaymentHistory(subscriptionNumber),
        getPaymentCustomerInfo(subscriptionNumber),
      ]);

      setSummary(sum);
      setCurrentBill(bill);
      setOutstandingBills(outs);
      setPaymentHistory(history);
      setCustomerInfo(customerInfo);

    } catch (e) {
      toast.error('Failed to load payment data');
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setUpdatedAmount(payment.amount.toString());
    setIsEditOpen(true);
  }

  const handleUpdate = async () => {
    setIsTouched(true);
    if (!updatedAmount) return;

    validateAmount(updatedAmount);

    if (amountError) return;

    try {
      await updatePayment(
        selectedPayment.paymentId,
        Number(updatedAmount)
      );

      // Fetch fresh data
      const payments = await getPaymentHistory(subscriptionNumber);
      setPaymentHistory(payments);

      const summaryData = await getCustomerPaymentSummary(subscriptionNumber);
      setSummary(summaryData);

      const current = await getCurrentBill(subscriptionNumber);
      setCurrentBill(current);

      const outstanding = await getOutstandingBills(subscriptionNumber);
      setOutstandingBills(outstanding);

      // Reset UI
      setIsEditOpen(false);
      setSelectedPayment(null);
      setUpdatedAmount("");

    } catch (error: any) {
      const responseMessage = error?.response?.data?.message;

      if (responseMessage) {
        setAmountError(responseMessage);
      } else {
        setAmountError("Something went wrong");
      }
    }
  };

  const handleCancel = () => {
    setIsEditOpen(false);
    setSelectedPayment(null);

    setUpdatedAmount("");
    setAmountError("");
    setIsTouched(false);
  };

  const handleDelete = (paymentId) => {
    console.log("Delete:", paymentId);
  };

  const validateAmount = (value) => {
    const num = Number(value);

    if (!value) {
      setAmountError("Amount is required");
    } else if (num <= 0) {
      setAmountError("Enter a valid amount");
    } else if (
      summary &&
      selectedPayment &&
      num > (summary.totalDue + selectedPayment.amount)
    ) {
      setAmountError("Amount exceeds due balance");
    } else {
      setAmountError("");
    }
  };

  const handleAmountChange = (value) => {
    setUpdatedAmount(value);

    setAmountError("");

    if (isTouched) {
      validateAmount(value);
    }
  };

  useEffect(() => {
    if (!subscriptionNumber) return;
    loadAll(subscriptionNumber);
  }, [subscriptionNumber]);

  const handleAddMonthly = async () => {
    if (!customerInfo) return;

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
        subscriptionNumber: customerInfo.subscriptionNumber,
        amount,
        status,
        paymentType: 'MONTHLY',
      });

      toast.success(res.message || 'Payment added successfully!', { className: "toast-success" });
      setMonthlyAmount('');

      await loadAll(customerInfo.subscriptionNumber);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to add payment';
      toast.error(msg, { className: "toast-error" });
    }
  };

  const handleAddOutstanding = async () => {
    if (!customerInfo) return;

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
        subscriptionNumber: customerInfo.subscriptionNumber,
        amount,
        status,
        paymentType: 'OUTSTANDING',
      });

      toast.success(res.message || 'Payment added successfully!', { className: "toast-success" });
      setOutstandingAmount('');

      await loadAll(customerInfo.subscriptionNumber);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to add payment';
      toast.error(msg, { className: "toast-error" });
    }
  };

  if (!customerInfo) {
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

  const indexOfLastBill = outstandingPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = outstandingBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(outstandingBills.length / billsPerPage);

  const indexOfLastHistory = historyPage * historyPerPage;
  const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
  const currentHistory = paymentHistory.slice(indexOfFirstHistory, indexOfLastHistory);
  const totalHistoryPages = Math.ceil(paymentHistory.length / historyPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Payment</h1>
            <p className="text-muted-foreground">
              {customerInfo?.accountHolderName ?? "Customer"} • {customerInfo?.subscriptionNumber}
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
                        <p className="text-sm text-muted-foreground">
                          No outstanding bills found.
                        </p>
                      ) : (
                        <>
                          {currentBills.slice(0, 6).map((b) => (
                            <div key={b.billId} className="space-y-1 text-sm">

                              {/* Bill header */}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Bill Id: {b.billId} • {b.billingPeriod}
                                </span>
                              </div>

                              {/* Total Bill */}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Bill</span>
                                <span className="font-medium text-foreground">
                                  Rs. {Number(b.totalAmount ?? 0).toLocaleString()}
                                </span>
                              </div>

                              {/* Already Paid */}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Already Paid</span>
                                <span className="font-medium text-success">
                                  Rs. {Number(b.paidAmount ?? 0).toLocaleString()}
                                </span>
                              </div>

                              {/* Balance Due */}
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
                              {/* Previous button */}
                              <button
                                onClick={() => setOutstandingPage(prev => Math.max(prev - 1, 1))}
                                disabled={outstandingPage === 1}
                                className="px-2 py-1 border rounded"
                              >
                                &lt;
                              </button>

                              {/* Page numbers */}
                              {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setOutstandingPage(i + 1)}
                                  className={`px-3 py-1 border rounded ${outstandingPage === i + 1 ? 'bg-primary text-white' : ''}`}
                                >
                                  {i + 1}
                                </button>
                              ))}

                              {/* Next button */}
                              <button
                                onClick={() => setOutstandingPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={outstandingPage === totalPages}
                                className="px-2 py-1 border rounded"
                              >
                                &gt;
                              </button>
                            </div>
                          )}

                          {/* Total */}
                          <div className="flex justify-between pt-2 border-t border-none">
                            <span className="font-medium text-foreground">Total Due</span>
                            <span className="text-xl font-bold text-primary">
                              Rs. {totalOutstanding.toLocaleString()}
                            </span>
                          </div>
                        </>
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
          {/* Customer Details */}
          <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
              {/*<span
                className={`px-3 py-1 rounded-full text-xs font-medium ${paymentCustomerInfo.customerType === 'with_meter'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
                  }`}
              >
                {customer.customerType === 'with_meter' ? 'With Meter' : 'No Meter'}
              </span>*/}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{customerInfo?.accountHolderName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subscription No.</p>
                <p className="font-medium text-foreground">{customerInfo?.subscriptionNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIC</p>
                <p className="font-medium text-foreground">{customerInfo?.nic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Region</p>
                <p className="font-medium text-foreground capitalize">{customerInfo?.region}</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Payment History
              </h3>
            </div>

            {paymentHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payments found.
              </p>
            ) : (
              <div className="space-y-3">
                {currentHistory.map((p) => (
                  <div
                    key={p.paymentId}
                    className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Row 1: Icons */}
                    <div className="flex justify-end mb-1">
                      <div className="flex gap-2">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-gray-500 transition"
                          onClick={() => handleEdit(p)}
                        />
                        <Trash2
                          className="w-4 h-4 cursor-pointer hover:text-gray-500 transition"
                          onClick={() => handleDelete(p.paymentId)}
                        />
                      </div>
                    </div>

                    {/* Row 2: Amount + Status */}
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-foreground">
                        Rs. {Number(p.amount).toLocaleString()}
                      </p>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${p.status === "FULL"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                          }`}
                      >
                        {p.status.toLowerCase()}
                      </span>
                    </div>

                    {/* Row 3: Subscription + Date */}
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground">
                        {p.subscriptionNumber}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-3">
                    {/* Previous button */}
                    <button
                      onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                      disabled={historyPage === 1}
                      className="px-2 py-1 border rounded"
                    >
                      &lt;
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalHistoryPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setHistoryPage(i + 1)}
                        className={`px-3 py-1 border rounded ${historyPage === i + 1 ? 'bg-primary text-white' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    {/* Next button */}
                    <button
                      onClick={() => setHistoryPage(prev => Math.min(prev + 1, totalHistoryPages))}
                      disabled={historyPage === totalHistoryPages}
                      className="px-2 py-1 border rounded"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>

            )}
          </div>

        </div>
      </div>

      {isEditOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setIsEditOpen(false)} // close on outside click
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">
              Edit Payment
            </h2>

            {/* Amount Input */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground">
                Amount
              </Label>
              <Input
                type="number"
                value={updatedAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter amount"
              />

              {isTouched && amountError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 backdrop-blur-sm mt-2"
                >
                  <span>⚠️ {amountError}</span>
                </motion.div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 sm:w-[120px] bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                className="px-4 sm:w-[120px] flex-1"
                onClick={handleUpdate}
                disabled={!updatedAmount || !!amountError}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>


  );
};