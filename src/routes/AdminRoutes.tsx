import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};