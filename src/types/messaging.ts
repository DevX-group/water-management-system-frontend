// Core types for scheduled and triggered messaging.
export type MessageChannel = 'SMS' | 'Email';
export type ScheduleType = 'Recurring' | 'One-Time';
export type RecipientType = 'All Customers' | 'Overdue Customers';
export type TriggerType = 'Payment Confirmed' | 'Bank Slip Rejected' | 'Email Verification' | 'Phone Verification';

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

export interface MessagingEnumResponse {
  channels: MessageChannel[];
  scheduleTypes: ScheduleType[];
  recipientTypes: RecipientType[];
  placeholders: string[];
  triggerTypes: TriggerType[];
}

export type SentMessageHistoryApi = {
  id: number;
  name: string;
  channels: string[];
  recipients: string;
  sentDate: string;
  sentTime: string;
  emailSuccessRate: number | null;
  smsSuccessRate: number | null;
  totalEmailsSent: number | null;
  totalEmailsFailed: number | null;
  totalEmailsDelivered: number | null;
  totalSMSsSent: number | null;
  totalSMSsFailed: number | null;
  totalSMSsDelivered: number | null;
};

export type MessageHistoryPageResponse = {
  rows: MessageHistoryRow[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export type MessageFailuresPageResponse = {
  rows: FailedRecipient[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

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

export type ApiErrorPayload = {
  message?: string;
  code?: string;
  status?: number;
  timestamp?: number;
};

export class ApiError extends Error {
  code?: string;
  status?: number;
  timestamp?: number;

  constructor(message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.code = payload?.code;
    this.status = payload?.status;
    this.timestamp = payload?.timestamp;
  }
}
