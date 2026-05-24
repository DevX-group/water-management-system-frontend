import { AddPaymentRequest, AddPaymentResponse, BankDetailsResponse, CurrentBillResponse, CustomerAddPaymentRequest, CustomerPaymentResponse, CustomerPaymentSummaryResponse, OutstandingBillsSummaryResponse, RecentPaymentResponse } from '@/types/payment';
import api from "@/lib/api";


export const getCustomerPaymentSummary = async (
  subscriptionNumber: string
): Promise<CustomerPaymentSummaryResponse> => {
  const res = await api.get(`/payments/customer/${subscriptionNumber}`);
  return res.data;
};

export const addPayment = async (
  payload: AddPaymentRequest
): Promise<AddPaymentResponse> => {
  const res = await api.post("/payments", payload);
  return res.data;
};

export const getCurrentBill = async (subscriptionNumber: string) => {
  const res = await api.get(`/bills/current/${subscriptionNumber}`);
  return res.data as CurrentBillResponse | null;
};

export const getOutstandingBillsSummary = async (subscriptionNumber: string) => {
  const res = await api.get(`/bills/outstanding/${subscriptionNumber}`);
  return res.data as OutstandingBillsSummaryResponse;
};

export const getPaymentHistory = async (subscriptionNumber: string, page = 0, size = 6) => {
  const res = await api.get(`/payments/history/${subscriptionNumber}?page=${page}&size=${size}`);
  return res.data;
};

export const getPaymentCustomerInfo = async (subscriptionNumber: string) => {
  const res = await api.get(`/payments/customerInfo/${subscriptionNumber}`);
  return res.data;
}

export const getRecentPayments = async (limit = 5) => {
  const res = await api.get(`/payments/recent?limit=${limit}`);
  return res.data as RecentPaymentResponse[];
}

export const updatePayment = async (paymentId: string, amount: number) => {
  const res = await api.patch(`/payments/${paymentId}`, { amount });
  return res.data;
}

export const initiatePayment = async (payload: CustomerAddPaymentRequest): Promise<CustomerPaymentResponse> => {
  const res = await api.post("/customer/payments/initiate", payload);
  return res.data;
};

export const getPaymentStatus = async (orderId: string) => {
  const response = await api.get(`/customer/payments/status/${orderId}`);
  return response.data;
};

export const getCurrentBillForCustomer = async () => {
  const res = await api.get("/customer/payments/current-bill");
  return res.data as CurrentBillResponse | null;
}

export const getOutstandingBillsForCustomer = async () => {
  const res = await api.get("/customer/payments/outstanding-bills");
  return res.data as OutstandingBillsSummaryResponse;
}

export const getPaymentHistoryForCustomer = async (page = 0, size = 6) => {
  const res = await api.get(`/customer/payments/history?page=${page}&size=${size}`);
  return res.data;
};

export const getBankDetails = async () => {
  const res = await api.get("/public/payments/bank-details");
  return res.data as BankDetailsResponse;
};

export const deletePayment = async (paymentId: string) => {
  const res = await api.delete(`/payments/delete/${paymentId}`);
  return res.data;
}
