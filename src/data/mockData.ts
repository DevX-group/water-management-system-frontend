export interface Admin {
  id: string;
  name: string;
  role: 'main_admin' | 'meter_reader' | 'payment_handler';
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  subscriptionNo: string;
  nic: string;
  region: string;
  customerType: 'with_meter' | 'no_meter';
  phone: string;
  status: 'active' | 'inactive';
  connectionType: 'residential' | 'commercial' | 'industrial';
  email: string;
  address: string;
}

export interface Payment {
  id: string;
  date: string;
  subscriptionNo: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'partial' | 'overdue';
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  overdueAmount: number;
}

export interface TierRate {
  min: number;
  max: number | null;
  rate: number;
}

export interface BillRate {
  id: string;
  meterType: 'residential' | 'commercial' | 'industrial' | 'no_meter';
  baseCharge: number;
  tierRates: TierRate[];
  taxRate: number;
}

export interface DashboardStats {
  totalCustomers: number;
  monthlyRevenue: number;
  waterDistributed: number;
  outstandingBills: number;
  overdueCount: number;
  customerGrowth: number;
  revenueGrowth: number;
}

export interface WaterUsageData {
  name: string;
  value: number;
  target: number;
}

export interface RevenueData {
  name: string;
  value: number;
}

export interface ExpenseData {
  name: string;
  value: number;
}

export interface MeterReading {
  id: string;
  meterNumber: string;
  previousReading: number;
  currentReading: number;
  readingDate: string;
  usage: number;
  customerId: string;
}

