import { FailedRecipient, Message, MessageHistoryRow } from '../types/messaging';

const API_BASE = 'http://localhost:8081/api/messages';

// The backend returns id as Long (number); normalise to string
// to keep the rest of the frontend compatible with Message.id: string
const normalise = (data: any): Message => ({
  ...data,
  id: String(data.id),
});

export const getAllMessages = async (): Promise<Message[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch messages');
  const data: any[] = await res.json();
  return data.map(normalise);
};

export const createMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to create message');
  return normalise(await res.json());
};

export const updateMessage = async (id: string, message: Message): Promise<Message> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to update message');
  return normalise(await res.json());
};

export const deleteMessage = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete message');
};

type SentMessageHistoryApi = {
  id: number;
  name: string;
  channels: string;
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

const toHistoryRow = (item: SentMessageHistoryApi): MessageHistoryRow => {
  const channels = (item.channels ?? '').toLowerCase();
  let type = 'Message';
  if (channels.includes('sms') && channels.includes('email')) type = 'SMS & Email';
  else if (channels.includes('email')) type = 'Email';
  else if (channels.includes('sms')) type = 'SMS';

  return {
    id: String(item.id),
    messageName: item.name ?? '',
    type,
    date: item.sentDate ?? '-',
    time: item.sentTime ?? '-',
    successRate: item.emailSuccessRate ?? 0,
    emailSuccessRate: item.emailSuccessRate ?? 0,
    smsSuccessRate: item.smsSuccessRate ?? 0,
    totalEmailsSent: item.totalEmailsSent ?? 0,
    totalEmailsFailed: item.totalEmailsFailed ?? 0,
    totalEmailsDelivered: item.totalEmailsDelivered ?? 0,
    totalSmsSent: item.totalSMSsSent ?? 0,
    totalSmsFailed: item.totalSMSsFailed ?? 0,
    totalSmsDelivered: item.totalSMSsDelivered ?? 0,
    recipients: item.recipients ?? '-',
  };
};

export const getMessageHistory = async (): Promise<MessageHistoryRow[]> => {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch message history');
  const data: SentMessageHistoryApi[] = await res.json();
  return data.map(toHistoryRow);
};

export const getMessageFailures = async (sentMessageId: string): Promise<FailedRecipient[]> => {
  const res = await fetch(`${API_BASE}/failures/${sentMessageId}`);
  if (!res.ok) throw new Error('Failed to fetch failed recipients');
  return res.json();
};

export const getMessagePlaceholders = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/placeholders`);
  if (!res.ok) throw new Error('Failed to fetch placeholders');
  return res.json();
};
