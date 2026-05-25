import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import {
  addPayment,
  getCustomerPaymentSummary,
  getCurrentBill,
  getPaymentHistory,
  getPaymentCustomerInfo,
  updatePayment,
  getOutstandingBillsSummary,
  deletePayment,
} from '@/services/paymentService';

import type {
  CurrentBillResponse,
  PaymentHistoryItemResponse,
  PaymentCustomerInfoResponse,
  OutstandingBillResponse,
  OutstandingBillsSummaryResponse,
  CustomerPaymentSummaryResponse,
  PaymentMethod,
} from '@/types/payment';

import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

import { CustomerDetailCard } from '@/components/payments/CustomerDetailCard';
import { MonthlyPaymentTab } from '@/components/payments/MonthlyPaymentTab';
import { OutstandingPaymentTab } from '@/components/payments/OutstandingPaymentTab';
import { PaymentHistoryCard } from '@/components/payments/PaymentHistoryCard';

type TabKey = 'monthly' | 'outstanding';

export const PaymentsAddingPage = () => {
  const navigate = useNavigate();
  const { subscriptionNumber } = useParams<{ subscriptionNumber: string }>();

  const [activeTab, setActiveTab] = useState<TabKey>('monthly');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItemResponse[]>([]);
  const [customerInfo, setCustomerInfo] = useState<PaymentCustomerInfoResponse | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItemResponse | null>(null);
  const [updatedAmount, setUpdatedAmount] = useState("");

  const [amountError, setAmountError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const [outstandingPage, setOutstandingPage] = useState(1);
  const billsPerPage = 6;

  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(5);

  const [totalHistoryPages, setTotalHistoryPages] = useState(1);
  const [historyTotalItems, setHistoryTotalItems] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const [summary, setSummary] = useState<null | CustomerPaymentSummaryResponse>(null);

  const [currentBill, setCurrentBill] = useState<CurrentBillResponse | null>(null);
  const [outstandingBillsSummary, setOutstandingBillsSummary] = useState<OutstandingBillsSummaryResponse | null>(null);
  const [outstandingBills, setOutstandingBills] = useState<OutstandingBillResponse[]>([]);

  const [historyFilterYear, setHistoryFilterYear] = useState<number | undefined>(undefined);
  const [historyFilterMethod, setHistoryFilterMethod] = useState<PaymentMethod | undefined>(undefined);

  const loadAll = async (subscriptionNumber: string) => {
    try {
      const [sum, bill, outs, customerInfo] = await Promise.all([
        getCustomerPaymentSummary(subscriptionNumber),
        getCurrentBill(subscriptionNumber),
        getOutstandingBillsSummary(subscriptionNumber),
        getPaymentCustomerInfo(subscriptionNumber),
      ]);

      setSummary(sum);
      setCurrentBill(bill);
      setOutstandingBills(outs.outstandingBills);
      setOutstandingBillsSummary(outs);
      setCustomerInfo(customerInfo);

    } catch (e) {
      console.error("loadAll failed:", e);
      toast.error('Failed to load payment data');
    }
  };

  const loadHistory = async () => {
    if (!subscriptionNumber) return;

    const history = await getPaymentHistory(
      subscriptionNumber,
      historyPage,
      historyPageSize,
      historyFilterYear,
      historyFilterMethod
    );

    setPaymentHistory(history.content ?? []);
    setTotalHistoryPages(history.totalPages ?? 1);
    setHistoryTotalItems(history.totalElements ?? 0);
  };

  const handleEdit = (payment: PaymentHistoryItemResponse) => {
    setSelectedPayment(payment);
    setUpdatedAmount(payment.amount.toString());
    setIsEditOpen(true);
  }

  const handleUpdate = async () => {
    if (!subscriptionNumber) return;
    setIsTouched(true);
    if (!updatedAmount || !selectedPayment) return;

    validateAmount(updatedAmount);

    if (amountError) return;

    try {
      await updatePayment(
        selectedPayment.paymentId,
        Number(updatedAmount)
      );

      // Fetch fresh data
      const history = await getPaymentHistory(
        subscriptionNumber,
        historyPage,
        historyPageSize
      );

      setPaymentHistory(history.content ?? []);
      setTotalHistoryPages(history.totalPages ?? 1);
      setHistoryTotalItems(history.totalElements ?? 0);

      const summaryData = await getCustomerPaymentSummary(subscriptionNumber);
      setSummary(summaryData);

      const current = await getCurrentBill(subscriptionNumber);
      setCurrentBill(current);

      const outstanding = await getOutstandingBillsSummary(subscriptionNumber);
      setOutstandingBillsSummary(outstanding);
      setOutstandingBills(outstanding.outstandingBills);

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

  const handleDelete = (paymentId: string) => {
    setSelectedDeleteId(paymentId);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId || !subscriptionNumber) return;

    try {
      await deletePayment(selectedDeleteId);

      toast.success("Payment deleted successfully");

      setIsDeleteOpen(false);
      setSelectedDeleteId(null);

      await loadAll(subscriptionNumber);
      await loadHistory();

    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Failed to delete payment";

      toast.error(msg);
    }
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setSelectedDeleteId(null);
  };

  const validateAmount = (value: string) => {
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

  const handleAmountChange = (value: string) => {
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

  useEffect(() => {
    loadHistory();
  }, [historyPage, historyPageSize, subscriptionNumber, historyFilterYear, historyFilterMethod]);

  const handleHistoryFilterChange = () => {
    setHistoryPage(0);
  };

  const handleAddMonthly = async () => {
    if (!customerInfo) return;

    const amount = Number(monthlyAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid amount', { className: "toast-error" });
      return;
    }

    try {
      const res = await addPayment({
        subscriptionNumber: customerInfo.subscriptionNumber,
        amount,
        paymentType: 'MONTHLY',
        paymentMethod: 'MANUAL'
      });

      toast.success(res.message || 'Payment added successfully!', { className: "toast-success" });
      setMonthlyAmount('');

      await loadAll(customerInfo.subscriptionNumber);
      await loadHistory();
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

    try {
      const res = await addPayment({
        subscriptionNumber: customerInfo.subscriptionNumber,
        amount,
        paymentType: 'OUTSTANDING',
        paymentMethod: 'MANUAL'
      });

      toast.success(res.message || 'Payment added successfully!', { className: "toast-success" });
      setOutstandingAmount('');

      await loadAll(customerInfo.subscriptionNumber);
      await loadHistory();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to add payment';
      toast.error(msg, { className: "toast-error" });
    }
  };

  const historyStart =
    paymentHistory.length === 0
      ? 0
      : historyPage * historyPageSize + 1;

  const historyEnd = Math.min(
    (historyPage + 1) * historyPageSize,
    historyTotalItems
  );

  if (!customerInfo) {
    return (
      <div className="p-6">
        <div className="bg-card rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">Customer not found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            The selected customer does not exist.
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
  const alreadyPaid = currentBill?.alreadyPaid ?? 0;

  const indexOfLastBill = outstandingPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = outstandingBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(outstandingBills.length / billsPerPage);

  const latestManualPaymentId = paymentHistory.find((p) => p.paymentMethod === "MANUAL")?.paymentId;

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
        {/* Left: Tab panel */}
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
                <MonthlyPaymentTab
                  currentMonthLabel={currentMonthLabel}
                  monthlyBill={monthlyBill}
                  alreadyPaid={alreadyPaid}
                  monthlyDue={monthlyDue}
                  currentBillStatus={currentBill?.status}
                  monthlyAmount={monthlyAmount}
                  setMonthlyAmount={setMonthlyAmount}
                  handleAddMonthly={handleAddMonthly}
                />
              ) : (
                <OutstandingPaymentTab
                  outstandingBills={outstandingBills}
                  currentBills={currentBills}
                  totalPages={totalPages}
                  outstandingPage={outstandingPage}
                  setOutstandingPage={setOutstandingPage}
                  totalOutstandingAmount={outstandingBillsSummary?.totalOutstandingAmount ?? 0}
                  outstandingAmount={outstandingAmount}
                  setOutstandingAmount={setOutstandingAmount}
                  handleAddOutstanding={handleAddOutstanding}
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-[35%]">
          <CustomerDetailCard customerInfo={customerInfo} />
        </div>
      </div>

      <PaymentHistoryCard
        paymentHistory={paymentHistory}
        historyPageSize={historyPageSize}
        setHistoryPageSize={setHistoryPageSize}
        setHistoryPage={setHistoryPage}
        totalHistoryPages={totalHistoryPages}
        historyStart={historyStart}
        historyEnd={historyEnd}
        historyTotalItems={historyTotalItems}
        historyPage={historyPage}
        latestManualPaymentId={latestManualPaymentId}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        filterYear={historyFilterYear}
        setFilterYear={setHistoryFilterYear}
        filterMethod={historyFilterMethod}
        setFilterMethod={setHistoryFilterMethod}
        onFilterChange={handleHistoryFilterChange}
      />

      {isEditOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 w-[350px] shadow-xl border border-border/40 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-1">
              Edit Payment
            </h2>
            <p className="text-xs text-muted-foreground mb-5">Update the manual payment amount.</p>

            <div className="mb-6">
              <Label className="text-sm font-medium text-foreground mb-1.5 block">
                Amount (Rs.)
              </Label>
              <Input
                type="number"
                value={updatedAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full text-foreground border-border/50 rounded-xl focus-visible:ring-primary/20 bg-background"
                placeholder="Enter amount"
              />

              {isTouched && amountError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mt-2"
                >
                  <span className="mt-0.5">⚠️</span>
                  <span>{amountError}</span>
                </motion.div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 rounded-xl"
                onClick={handleUpdate}
                disabled={!updatedAmount || !!amountError}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200"
          onClick={cancelDelete}
        >
          <div
            className="bg-card rounded-2xl p-6 w-[350px] shadow-xl border border-border/40 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-1">
              Delete Payment
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this payment? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={cancelDelete}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};