export interface WaterPrediction {
  customerId: string;
  customerName: string;
  predictedUsage: number;
  lastMonthUsage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CustomerBilling {
  customerId: string;
  customerName: string;
  currentBill: number;
  overdueAmount: number;
  totalDue: number;
}

export interface BankSlip {
  id: string;
  customerId: string;
  customerName: string;
  subscriptionNo: string;
  amount: number;
  refNo: string;
  uploadedAt: string;
  slipImageUrl: string;
}

export const mockAdmins: Admin[] = [
  { id: '1', name: 'Samantha Fernando', role: 'main_admin', email: 'samantha@pradeshiyasabha.lk' },
  { id: '2', name: 'Kasun Wijesinghe', role: 'meter_reader', email: 'kasun@pradeshiyasabha.lk' },
  { id: '3', name: 'Nimal Perera', role: 'payment_handler', email: 'nimal@pradeshiyasabha.lk' },
];

export const mockCustomers: Customer[] = [
  { id: '001', name: 'Sanjeewa Kumara', subscriptionNo: 'SK-2341', nic: '198756432108', region: 'north', customerType: 'with_meter', phone: '0778682365', status: 'active', connectionType: 'residential', email: 'sanjeewa@email.com', address: '123 Main St, Beliatta' },
  { id: '002', name: 'Supun Perera', subscriptionNo: 'SP-4589', nic: '200123456789', region: 'south', customerType: 'with_meter', phone: '077-1234567', status: 'active', connectionType: 'residential', email: '', address: '45 Lake Road, Tangalle' },
  { id: '003', name: 'Kamani Silva', subscriptionNo: 'KS-7892', nic: '197234567890', region: 'north', customerType: 'no_meter', phone: '076-5432109', status: 'inactive', connectionType: 'commercial', email: 'kamani@email.com', address: '78 Beach Road, Hambantota' },
  { id: '004', name: 'Ruwan Jayawardena', subscriptionNo: 'RJ-1234', nic: '199087654321', region: 'east', customerType: 'with_meter', phone: '078-2345678', status: 'active', connectionType: 'industrial', email: '', address: '12 Industrial Zone, Beliatta' },
  { id: '005', name: 'Priyantha De Silva', subscriptionNo: 'PD-5678', nic: '196543210987', region: 'west', customerType: 'with_meter', phone: '077-8765432', status: 'active', connectionType: 'residential', email: 'priyantha@email.com', address: '56 Hill Road, Tangalle' },
];

export const mockPayments: Payment[] = [
  { id: '1', date: '2025-12-10', subscriptionNo: 'SP-4589', customerName: 'Sunil Gamage', amount: 2800, status: 'paid' },
  { id: '2', date: '2025-12-10', subscriptionNo: 'SK-2341', customerName: 'Sanjeewa Kumara', amount: 1500, status: 'paid' },
  { id: '3', date: '2025-12-09', subscriptionNo: 'KS-7892', customerName: 'Kamani Silva', amount: 3200, status: 'partial' },
  { id: '4', date: '2025-12-09', subscriptionNo: 'RJ-1234', customerName: 'Ruwan Jayawardena', amount: 2100, status: 'paid' },
  { id: '5', date: '2025-12-08', subscriptionNo: 'PD-5678', customerName: 'Priyantha De Silva', amount: 1850, status: 'overdue' },
];

export const mockBankSlips: BankSlip[] = [
<<<<<<< HEAD
  { id: 'BS-001', customerId: '002', customerName: 'Supun Perera', subscriptionNo: 'SP-4589', amount: 2800, refNo: 'BANK-84321', uploadedAt: '2026-02-16 09:12 AM', slipImageUrl:"/mock-bank-slip.jpg"},
  { id: 'BS-002', customerId: '001', customerName: 'Sanjeewa Kumara', subscriptionNo: 'SK-2341', amount: 1500, refNo: 'BANK-77109', uploadedAt: '2026-02-16 08:40 AM', slipImageUrl: "/mock-bank-slip.jpg"},
  { id: 'BS-003', customerId: '003', customerName: 'Kamani Silva', subscriptionNo: 'KS-7892', amount: 3200, refNo: 'BANK-12345', uploadedAt: '2026-02-15 11:30 AM', slipImageUrl: "/mock-bank-slip.jpg"},
  { id: 'BS-004', customerId: '004', customerName: 'Ruwan Jayawardena', subscriptionNo: 'RJ-1234', amount: 2100, refNo: 'BANK-56789', uploadedAt: '2026-02-15 14:45 PM', slipImageUrl: "/mock-bank-slip.jpg"},
=======
  { id: 'BS-001', customerId: '002', customerName: 'Supun Perera', subscriptionNo: 'SP-4589', amount: 2800, refNo: 'BANK-84321', uploadedAt: '2026-02-16 09:12 AM', slipImageUrl: 'https://via.placeholder.com/800x1000?text=Bank+Slip+1'},
  { id: 'BS-002', customerId: '001', customerName: 'Sanjeewa Kumara', subscriptionNo: 'SK-2341', amount: 1500, refNo: 'BANK-77109', uploadedAt: '2026-02-16 08:40 AM', slipImageUrl: 'https://via.placeholder.com/800x1000?text=Bank+Slip+2'},
  { id: 'BS-003', customerId: '003', customerName: 'Kamani Silva', subscriptionNo: 'KS-7892', amount: 3200, refNo: 'BANK-12345', uploadedAt: '2026-02-15 11:30 AM', slipImageUrl: 'https://via.placeholder.com/800x1000?text=Bank+Slip+3'},
  { id: 'BS-004', customerId: '004', customerName: 'Ruwan Jayawardena', subscriptionNo: 'RJ-1234', amount: 2100, refNo: 'BANK-56789', uploadedAt: '2026-02-15 14:45 PM', slipImageUrl: 'https://via.placeholder.com/800x1000?text=Bank+Slip+4'},
>>>>>>> ae927e1 (Update payments page structure and routing)
];


export const mockInvoices: Invoice[] = [
  { id: 'INV-001', customerId: '1', customerName: 'Supun Perera', amount: 2380, date: '2025-03-05', status: 'paid', overdueAmount: 0 },
  { id: 'INV-002', customerId: '2', customerName: 'Sanjeewa Kumara', amount: 1850, date: '2025-03-10', status: 'paid', overdueAmount: 0 },
  { id: 'INV-003', customerId: '3', customerName: 'Kamani Silva', amount: 3100, date: '2025-03-15', status: 'pending', overdueAmount: 500 },
  { id: 'INV-004', customerId: '4', customerName: 'Ruwan Jayawardena', amount: 2750, date: '2025-03-20', status: 'overdue', overdueAmount: 1200 },
];

export const mockBillRates: BillRate[] = [
  {
    id: '1',
    meterType: 'residential',
    baseCharge: 50,
    tierRates: [
      { min: 0, max: 100, rate: 5 },
      { min: 100, max: 200, rate: 15 },
      { min: 200, max: null, rate: 20 },
    ],
    taxRate: 0.02,
  },
  {
    id: '2',
    meterType: 'commercial',
    baseCharge: 100,
    tierRates: [
      { min: 0, max: 200, rate: 10 },
      { min: 200, max: 500, rate: 20 },
      { min: 500, max: null, rate: 30 },
    ],
    taxRate: 0.05,
  },
  {
    id: '3',
    meterType: 'industrial',
    baseCharge: 200,
    tierRates: [
      { min: 0, max: 500, rate: 15 },
      { min: 500, max: 1000, rate: 25 },
      { min: 1000, max: null, rate: 35 },
    ],
    taxRate: 0.08,
  },
  {
    id: '4',
    meterType: 'no_meter',
    baseCharge: 300,
    tierRates: [],
    taxRate: 0.02,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalCustomers: 2845,
  monthlyRevenue: 485600,
  waterDistributed: 3100,
  outstandingBills: 156,
  overdueCount: 156,
  customerGrowth: 12,
  revenueGrowth: 8,
};

export const mockWaterUsageData: WaterUsageData[] = [
  { name: 'Jan', value: 2400, target: 2800 },
  { name: 'Feb', value: 2800, target: 2800 },
  { name: 'Mar', value: 3200, target: 2900 },
  { name: 'Apr', value: 2900, target: 2900 },
  { name: 'May', value: 3100, target: 3000 },
  { name: 'Jun', value: 3400, target: 3000 },
  { name: 'Jul', value: 2800, target: 3100 },
  { name: 'Aug', value: 3000, target: 3100 },
  { name: 'Sep', value: 3200, target: 3100 },
  { name: 'Oct', value: 2900, target: 3000 },
  { name: 'Nov', value: 3100, target: 3000 },
  { name: 'Dec', value: 3100, target: 3000 },
];

export const mockRevenueData: RevenueData[] = [
  { name: 'Jan', value: 380000 },
  { name: 'Feb', value: 420000 },
  { name: 'Mar', value: 390000 },
  { name: 'Apr', value: 450000 },
  { name: 'May', value: 480000 },
  { name: 'Jun', value: 520000 },
  { name: 'Jul', value: 460000 },
  { name: 'Aug', value: 490000 },
  { name: 'Sep', value: 510000 },
  { name: 'Oct', value: 475000 },
  { name: 'Nov', value: 485000 },
  { name: 'Dec', value: 485600 },
];

export const mockExpensesData: ExpenseData[] = [
  { name: 'Jan', value: 220000 },
  { name: 'Feb', value: 240000 },
  { name: 'Mar', value: 230000 },
  { name: 'Apr', value: 260000 },
  { name: 'May', value: 280000 },
  { name: 'Jun', value: 300000 },
  { name: 'Jul', value: 270000 },
  { name: 'Aug', value: 290000 },
  { name: 'Sep', value: 310000 },
  { name: 'Oct', value: 285000 },
  { name: 'Nov', value: 295000 },
  { name: 'Dec', value: 305000 },
];

export const mockMeterReadings: MeterReading[] = [
  { id: '1', meterNumber: 'MTR-001', previousReading: 1200, currentReading: 1350, readingDate: '2025-12-10', usage: 150, customerId: '1' },
  { id: '2', meterNumber: 'MTR-002', previousReading: 800, currentReading: 920, readingDate: '2025-12-10', usage: 120, customerId: '2' },
  { id: '3', meterNumber: 'MTR-003', previousReading: 2100, currentReading: 2300, readingDate: '2025-12-09', usage: 200, customerId: '4' },
];

export const mockWaterPredictions: WaterPrediction[] = [
  { customerId: '001', customerName: 'Sanjeewa Kumara', predictedUsage: 165, lastMonthUsage: 150, trend: 'up' },
  { customerId: '002', customerName: 'Supun Perera', predictedUsage: 180, lastMonthUsage: 175, trend: 'up' },
  { customerId: '003', customerName: 'Kamani Silva', predictedUsage: 0, lastMonthUsage: 0, trend: 'stable' },
  { customerId: '004', customerName: 'Ruwan Jayawardena', predictedUsage: 320, lastMonthUsage: 350, trend: 'down' },
  { customerId: '005', customerName: 'Priyantha De Silva', predictedUsage: 140, lastMonthUsage: 145, trend: 'down' },
];

export const mockCustomerBilling: CustomerBilling[] = [
  { customerId: '001', customerName: 'Sanjeewa Kumara', currentBill: 1850, overdueAmount: 0, totalDue: 1850 },
  { customerId: '002', customerName: 'Supun Perera', currentBill: 2100, overdueAmount: 500, totalDue: 2600 },
  { customerId: '003', customerName: 'Kamani Silva', currentBill: 300, overdueAmount: 1200, totalDue: 1500 },
  { customerId: '004', customerName: 'Ruwan Jayawardena', currentBill: 3500, overdueAmount: 2750, totalDue: 6250 },
  { customerId: '005', customerName: 'Priyantha De Silva', currentBill: 1650, overdueAmount: 0, totalDue: 1650 },
];
