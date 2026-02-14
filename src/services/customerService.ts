import { mockCustomers, mockCustomerBilling, Customer, CustomerBilling } from '@/data/mockData';

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
