export interface MeterReading {
  id: number;
  meterNumber: string;
  subscriptionNumber: string;
  previousReading: number;
  currentReading: number;
  usageUnits: number;
  readingDate: string;
  notes: string;
  billId?: number;
  totalAmount?: number;
}

export interface MeterReadingFormData {
  meterNumber: string;
  subscriptionNumber: string;
  previousReading: string;
  currentReading: string;
  readingDate: string;
  notes: string;
}
