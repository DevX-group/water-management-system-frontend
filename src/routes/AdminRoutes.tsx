import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { PaymentsAddingPage } from '@/pages/PaymentsAddingPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { BillingPage } from '@/pages/BillingPage';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="payments/customer/:customerId" element={<PaymentsAddingPage />} />
      <Route path="billing" element={<BillingPage />} />
      
    </Routes>
  );
};