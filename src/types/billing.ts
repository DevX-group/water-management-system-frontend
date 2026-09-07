export type BillingPageTab = 'calculator' | 'view_bills';
export type ConnectionType = 'metered' | 'non_metered';

export interface ConnectionRate {
  connectionType: ConnectionType;
  baseRate:       number;
  unitRateTier1:  number;
  unitRateTier2:  number;
  unitRateTier3:  number;
  tier1Limit:     number;
  tier2Limit:     number;
  taxRate:        number;
}

export interface BillResponse {
  billId:        number;
  billingPeriod: string;
  billDate:      string;
  dueDate:       string;
  usageUnits:    number;
  previousReading?: number;
  currentReading?: number;
  baseCharge?:   number;
  usageCharge?:  number;
  taxAmount?:    number;
  totalAmount:   number;
  balanceDue:    number;
  status:        string;
  customerName?: string;
  nic?:          string;
  subscriptionNumber?: string;
}

export interface BillBreakdown {
  baseCharge:   number;
  usageCharge:  number;
  tax:          number;
  subtotal:     number;
  total:        number;
}

export type TabKey = 'monthly' | 'outstanding';