import '@/index.css';
import React, { useMemo, useState } from 'react';
import { mockPayments, mockCustomers, mockBankSlips } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { CustomerSearchCard, CustomerDetailsCard } from '@/components/payments/CustomerSearchCards';
import { RecentlyAddedPayments, PendingBankSlips } from '@/components/payments/PaymentListsCards';
import { PaymentCustomerSearch } from '@/components/payments/PaymentCustomerSearch';
import { RecentPaymentsList } from '@/components/payments/RecentPaymentsList';
import { PendingBankSlipsTable } from '@/components/payments/PendingBankSlipsTable';

export const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Manage customer payments and collections</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[40%] space-y-6">
          <PaymentCustomerSearch />
          <RecentPaymentsList />
        </div>
        <div className="lg:w-[60%]">
          <PendingBankSlipsTable />
        </div>
      </div>
    </div>
  );
};
