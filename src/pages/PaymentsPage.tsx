import React, { useState } from 'react';
import { Search, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPayments, mockCustomers } from '@/data/mockData';
import { StatCard } from '@/components/common/StatCard';

export const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  const todaysCollection = 12500;
  const monthlyCollection = 108600;
  const overdueAlerts = 7;

  const filteredCustomers = mockCustomers.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.subscriptionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.nic.includes(searchQuery)
  );

  const handleCustomerSelect = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
    setSearchQuery('');
  };

  const statusStyles = {
    paid: 'bg-success/10 text-success',
    partial: 'bg-warning/10 text-warning',
    pending: 'bg-muted text-muted-foreground',
    overdue: 'bg-destructive/10 text-destructive',
  };

  const statusIcons = {
    paid: CheckCircle,
    partial: Clock,
    pending: Clock,
    overdue: AlertCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Manage customer payments and collections</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Today's Collection"
          value={`LKR ${todaysCollection.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
          delay={0}
        />
        <StatCard
          title="Monthly Collection"
          value={`LKR ${monthlyCollection.toLocaleString()}`}
          icon={Calendar}
          variant="primary"
          delay={50}
        />
        <StatCard
          title="Overdue Alerts"
          value={`${overdueAlerts} Customers`}
          icon={AlertCircle}
          variant="accent"
          delay={100}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Customer Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
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
                    <p className="text-sm text-muted-foreground">{customer.subscriptionNo} • {customer.region}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Details */}
          {selectedCustomer && (
            <div className="bg-card rounded-2xl p-6 shadow-md animate-scale-in">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedCustomer.customerType === 'with_meter' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {selectedCustomer.customerType === 'with_meter' ? 'With Meter' : 'No Meter'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscription No.</p>
                  <p className="font-medium text-foreground">{selectedCustomer.subscriptionNo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NIC</p>
                  <p className="font-medium text-foreground">{selectedCustomer.nic}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="font-medium text-foreground">{selectedCustomer.region}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <h4 className="font-medium text-foreground mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Bill:</span>
                    <span className="font-medium text-foreground">Rs. 1,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Already Paid:</span>
                    <span className="font-medium text-success">Rs. 500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-sm font-medium">Partial</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium text-foreground">Total Due:</span>
                    <span className="font-bold text-lg text-foreground">Rs. 1,350</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recently Added</h3>
          <div className="space-y-3">
            {mockPayments.slice(0, 5).map((payment) => {
              const StatusIcon = statusIcons[payment.status];
              return (
                <div 
                  key={payment.id}
                  className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-foreground text-sm">{payment.customerName}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[payment.status]}`}>
                      <StatusIcon className="w-3 h-3" />
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{payment.subscriptionNo}</span>
                    <span className="font-medium text-foreground">Rs. {payment.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{payment.date}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
