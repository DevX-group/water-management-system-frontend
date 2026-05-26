import axios from 'axios';

const api = axios.create({
  //baseURL: "https://localhost:8081/api",
  baseURL: "https://water-management-system-backend-0p2e.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

export type PaymentStatus = "FULL" | "PARTIAL";
export type PaymentType = "MONTHLY" | "OUTSTANDING";
export type PaymentMethod = "ONLINE" | "BANK_TRANSFER" | "MANUAL";
export type SlipStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AddPaymentRequest {
  subscriptionNumber: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
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
  alreadyPaid: number;
  balanceDue: number;
  status: string;
}

export interface OutstandingBillResponse {
  billId: number;
  billingPeriod: string;
  billDate: string;
  balanceDue: number;
  status: string;
  totalAmount: number;
  paidAmount: number;
}

export interface OutstandingBillsSummaryResponse {
  outstandingBills: OutstandingBillResponse[];
  totalOutstandingAmount: number;
}

export interface PaymentHistoryItemResponse {
  paymentId: string;
  subscriptionNumber: string;
  amount: number;
  status: PaymentStatus;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface PaymentCustomerInfoResponse {
  subscriptionNumber: string;
  accountHolderName: string;
  nic: string;
  region: string;
  connectionType: string;
}

export interface RecentPaymentResponse {
  paymentId: string;
  subscriptionNumber: string;
  accountHolderName: string;
  amountPaid: number;
  status: string;
  createdAt: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
}

export interface CustomerAddPaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface CustomerPaymentResponse {
  merchant_id: string;
  order_id: string;
  amount: number;
  currency: string;
  hash: string;

  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  address?: string;
  city?: string;
  country?: string;

  return_url: string;
  cancel_url: string;
  notify_url: string;
}

export interface BankDetailsResponse {
  bankName: string;
  branch: string;
  accountNumber: string;
  accountName: string;
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
