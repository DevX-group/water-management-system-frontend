import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export type PaymentStatus = "FULL" | "PARTIAL";
export type PaymentType = "MONTHLY" | "OUTSTANDING";

export interface AddPaymentRequest {
  subscriptionNumber: string;
  amount: number;
  status: PaymentStatus;
  paymentType: PaymentType;
}

export interface AddPaymentResponse {
  message: string;
  subscriptionNumber: string;
  oldBalance: number;
  newBalance: number;
  paymentId: string;
  status: PaymentStatus;
  paymentType: PaymentType;
  createdAt: string;
}

export interface CustomerPaymentSummaryResponse {
  subscriptionNumber: string;
  monthlyDue: number;
  outstandingBalance: number;
  totalDue: number;
  billStatus: string;
}

export interface CurrentBillResponse {
  billId: number;
  billingPeriod: string;
  billDate: string;
  totalAmount: number;
  balanceDue: number;
  status: string;
}

export interface OutstandingBillItemResponse {
  billId: number;
  billingPeriod: string;
  billDate: string;
  balanceDue: number;
  status: string;
  totalAmount: number;
  paidAmount: number;
}

export interface PaymentHistoryItemResponse {
  paymentId: string;
  subscriptionNumber: string;
  amount: number;
  status: string;        
  paymentType: string;   
  createdAt: string;     
}

export interface PaymentCustomerInfoResponse{
  subscriptionNumber: string;
  accountHolderName: string;
  nic: string;
  region: string;
}

export interface RecentPaymentResponse {
  paymentId: string;
  subscriptionNumber: string;
  accountHolderName: string;
  amountPaid: number;
  status: string;
  createdAt: string;
}

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

export const getOutstandingBills = async (subscriptionNumber: string) => {
  const res = await api.get(`/bills/outstanding/${subscriptionNumber}`);
  return res.data as OutstandingBillItemResponse[];
};

export const getPaymentHistory = async (subscriptionNumber: string) => {
  const res = await api.get(`/payments/history/${subscriptionNumber}`);
  return res.data as PaymentHistoryItemResponse[];
};

export const getPaymentCustomerInfo = async (subscriptionNumber: string) =>{
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