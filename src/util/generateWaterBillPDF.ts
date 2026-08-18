import { createRoot } from 'react-dom/client';
import html2pdf from 'html2pdf.js';
import React from 'react';
import { WaterBillTemplate } from '@/components/bills/WaterBillTemplate';
import type { BillResponse } from '@/types/billing';
import type { CustomerProfile } from '@/components/profile/ProfileForm';

export const generateWaterBillPDF = async (bill: BillResponse, profile: CustomerProfile | null) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '850px'; 
  container.style.background = '#ffffff';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(React.createElement(WaterBillTemplate, { bill, profile }));
  await new Promise(resolve => setTimeout(resolve, 800));

  const fileName = `WaterBill-${bill.billingPeriod || bill.billId}.pdf`;

  const worker = html2pdf();
  return worker
    .set({
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(container)
    .save()
    .then(() => {
      root.unmount();
      container.remove();
    })
    .catch((err: any) => {
      root.unmount();
      container.remove();
      throw err;
    });
};
