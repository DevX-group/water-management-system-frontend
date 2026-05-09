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
  registeredDate: string;
  isDeleted?: boolean;
  deletedAt?: string;
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
  bankPaymentDate: string;
  slipImageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
}

export const mockAdmins: Admin[] = [
  { id: '1', name: 'Samantha Fernando', role: 'main_admin', email: 'samantha@pradeshiyasabha.lk' },
  { id: '2', name: 'Kasun Wijesinghe', role: 'meter_reader', email: 'kasun@pradeshiyasabha.lk' },
  { id: '3', name: 'Nimal Perera', role: 'payment_handler', email: 'nimal@pradeshiyasabha.lk' },
];

export const mockCustomers: Customer[] = [
  { id: '001', name: 'Sanjeewa Kumara', subscriptionNo: 'NOR-234123', nic: '198756432108', region: 'north', customerType: 'with_meter', phone: '0778682365', status: 'active', connectionType: 'residential', email: 'sanjeewa@email.com', address: '123 Main St, Beliatta', registeredDate: '2024-03-15' },
  { id: '002', name: 'Supun Perera', subscriptionNo: 'SOU-458945', nic: '200123456789', region: 'south', customerType: 'with_meter', phone: '077-1234567', status: 'active', connectionType: 'residential', email: '', address: '45 Lake Road, Tangalle', registeredDate: '2024-06-22' },
  { id: '003', name: 'Kamani Silva', subscriptionNo: 'NOR-789267', nic: '197234567890', region: 'north', customerType: 'no_meter', phone: '076-5432109', status: 'inactive', connectionType: 'commercial', email: 'kamani@email.com', address: '78 Beach Road, Hambantota', registeredDate: '2023-11-08' },
  { id: '004', name: 'Ruwan Jayawardena', subscriptionNo: 'EAS-123459', nic: '199087654321', region: 'east', customerType: 'with_meter', phone: '078-2345678', status: 'active', connectionType: 'industrial', email: '', address: '12 Industrial Zone, Beliatta', registeredDate: '2025-01-10' },
  { id: '005', name: 'Priyantha De Silva', subscriptionNo: 'WES-567845', nic: '196543210987', region: 'west', customerType: 'with_meter', phone: '077-8765432', status: 'active', connectionType: 'residential', email: 'priyantha@email.com', address: '56 Hill Road, Tangalle', registeredDate: '2025-07-30' },
  { id: '006', name: 'Nimali Wickramasinghe', subscriptionNo: 'CEN-345612', nic: '198812345678', region: 'center', customerType: 'with_meter', phone: '071-9876543', status: 'active', connectionType: 'residential', email: 'nimali@email.com', address: '34 Temple Road, Matara', registeredDate: '2024-08-12' },
  { id: '007', name: 'Tharanga Bandara', subscriptionNo: 'NOR-567234', nic: '199534567890', region: 'north', customerType: 'with_meter', phone: '076-3456789', status: 'inactive', connectionType: 'commercial', email: '', address: '89 Market St, Beliatta', registeredDate: '2023-05-20' },
  { id: '008', name: 'Dilshan Fernando', subscriptionNo: 'SOU-890123', nic: '200256789012', region: 'south', customerType: 'no_meter', phone: '078-6543210', status: 'active', connectionType: 'residential', email: 'dilshan@email.com', address: '67 Galle Road, Tangalle', registeredDate: '2025-02-18' },
  { id: '009', name: 'Anusha Rathnayake', subscriptionNo: 'EAS-234567', nic: '197845678901', region: 'east', customerType: 'with_meter', phone: '077-4567890', status: 'active', connectionType: 'industrial', email: 'anusha@email.com', address: '23 Factory Lane, Hambantota', registeredDate: '2024-11-05' },
  { id: '010', name: 'Chaminda Rajapaksha', subscriptionNo: 'WES-678901', nic: '198923456789', region: 'west', customerType: 'with_meter', phone: '071-2345678', status: 'inactive', connectionType: 'residential', email: '', address: '45 Coconut Grove, Matara', registeredDate: '2023-09-14' },
  { id: '011', name: 'Lakshitha Herath', subscriptionNo: 'CEN-901234', nic: '199612345678', region: 'center', customerType: 'with_meter', phone: '076-7890123', status: 'active', connectionType: 'commercial', email: 'lakshitha@email.com', address: '12 Main St, Beliatta', registeredDate: '2025-04-22' },
  { id: '012', name: 'Sachini Jayasuriya', subscriptionNo: 'NOR-345678', nic: '200178901234', region: 'north', customerType: 'no_meter', phone: '078-1234560', status: 'active', connectionType: 'residential', email: 'sachini@email.com', address: '90 School Road, Tangalle', registeredDate: '2025-09-01' },
  { id: '013', name: 'Mahesh Gunawardena', subscriptionNo: 'SOU-123890', nic: '198567890123', region: 'south', customerType: 'with_meter', phone: '077-5678901', status: 'active', connectionType: 'industrial', email: '', address: '56 Harbor Rd, Hambantota', registeredDate: '2024-01-30' },
  { id: '014', name: 'Iresha Karunaratne', subscriptionNo: 'EAS-456123', nic: '199345678901', region: 'east', customerType: 'with_meter', phone: '071-8901234', status: 'inactive', connectionType: 'residential', email: 'iresha@email.com', address: '78 Paddy Field Rd, Matara', registeredDate: '2023-07-11' },
];

