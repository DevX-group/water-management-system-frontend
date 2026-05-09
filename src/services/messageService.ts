import { FailedRecipient, MessageHistoryRow, ScheduledMessage, TriggeredMessage } from '../types/messaging';

const SCHEDULED_API_BASE = 'http://localhost:8081/api/scheduled-messages';
const TRIGGERED_API_BASE = 'http://localhost:8081/api/triggered-messages';

// The backend returns id as Long (number); normalise to string
// to keep the rest of the frontend compatible with id: string
const normaliseScheduled = (data: any): ScheduledMessage => ({
  ...data,
  id: String(data.id),
});

const normaliseTriggered = (data: any): TriggeredMessage => ({
  ...data,
  id: String(data.id),
});

export const getAllScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  const res = await fetch(SCHEDULED_API_BASE);
  if (!res.ok) throw new Error('Failed to fetch scheduled messages');
  const data: any[] = await res.json();
  return data.map(normaliseScheduled);
};

export const createScheduledMessage = async (message: Omit<ScheduledMessage, 'id'>): Promise<ScheduledMessage> => {
  const res = await fetch(SCHEDULED_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to create scheduled message');
  return normaliseScheduled(await res.json());
};

export const updateScheduledMessage = async (id: string, message: ScheduledMessage): Promise<ScheduledMessage> => {
  const res = await fetch(`${SCHEDULED_API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to update scheduled message');
  return normaliseScheduled(await res.json());
};

export const deleteScheduledMessage = async (id: string): Promise<void> => {
  const res = await fetch(`${SCHEDULED_API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete scheduled message');
};

export const getAllTriggeredMessages = async (): Promise<TriggeredMessage[]> => {
  const res = await fetch(TRIGGERED_API_BASE);
  if (!res.ok) throw new Error('Failed to fetch triggered messages');
  const data: any[] = await res.json();
  return data.map(normaliseTriggered);
};

export const createTriggeredMessage = async (message: Omit<TriggeredMessage, 'id'>): Promise<TriggeredMessage> => {
  const res = await fetch(TRIGGERED_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to create triggered message');
  return normaliseTriggered(await res.json());
};

export const updateTriggeredMessage = async (id: string, message: TriggeredMessage): Promise<TriggeredMessage> => {
  const res = await fetch(`${TRIGGERED_API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to update triggered message');
  return normaliseTriggered(await res.json());
};

export const deleteTriggeredMessage = async (id: string): Promise<void> => {
  const res = await fetch(`${TRIGGERED_API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete triggered message');
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
  const res = await fetch(`${SCHEDULED_API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch message history');
  const data: SentMessageHistoryApi[] = await res.json();
  return data.map(toHistoryRow);
};

export const getMessageFailures = async (sentMessageId: string): Promise<FailedRecipient[]> => {
  const res = await fetch(`${SCHEDULED_API_BASE}/failures/${sentMessageId}`);
  if (!res.ok) throw new Error('Failed to fetch failed recipients');
  return res.json();
};

export const getMessagePlaceholders = async (): Promise<string[]> => {
  const res = await fetch(`${SCHEDULED_API_BASE}/placeholders`);
  if (!res.ok) throw new Error('Failed to fetch placeholders');
  return res.json();
};
