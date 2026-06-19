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

// Messaging API endpoints for scheduled and triggered templates.
const SCHEDULED_API_BASE = 'http://localhost:8081/api/scheduled-messages';
const TRIGGERED_API_BASE = 'http://localhost:8081/api/triggered-messages';
const ENUMS_API_BASE = 'http://localhost:8081/api/messaging/enums';
//
// const SCHEDULED_API_BASE = 'https://water-management-system-backend-0p2e.onrender.com/api/scheduled-messages';
// const TRIGGERED_API_BASE = 'https://water-management-system-backend-0p2e.onrender.com/api/triggered-messages';
// const ENUMS_API_BASE = 'https://water-management-system-backend-0p2e.onrender.com/api/messaging/enums';

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

const getErrorPayload = async (res: Response, fallback: string): Promise<ApiErrorPayload> => {
  try {
    const data: ApiErrorPayload = await res.json();
    if (data && typeof data.message === 'string' && data.message.trim()) {
      return { ...data, message: data.message.trim() };
    }
  } catch {
    // Ignore JSON parsing errors and fall back to text.
  }

  try {
    const text = await res.text();
    if (text && text.trim()) {
      return { message: text.trim() };
    }
  } catch {
    // Ignore text parsing errors and fall back to default.
  }

  return { message: fallback };
};

const assertOk = async (res: Response, fallback: string): Promise<void> => {
  if (!res.ok) {
    const payload = await getErrorPayload(res, fallback);
    throw new ApiError(payload.message ?? fallback, payload);
  }
};

export const getAllScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  const res = await fetch(SCHEDULED_API_BASE);
  await assertOk(res, 'Failed to fetch scheduled messages');
  const data: any[] = await res.json();
  return data.map(normaliseScheduled);
};

export const createScheduledMessage = async (message: Omit<ScheduledMessage, 'id'>): Promise<ScheduledMessage> => {
  const res = await fetch(SCHEDULED_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  await assertOk(res, 'Failed to create scheduled message');
  return normaliseScheduled(await res.json());
};

export const updateScheduledMessage = async (id: string, message: ScheduledMessage): Promise<ScheduledMessage> => {
  const res = await fetch(`${SCHEDULED_API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  await assertOk(res, 'Failed to update scheduled message');
  return normaliseScheduled(await res.json());
};

export const deleteScheduledMessage = async (id: string): Promise<void> => {
  const res = await fetch(`${SCHEDULED_API_BASE}/${id}`, { method: 'DELETE' });
  await assertOk(res, 'Failed to delete scheduled message');
};

export const getAllTriggeredMessages = async (): Promise<TriggeredMessage[]> => {
  const res = await fetch(TRIGGERED_API_BASE);
  await assertOk(res, 'Failed to fetch triggered messages');
  const data: any[] = await res.json();
  return data.map(normaliseTriggered);
};

export const createTriggeredMessage = async (message: Omit<TriggeredMessage, 'id'>): Promise<TriggeredMessage> => {
  const res = await fetch(TRIGGERED_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  await assertOk(res, 'Failed to create triggered message');
  return normaliseTriggered(await res.json());
};

export const updateTriggeredMessage = async (id: string, message: TriggeredMessage): Promise<TriggeredMessage> => {
  const res = await fetch(`${TRIGGERED_API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  await assertOk(res, 'Failed to update triggered message');
  return normaliseTriggered(await res.json());
};

export const deleteTriggeredMessage = async (id: string): Promise<void> => {
  const res = await fetch(`${TRIGGERED_API_BASE}/${id}`, { method: 'DELETE' });
  await assertOk(res, 'Failed to delete triggered message');
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
  const res = await fetch(`${SCHEDULED_API_BASE}/history?${params.toString()}`);
  await assertOk(res, 'Failed to fetch message history');
  const data: {
    content: SentMessageHistoryApi[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  } = await res.json();
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
  const res = await fetch(`${SCHEDULED_API_BASE}/failures/${sentMessageId}?${params.toString()}`);
  await assertOk(res, 'Failed to fetch failed recipients');
  const data: {
    content: FailedRecipient[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  } = await res.json();
  return {
    rows: data.content,
    page: data.number,
    size: data.size,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
  };
};

export const getMessagingEnums = async (): Promise<MessagingEnumResponse> => {
  const res = await fetch(ENUMS_API_BASE);
  await assertOk(res, 'Failed to fetch messaging enums');
  return res.json();
};
