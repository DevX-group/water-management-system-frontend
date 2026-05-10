import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockCustomers } from '@/data/mockData';
import { toast } from 'sonner';
import {
  addPayment, getCustomerPaymentSummary, getCurrentBill,
  getOutstandingBills, getPaymentHistory,
  type CurrentBillResponse, type OutstandingBillItemResponse, type PaymentHistoryItemResponse,
} from '@/services/paymentService';
import { MonthlyPaymentTab }    from '@/components/payments/MonthlyPaymentTab';
import { OutstandingPaymentTab } from '@/components/payments/OutstandingPaymentTab';
import { CustomerDetailCard }   from '@/components/payments/CustomerDetailCard';
import { PaymentHistoryCard }   from '@/components/payments/PaymentHistoryCard';

import type { TabKey } from '@/types/billing';

export const PaymentsAddingPage = () => {
  const navigate = useNavigate();
  const { subscriptionNo } = useParams<{ subscriptionNo: string }>();
  const customer = useMemo(() => mockCustomers.find(c => c.subscriptionNo === subscriptionNo) || null, [subscriptionNo]);

  const [activeTab, setActiveTab]           = useState<TabKey>('monthly');
  const [monthlyAmount, setMonthlyAmount]   = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItemResponse[]>([]);
  const [currentBill, setCurrentBill]       = useState<CurrentBillResponse | null>(null);
  const [outstandingBills, setOutstandingBills] = useState<OutstandingBillItemResponse[]>([]);

  const loadAll = async (sub: string) => {
    try {
      const [, bill, outs, history] = await Promise.all([
        getCustomerPaymentSummary(sub),
        getCurrentBill(sub),
        getOutstandingBills(sub),
        getPaymentHistory(sub),
      ]);
      setCurrentBill(bill);
      setOutstandingBills(outs);
      setPaymentHistory(history);
    } catch { toast.error('Failed to load payment data'); }
  };

  useEffect(() => { if (subscriptionNo) loadAll(subscriptionNo); }, [subscriptionNo]);

  const handleAddMonthly = async () => {
    if (!customer) return;
    const amount = Number(monthlyAmount);
    if (!Number.isFinite(amount) || amount <= 0) { toast.error('Enter a valid amount'); return; }
    const due = Number(currentBill?.balanceDue ?? 0);
    try {
      const res = await addPayment({ subscriptionNumber: customer.subscriptionNo, amount, status: Math.abs(amount - due) < 0.0001 ? 'FULL' : 'PARTIAL', paymentType: 'MONTHLY' });
      toast.success(res.message || 'Payment added!');
      setMonthlyAmount('');
      await loadAll(customer.subscriptionNo);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to add payment'); }
  };

  const handleAddOutstanding = async () => {
    if (!customer) return;
    const amount = Number(outstandingAmount);
    if (!Number.isFinite(amount) || amount <= 0) { toast.error('Enter a valid amount'); return; }
    const due = outstandingBills.reduce((s, b) => s + (b.balanceDue ?? 0), 0);
    try {
      const res = await addPayment({ subscriptionNumber: customer.subscriptionNo, amount, status: Math.abs(amount - due) < 0.0001 ? 'FULL' : 'PARTIAL', paymentType: 'OUTSTANDING' });
      toast.success(res.message || 'Payment added!');
      setOutstandingAmount('');
      await loadAll(customer.subscriptionNo);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to add payment'); }
  };

  if (!customer) return (
    <div className="p-6">
      <div className="bg-card rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold">Customer not found</h2>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Payment</h1>
          <p className="text-muted-foreground">{customer.name} • {subscriptionNo}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Tab panel */}
        <div className="lg:w-[65%] space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-md">
            {/* Tab header */}
            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-1 mb-6">
              {(['monthly', 'outstanding'] as TabKey[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-primary/5 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  {tab === 'monthly' ? 'Monthly Payments' : 'Outstanding Payments'}
                </button>
              ))}
            </div>

            {activeTab === 'monthly' ? (
              <MonthlyPaymentTab
                currentBill={currentBill} monthlyAmount={monthlyAmount}
                setMonthlyAmount={setMonthlyAmount} onAddPayment={handleAddMonthly}
              />
            ) : (
              <OutstandingPaymentTab
                outstandingBills={outstandingBills} outstandingAmount={outstandingAmount}
                setOutstandingAmount={setOutstandingAmount} onAddPayment={handleAddOutstanding}
              />
            )}
          </div>
        </div>

        {/* Right: customer + history */}
        <div className="lg:w-[35%] space-y-6">
          <CustomerDetailCard customer={customer} />
          <PaymentHistoryCard history={paymentHistory} />
        </div>
      </div>
    </div>
  );
};