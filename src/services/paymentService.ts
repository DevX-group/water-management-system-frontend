import { mockPayments, Payment } from '@/data/mockData';

interface PaymentInput {
  subscriptionNo: string;
  customerName: string;
  amount: number;
  date?: string;
  status?: string;
}

interface PaymentResponse extends Payment {
  id: string;
  date: string;
  subscriptionNo: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'partial' | 'overdue';
}

export const getPayments = (): Payment[] => {
  return mockPayments;
};

export const getPaymentsByDate = (date: string): Payment[] => {
  return mockPayments.filter(p => p.date === date);
};

export const getPaymentsByStatus = (status: 'paid' | 'partial' | 'overdue' | 'pending'): Payment[] => {
  return mockPayments.filter(p => p.status === status);
};

export const addPayment = (paymentData: PaymentInput): PaymentResponse => {
  const newPayment: PaymentResponse = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    subscriptionNo: paymentData.subscriptionNo,
    customerName: paymentData.customerName,
    amount: paymentData.amount,
    status: 'paid',
  };
  return newPayment;
};
