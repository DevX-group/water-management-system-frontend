import React, { useMemo, useState } from 'react';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPayments, mockCustomers, mockBankSlips } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export const PaymentsPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.subscriptionNo.toLowerCase().includes(q) ||
        c.nic.includes(searchQuery.trim())
    );
  }, [searchQuery]);

  const handleCustomerSelect = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
    setSearchQuery('');
  };

  const statusStyles = {
    paid: 'bg-success/10 text-success',
    partial: 'bg-warning/10 text-warning',
    pending: 'bg-muted text-muted-foreground',
    overdue: 'bg-destructive/10 text-destructive',
  } as const;

  const statusIcons = {
    paid: CheckCircle,
    partial: Clock,
    pending: Clock,
    overdue: AlertCircle,
  } as const;

  const handleReviewSlip = (slipId: string) => {
    navigate(`/payments/slips/${slipId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Manage customer payments and collections</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Search (top) + Recently Added (bottom) */}
        <div className="lg:w-[40%] space-y-6">
          {/* Search (UNCHANGED) */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Find Customer</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter NIC / Subscription Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && filteredCustomers.length > 0 && (
              <div className="mt-2 border border-border rounded-lg overflow-hidden">
                {filteredCustomers.slice(0, 5).map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleCustomerSelect(customer)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-0"
                  >
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.subscriptionNo} • {customer.region}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Details*/}
          {selectedCustomer && (
            <div className="bg-card rounded-2xl p-6 shadow-md animate-scale-in">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Customer Details
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCustomer.customerType === 'with_meter'
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                    }`}
                >
                  {selectedCustomer.customerType === 'with_meter'
                    ? 'With Meter'
                    : 'No Meter'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Subscription No.
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.subscriptionNo}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">NIC</p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.nic}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.region}
                  </p>
                </div>

              </div>

              {/* Navigate to full payment page */}
              <Button className="w-full" onClick={() => navigate(`/admin/payments/customer/${selectedCustomer.id}`)}>
                Add Payment
              </Button>
            </div>
          )}


          {/* Recently Added */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up bg-primary/5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recently Added</h3>
            <div className="space-y-3">
              {mockPayments.slice(0, 5).map((payment) => {
                const StatusIcon = statusIcons[payment.status];
                return (
                  <div
                    key={payment.id}
                    className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-foreground text-sm">{payment.customerName}</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[payment.status]}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {payment.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{payment.subscriptionNo}</span>
                      <span className="font-medium text-foreground">
                        Rs. {payment.amount.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">{payment.date}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Pending Bank Slip Table (from mockData) */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up lg:w-[60%]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Pending Bank Slips
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
              {mockBankSlips.length} Pending
            </span>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-secondary/50 text-xs font-semibold text-muted-foreground">
              <div className="col-span-4">Customer</div>
              <div className="col-span-3">Ref No</div>
              <div className="col-span-2 text-center">Amount</div>
              <div className="col-span-3 text-center">Action</div>
            </div>

            {/* Table Body */}
            <div className="max-h-[450px] overflow-auto">
              {mockBankSlips.map((slip) => (
                <div
                  key={slip.id}
                  className="grid grid-cols-12 px-6 py-4 border-t border-border hover:bg-secondary/30 transition-colors text-sm items-center"
                >
                  {/* Customer */}
                  <div className="col-span-4">
                    <p className="font-medium text-foreground">
                      {slip.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {slip.subscriptionNo}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {slip.uploadedAt}
                    </p>
                  </div>

                  {/* Ref No */}
                  <div className="col-span-3 text-muted-foreground">
                    {slip.refNo}
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 text-right font-semibold text-foreground pr-4">
                    Rs. {slip.amount.toLocaleString()}
                  </div>

                  {/* Action */}
                  <div className="col-span-3 flex justify-center">
                    <Button size="sm" className="px-5">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Only pending slips are shown here.
          </p>
        </div>

      </div>
    </div>
  );
};
