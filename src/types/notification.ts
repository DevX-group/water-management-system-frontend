export interface Notification {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'medium' | 'high' | 'critical';
  timestamp: string;
  dismissed: boolean;
}

export interface NotificationStats {
  critical: number;
  high:     number;
  medium:   number;
  info:     number;
}
