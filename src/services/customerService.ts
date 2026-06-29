import { Customer, CustomerFormData } from '@/types/user';
import { api } from './api';

// Backend response interfaces
interface BackendUser {
  id: string;
  nic: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendRegion {
  regionCode: string;
  regionName: string;
}

export interface BackendCustomer {
  subscriptionNumber: string;
  accountHolderName: string;
  user: BackendUser;
  address: string;
  connectionType: string;
  outstandingBalance: number;
  region: BackendRegion;
}

// Request payload
interface CustomerRegistrationRequest {
  accountHolderName: string;
  nic: string;
  address: string;
  phoneNumber: string;
  email?: string;
  connectionType: string;
  regionCode: string;
}

const normalizeConnectionType = (value: string): string => {
  return value.replace('-', '_').toUpperCase();
};

// Adapter function to map BackendCustomer to frontend Customer interface
const mapBackendToFrontend = (b: BackendCustomer): Customer => {
  const status = b.user.status;
  const isDeleted = status === 'INACTIVE' || status === 'SUSPENDED';
  return {
  id: b.subscriptionNumber, // Use subscriptionNumber as the unique ID for frontend components
  name: b.accountHolderName,
  nic: b.user.nic,
  subscriptionNo: b.subscriptionNumber,
  address: b.address,
  phone: b.user.phoneNumber,
  email: b.user.email,
  region: b.region.regionCode,
  connectionType: b.connectionType.toLowerCase(), // Backend stores enum, frontend uses lowercase
  registeredDate: new Date(b.user.createdAt).toISOString().split('T')[0],
  status,
  isDeleted,
  };
};

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await api.get<BackendCustomer[]>('/customers');
  return res.data.map(mapBackendToFrontend);
};

export const getCustomerById = async (subscriptionNumber: string): Promise<Customer> => {
  const res = await api.get<BackendCustomer>(`/customers/${subscriptionNumber}`);
  return mapBackendToFrontend(res.data);
};

export const createCustomer = async (data: CustomerFormData): Promise<Customer> => {
  const request: CustomerRegistrationRequest = {
    accountHolderName: data.name,
    nic: data.nic,
    address: data.address,
    phoneNumber: data.phone,
    email: data.email || undefined,
    connectionType: normalizeConnectionType(data.connectionType),
    regionCode: data.region,
  };
  
  const res = await api.post<BackendCustomer>('/customers', request);
  return mapBackendToFrontend(res.data);
};

export const searchCustomersApi = async (query: string): Promise<Customer[]> => {
  if (!query) return [];
  // Note: the backend /customers/search returns a different DTO (CustomerSearchResponse) 
  // with just subscriptionNumber and name. If we need full objects, we might filter client side
  // or change backend. For now, we fetch all and filter if needed, or rely on backend.
  // We'll fall back to fetching all and filtering client-side for full objects.
  const all = await getCustomers();
  const lowerQuery = query.toLowerCase();
  return all.filter(
    c => c.name.toLowerCase().includes(lowerQuery) ||
         c.subscriptionNo.toLowerCase().includes(lowerQuery) ||
         c.nic.toLowerCase().includes(lowerQuery)
  );
};

export const updateCustomer = async (subscriptionNumber: string, data: CustomerFormData): Promise<Customer> => {
  const request: CustomerRegistrationRequest = {
    accountHolderName: data.name,
    nic: data.nic,
    address: data.address,
    phoneNumber: data.phone,
    email: data.email || undefined,
    connectionType: normalizeConnectionType(data.connectionType),
    regionCode: data.region,
  };
  
  const res = await api.put<BackendCustomer>(`/customers/${subscriptionNumber}`, request);
  return mapBackendToFrontend(res.data);
};

export const deleteCustomer = async (subscriptionNumber: string): Promise<void> => {
  await api.delete(`/customers/${subscriptionNumber}`);
};

export const getCustomerBilling = async (customerId: string) => {
  // Placeholder for real billing API integration
  return {
    customerId,
    customerName: 'Unknown',
    currentBill: 0,
    overdueAmount: 0,
    totalDue: 0,
  };
};
