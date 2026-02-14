interface MessageResponse {
  success: boolean;
  recipientCount: number;
  timestamp: string;
}

interface RecentMessage {
  to: string;
  subject: string;
  time: string;
}

export const sendMessage = (
  recipients: string[],
  subject: string,
  message: string
): MessageResponse => {
  return {
    success: true,
    recipientCount: recipients.length,
    timestamp: new Date().toISOString(),
  };
};

export const getRecentMessages = (): RecentMessage[] => {
  return [
    { to: 'All Customers', subject: 'Monthly Bill Reminder', time: '2 hours ago' },
    { to: 'Overdue Customers', subject: 'Payment Due Notice', time: '1 day ago' },
    { to: 'New Customers', subject: 'Welcome to Jal Seva', time: '3 days ago' },
  ];
};
