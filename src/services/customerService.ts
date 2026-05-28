import { mockCustomers, mockCustomerBilling, Customer, CustomerBilling } from '@/data/mockData';

import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

interface CustomerBillingResponse extends CustomerBilling {
  customerId?: string;
  customerName?: string;
}

export const getCustomers = (): Customer[] => {
  return mockCustomers;
};

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

//search customers from  data
export const searchCustomers = (query: string): Customer[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockCustomers.filter(
    c => c.name.toLowerCase().includes(lowerQuery) ||
         c.subscriptionNo.toLowerCase().includes(lowerQuery) ||
         c.nic.includes(query) ||
         c.id.includes(query)
  );
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
