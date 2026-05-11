export type MessageChannel = 'SMS' | 'Email';
export type ScheduleType = 'Recurring' | 'One-Time';
export type RecipientType = 'All Customers' | 'Overdue Customers' | 'Selected Customers';
export type TriggerType = 'PAYMENT_CONFIRMED' | 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION';

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

export interface MessageBase {
  id: string;
  name: string;
  channels: MessageChannel[]; 
  recipients: RecipientType;
  templates: {
    sms: MessageTemplate;
    email: MessageTemplate;
  };
  isDefault: boolean;
}

export interface ScheduledMessage extends MessageBase {
  schedule: MessageSchedule;
}

export interface TriggeredMessage extends MessageBase {
  triggerType: TriggerType;
  active: boolean;
}

export type Message = ScheduledMessage;

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
