import React, { useMemo, useState } from 'react';
import { mockPayments, mockCustomers, mockBankSlips } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { CustomerSearchCard, CustomerDetailsCard } from '@/components/payments/CustomerSearchCards';
import { RecentlyAddedPayments, PendingBankSlips } from '@/components/payments/PaymentListsCards';

export const PaymentsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return mockCustomers.filter(c => c.name.toLowerCase().includes(q) || c.subscriptionNo.toLowerCase().includes(q) || c.nic.includes(searchQuery.trim()));
  }, [searchQuery]);

  const handleCustomerSelect = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Manage customer payments and collections</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[40%] space-y-6">
          <CustomerSearchCard
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            filteredCustomers={filteredCustomers} onCustomerSelect={handleCustomerSelect}
          />
          <CustomerDetailsCard
            selectedCustomer={selectedCustomer}
            onNavigate={() => navigate(`/admin/payments/customer/${selectedCustomer?.subscriptionNo}`)}
          />
          <RecentlyAddedPayments payments={mockPayments.slice(0, 5)} />
        </div>
        <PendingBankSlips slips={mockBankSlips} onReview={(id) => navigate(`/admin/payments/slip/${id}`)} />
      </div>
    </div>
  );
};
