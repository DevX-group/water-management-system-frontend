import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/utils/authUtils';

export type InternalChatSocketState = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

const getEndpoint = () => {
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${apiOrigin}/ws/internal-chat`;
};

export class InternalChatSocket {
  private client: Client | null = null;
  private conversationSubscription: StompSubscription | null = null;
  private userSubscription: StompSubscription | null = null;
  private readSubscription: StompSubscription | null = null;

  connect(
    onStateChange: (state: InternalChatSocketState) => void,
    onMessage: (message: IMessage) => void,
    onConnected?: () => void,
  ) {
    const token = getToken();
    if (!token) {
      onStateChange('ERROR');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(getEndpoint()),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        onStateChange('CONNECTED');
        onConnected?.();
      },
      onDisconnect: () => onStateChange('DISCONNECTED'),
      onWebSocketError: () => onStateChange('ERROR'),
      onStompError: () => onStateChange('ERROR'),
    });
    this.messageHandler = onMessage;
    onStateChange('CONNECTING');
    this.client.activate();
  }

  private messageHandler: ((message: IMessage) => void) | null = null;

  subscribe(conversationId: string) {
    if (!this.client?.connected) return;
    this.conversationSubscription?.unsubscribe();
    this.conversationSubscription = this.client.subscribe(
      `/topic/internal-chat/conversation/${conversationId}`,
      (message) => this.messageHandler?.(message),
    );
  }

  clearConversationSubscription() {
    this.conversationSubscription?.unsubscribe();
    this.conversationSubscription = null;
  }

  subscribeUserQueue() {
    if (!this.client?.connected) return;
    this.userSubscription?.unsubscribe();
    this.userSubscription = this.client.subscribe(
      '/user/queue/internal-chat',
      (message) => this.messageHandler?.(message),
    );
  }

  subscribeReadQueue() {
    if (!this.client?.connected) return;
    this.readSubscription?.unsubscribe();
    this.readSubscription = this.client.subscribe(
      '/user/queue/internal-chat-read',
      (message) => this.messageHandler?.(message),
    );
  }

  disconnect() {
    this.conversationSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
    this.readSubscription?.unsubscribe();
    this.conversationSubscription = null;
    this.userSubscription = null;
    this.readSubscription = null;
    this.messageHandler = null;
    void this.client?.deactivate();
    this.client = null;
  }
}
