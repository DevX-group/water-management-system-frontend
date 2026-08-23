// src/types/inquiry.ts

export type MessageSender = 'user' | 'admin' | 'system';

export interface InquiryMessage {
  sender: string;
  sender_role: string;
  id: string;
  from: MessageSender;
  user: string;
  text: string;
  time: string;
  isHtml?: boolean;
  attachmentUrl?: string;
}

export type InquiryStatus = 'open' | 'pending' | 'resolved';

export type InquiryCategory =
  | 'Billing'
  | 'Technical'
  | 'Account'
  | 'Shipping'
  | 'Refund'
  | 'General';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  category: InquiryCategory;
  messages: InquiryMessage[];
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  category: InquiryCategory | '';
  message: string;
  file?: File | null;
}

export type InquiryFormErrors = Partial<Record<keyof InquiryFormData, string>>;

