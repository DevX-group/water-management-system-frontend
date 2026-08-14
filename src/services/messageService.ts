import {
  FailedRecipient,
  MessageHistoryRow,
  MessagingEnumResponse,
  ScheduledMessage,
  TriggeredMessage,
  SentMessageHistoryApi,
  MessageHistoryPageResponse,
  MessageFailuresPageResponse,
  ApiError,
  ApiErrorPayload
} from '../types/messaging';
import { api } from './api';

// Messaging API endpoints for scheduled and triggered templates.
const SCHEDULED_API_BASE = '/scheduled-messages';
const TRIGGERED_API_BASE = '/triggered-messages';
const ENUMS_API_BASE = '/messaging/enums';

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
  const res = await api.get<any[]>(SCHEDULED_API_BASE);
  const data = res.data;
  return data.map(normaliseScheduled);
};

export const createScheduledMessage = async (message: Omit<ScheduledMessage, 'id'>): Promise<ScheduledMessage> => {
  const res = await api.post(SCHEDULED_API_BASE, message);
  return normaliseScheduled(res.data);
};

export const updateScheduledMessage = async (id: string, message: ScheduledMessage): Promise<ScheduledMessage> => {
  const res = await api.put(`${SCHEDULED_API_BASE}/${id}`, message);
  return normaliseScheduled(res.data);
};

export const deleteScheduledMessage = async (id: string): Promise<void> => {
  await api.delete(`${SCHEDULED_API_BASE}/${id}`);
};

export const getAllTriggeredMessages = async (): Promise<TriggeredMessage[]> => {
  const res = await api.get<any[]>(TRIGGERED_API_BASE);
  const data = res.data;
  return data.map(normaliseTriggered);
};

export const createTriggeredMessage = async (message: Omit<TriggeredMessage, 'id'>): Promise<TriggeredMessage> => {
  const res = await api.post(TRIGGERED_API_BASE, message);
  return normaliseTriggered(res.data);
};

export const updateTriggeredMessage = async (id: string, message: TriggeredMessage): Promise<TriggeredMessage> => {
  const res = await api.put(`${TRIGGERED_API_BASE}/${id}`, message);
  return normaliseTriggered(res.data);
};

export const deleteTriggeredMessage = async (id: string): Promise<void> => {
  await api.delete(`${TRIGGERED_API_BASE}/${id}`);
};

const toHistoryRow = (item: SentMessageHistoryApi): MessageHistoryRow => {
  // Derive a human-friendly channel label from backend channel text.
  const channels = (item.channels ?? []).map((channel) => channel.toLowerCase());
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

export const getMessageHistory = async (
  page = 0,
  size = 10
): Promise<MessageHistoryPageResponse> => {
  // Paged history for sent scheduled messages.
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const res = await api.get(`${SCHEDULED_API_BASE}/history?${params.toString()}`);
  const data: {
    content: SentMessageHistoryApi[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  } = res.data;
  return {
    rows: data.content.map(toHistoryRow),
    page: data.number,
    size: data.size,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
  };
};

export const getMessageFailures = async (
  sentMessageId: string,
  page = 0,
  size = 5
): Promise<MessageFailuresPageResponse> => {
  // Paged failures for a specific sent message.
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const res = await api.get(`${SCHEDULED_API_BASE}/failures/${sentMessageId}?${params.toString()}`);
  const data: {
    content: FailedRecipient[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  } = res.data;
  return {
    rows: data.content,
    page: data.number,
    size: data.size,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
  };
};

export const getMessagingEnums = async (): Promise<MessagingEnumResponse> => {
  const res = await api.get(ENUMS_API_BASE);
  return res.data;
};
