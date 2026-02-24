import { Message } from '../types/messaging';

const API_BASE = 'http://localhost:8080/api/messages';

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
