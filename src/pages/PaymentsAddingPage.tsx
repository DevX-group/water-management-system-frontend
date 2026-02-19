import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Wallet, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCustomers, mockPayments, mockInvoices } from '@/data/mockData';
import { toast } from 'sonner';

type TabKey = 'monthly' | 'outstanding';

export const PaymentsAddingPage = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();

  const customer = useMemo(() => {
    return mockCustomers.find((c) => c.id === customerId) || null;
  }, [customerId]);

  const paymentHistory = useMemo(() => {
    if (!customer) return [];
    return mockPayments
      .filter((p) => p.subscriptionNo === customer.subscriptionNo)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [customer]);

  const outstandingItems = useMemo(() => {
    if (!customer) return [];
    return mockInvoices
      .filter((inv) => inv.customerName === customer.name && inv.status !== 'paid')
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [customer]);

  const totalOutstanding = useMemo(() => {
    return outstandingItems.reduce((sum, inv) => sum + (inv.overdueAmount || inv.amount), 0);
  }, [outstandingItems]);

  const [activeTab, setActiveTab] = useState<TabKey>('monthly');

  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');

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

  const currentMonthLabel = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  
  const monthlyBill = 1850;
  const alreadyPaid = 500;
  const monthlyDue = Math.max(monthlyBill - alreadyPaid, 0);
  const monthlyStatus: 'paid' | 'partial' | 'overdue' =
    monthlyDue === 0 ? 'paid' : alreadyPaid > 0 ? 'partial' : 'overdue';

  const MonthlyIcon = statusIcons[monthlyStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Payment</h1>
            <p className="text-muted-foreground">
              {customer.name} • {customer.subscriptionNo}
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
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'monthly'
                    ? 'bg-primary/5 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly Payments
              </button>
              <button
                onClick={() => setActiveTab('outstanding')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'outstanding'
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
                        <span className="font-medium text-foreground">Rs. {monthlyBill.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Already Paid</span>
                        <span className="font-medium text-success">Rs. {alreadyPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-medium text-foreground">Total Due</span>
                        <span className="text-xl font-bold text-primary">Rs. {monthlyDue.toLocaleString()}</span>
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
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(e.target.value)}
                      />
                      <Button
                        className="sm:w-[180px]"
                        onClick={() => {
                          toast.success('Payment added successfully!', {
                            style: {
                              background: '#0f766e',
                              color: '#ffffff',
                              border: '1px solid #0d9488',
                            },
                          });
                          setMonthlyAmount('');
                        }}
                      >
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
                        {outstandingItems.length} items
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      {outstandingItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No outstanding invoices found.</p>
                      ) : (
                        outstandingItems.slice(0, 6).map((inv) => (
                          <div key={inv.id} className="flex justify-between">
                            <span className="text-muted-foreground">{inv.id}</span>
                            <span className="font-medium text-foreground">
                              Rs. {(inv.overdueAmount || inv.amount).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}

                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-medium text-foreground">Total Due</span>
                        <span className="text-xl font-bold text-primary">Rs. {totalOutstanding.toLocaleString()}</span>
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
                      <Button
                        className="sm:w-[180px]"
                        onClick={() => {
                          toast.success('Payment added successfully!', {
                            style: {
                              background: '#0f766e',
                              color: '#ffffff',
                              border: '1px solid #0d9488',
                            },
                          });
                          setOutstandingAmount('');
                        }}
                      >
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
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  customer.customerType === 'with_meter' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
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

          {/* Payment History */}
          <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50 text-foreground">
                {paymentHistory.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-auto pr-1">
              {paymentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment history available.</p>
              ) : (
                paymentHistory.map((p) => {
                  const Icon = statusIcons[p.status];
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-foreground text-sm">Rs. {p.amount.toLocaleString()}</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[p.status]}`}
                        >
                          <Icon className="w-3 h-3" />
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{p.subscriptionNo}</span>
                        <span>{p.date}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">History is shown newest first.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