export const mockPayments: Payment[] = [
  { id: '1', date: '2025-12-10', subscriptionNo: 'SOU-458945', customerName: 'Sunil Gamage', amount: 2800, status: 'paid' },
  { id: '2', date: '2025-12-10', subscriptionNo: 'NOR-234123', customerName: 'Sanjeewa Kumara', amount: 1500, status: 'paid' },
  { id: '3', date: '2025-12-09', subscriptionNo: 'NOR-789267', customerName: 'Kamani Silva', amount: 3200, status: 'partial' },
  { id: '4', date: '2025-12-09', subscriptionNo: 'EAS-123459', customerName: 'Ruwan Jayawardena', amount: 2100, status: 'paid' },
  { id: '5', date: '2025-12-08', subscriptionNo: 'WES-567845', customerName: 'Priyantha De Silva', amount: 1850, status: 'overdue' },
];

export const mockBankSlips: BankSlip[] = [

  { id: 'BS-001', customerId: '002', customerName: 'Supun Perera', subscriptionNo: 'SOU-458945', amount: 2800, refNo: 'BANK-84321', uploadedAt: '2026-02-16 09:12 AM', slipImageUrl:"/mock-bank-slip.jpg", status: 'pending', bankPaymentDate: '2026-02-15' },
  { id: 'BS-002', customerId: '001', customerName: 'Sanjeewa Kumara', subscriptionNo: 'NOR-234123', amount: 1500, refNo: 'BANK-77109', uploadedAt: '2026-02-16 08:40 AM', slipImageUrl: "/mock-bank-slip.jpg", status: 'pending', bankPaymentDate: '2026-02-15' },
  { id: 'BS-003', customerId: '003', customerName: 'Kamani Silva', subscriptionNo: 'NOR-789267', amount: 3200, refNo: 'BANK-12345', uploadedAt: '2026-02-15 11:30 AM', slipImageUrl: "/mock-bank-slip.jpg", status: 'pending', bankPaymentDate: '2026-02-15' },
  { id: 'BS-004', customerId: '004', customerName: 'Ruwan Jayawardena', subscriptionNo: 'EAS-123459', amount: 2100, refNo: 'BANK-56789', uploadedAt: '2026-02-15 14:45 PM', slipImageUrl: "/mock-bank-slip.jpg", status: 'pending', bankPaymentDate: '2026-02-15' },

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
