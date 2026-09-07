import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import html2pdf from 'html2pdf.js';
import React from 'react';
import { WaterBillTemplate } from '@/components/bills/WaterBillTemplate';
import type { BillResponse } from '@/types/billing';
import type { CustomerProfile } from '@/components/profile/ProfileForm';

export const generateWaterBillPDF = async (bill: BillResponse, profile: CustomerProfile | null) => {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '0';
  wrapper.style.top = '0';
  wrapper.style.width = '0';
  wrapper.style.height = '0';
  wrapper.style.overflow = 'hidden';
  wrapper.style.pointerEvents = 'none';
  document.body.appendChild(wrapper);

  const container = document.createElement('div');
  container.style.width = '850px'; 
  container.style.background = '#ffffff';
  wrapper.appendChild(container);

  const root = createRoot(container);
  
  flushSync(() => {
    root.render(React.createElement(WaterBillTemplate, { bill, profile }));
  });
  
  // Force layout and wait for React to finish
  container.getBoundingClientRect();
  await new Promise(requestAnimationFrame);
  await new Promise(resolve => setTimeout(resolve, 1500));

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
        windowWidth: 1024,
        width: 850,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(container)
    .save()
    .then(() => {
      root.unmount();
      wrapper.remove();
    })
    .catch((err: any) => {
      root.unmount();
      wrapper.remove();
      throw err;
    });
};

export const printWaterBill = async (bill: BillResponse, profile: CustomerProfile | null) => {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '0';
  wrapper.style.top = '0';
  wrapper.style.width = '0';
  wrapper.style.height = '0';
  wrapper.style.overflow = 'hidden';
  wrapper.style.pointerEvents = 'none';
  document.body.appendChild(wrapper);

  const container = document.createElement('div');
  container.style.width = '850px'; 
  container.style.background = '#ffffff';
  wrapper.appendChild(container);

  const root = createRoot(container);
  
  flushSync(() => {
    root.render(React.createElement(WaterBillTemplate, { bill, profile }));
  });
  
  container.getBoundingClientRect();
  await new Promise(requestAnimationFrame);
  await new Promise(resolve => setTimeout(resolve, 1500));

  const worker = html2pdf();
  return worker
    .set({
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        windowWidth: 1024,
        width: 850,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(container)
    .outputPdf('bloburl')
    .then((pdfUrl: string) => {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      root.unmount();
      wrapper.remove();
    })
    .catch((err: any) => {
      root.unmount();
      wrapper.remove();
      throw err;
    });
};
