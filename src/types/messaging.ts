export type MessageChannel = 'SMS' | 'Email';
export type ScheduleType = 'Recurring' | 'One-Time';
export type RecipientType = 'All Customers' | 'Overdue Customers' | 'Selected Customers';

export interface TemplateSection {
  id: string;
  name: string;
  content: string;
}

export interface MessageTemplate {
  isCustom: boolean;
  sections: TemplateSection[];
  content: string; // for custom mode
  subject?: string; // for email templates
}

export interface MessageSchedule {
  type: ScheduleType;
  dayOfMonth?: number; // 1-31
  date?: string; // ISO string for one-time
  time: string; // HH:mm
}

export interface Message {
  id: string;
  name: string;
  channels: MessageChannel[]; 
  schedule: MessageSchedule;
  recipients: RecipientType;
  templates: {
    sms: MessageTemplate;
    email: MessageTemplate;
  };
  isDefault: boolean;
}

export interface MessageHistoryRow {
  id: string;
  messageName: string;
  type: string; // "SMS" | "Email" | "Both"
  date: string;
  time: string;
  successRate: number;
  emailSuccessRate: number;
  smsSuccessRate: number;
  totalEmailsSent: number;
  totalEmailsFailed: number;
  totalEmailsDelivered: number;
  totalSmsSent: number;
  totalSmsFailed: number;
  totalSmsDelivered: number;
  recipients: string;
}

export interface FailedRecipient {
  subscriptionNumber: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  smsFailed: boolean;
  emailFailed: boolean;
}

export const PLACEHOLDERS = [
  "customer_name",
  "customer_number",
  "billing_period",
  "bill_date",
  "base_charge",
  "usage_units",
  "usage_charge",
  "tax_amount",
  "monthly_fee",
  "outstanding_balance",
  "total_balance",
  "due_date",
  "overdue_threshold_(LKR)",
  "reconnection_fee_(LKR)",
  "pradeshiya_sabha_acc_no",
  "whatsApp_number",
  "online_bill_portal_link"
];