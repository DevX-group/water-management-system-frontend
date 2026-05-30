import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

export interface Customer {
  id: string;
  subscriptionNumber: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface CustomerBillingResponse {
  customerId?: string;
  customerName?: string;
  currentBill: number;
  overdueAmount: number;
  totalDue: number;
}

// Fetch all customers from backend
export const getCustomers = async (): Promise<Customer[]> => {
  const res = await api.get('/customers');
  return res.data;
};

// Fetch customer by ID/SubscriptionNumber from backend
export const getCustomerById = async (id: string): Promise<Customer> => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

//search customers from  data
export const searchCustomers = async (query: string): Promise<Customer[]> => {
  if (!query) return [];
  const res = await api.get(`/customers/search?query=${query}`);
  return res.data;
};

//search customers api
export const searchCustomersApi = async (query: string) => {
  const res = await api.get(`/customers/search?query=${query}`);
  return res.data;
};

export const getCustomerBilling = (customerId: string): CustomerBillingResponse => {
  const billing = mockCustomerBilling.find(b => b.customerId === customerId);
  return billing || {
    customerId: '',
    customerName: '',
    currentBill: 0,
    overdueAmount: 0,
    totalDue: 0,
  };
};
