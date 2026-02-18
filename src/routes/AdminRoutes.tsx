import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { PaymentsAddingPage } from '@/pages/PaymentsAddingPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
<<<<<<< HEAD
<<<<<<< HEAD
import { BankSlipReviewPage } from '@/pages/BankSlipReviewPage';
=======
import { BillingPage } from '@/pages/BillingPage';
>>>>>>> ae927e1 (Update payments page structure and routing)
=======
import { BankSlipReviewPage } from '@/pages/BankSlipReviewPage';
>>>>>>> 3514924 (Add initial bank slip review page)

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="payments/customer/:customerId" element={<PaymentsAddingPage />} />
<<<<<<< HEAD
<<<<<<< HEAD
      <Route path="payments/slip/:slipId" element={<BankSlipReviewPage />} />
=======
      <Route path="billing" element={<BillingPage />} />
      
>>>>>>> ae927e1 (Update payments page structure and routing)
=======
      <Route path="payments/slip/:slipId" element={<BankSlipReviewPage />} />
>>>>>>> 3514924 (Add initial bank slip review page)
    </Routes>
  );
};