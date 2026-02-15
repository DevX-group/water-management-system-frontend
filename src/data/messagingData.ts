import { Message, MessageHistoryRow } from "../types/messaging";

export const defaultRecurringSmsTemplate = [
  { id: '1', name: 'Greeting', content: 'Dear {customer_name},' },
  { id: '2', name: 'Introduction', content: 'This is your monthly water bill notification from Pradeshiya Sabha.' },
  { id: '3', name: 'Customer Number Line', content: 'Customer Number : {customer_number}' },
  { id: '4', name: 'Monthly Fee Line', content: 'Monthly Fee : LKR {monthly_fee}' },
  { id: '5', name: 'Outstanding Balance Line', content: 'Outstanding Balance : LKR {outstanding_balance}' },
  { id: '6', name: 'Total Balance Line', content: 'Total Balance : LKR {total_balance}' },
  { id: '7', name: 'Overdue Alert', content: 'IMPORTANT: Your balance exceeds {overdue_threshold}. The Pradeshiya Sabha can disconnect the water line if payment is missed. After disconnection, an additional charge of LKR {reconnection_fee} will be applied for reconnection.' },
  { id: '8', name: 'Bill Link', content: 'View your detailed bill online : { online_bill_portal_link }' },
  { id: '9', name: 'Online Payment Instructions', content: 'For online payment, please visit www.example.com\nor\nDeposit the amount to account number { pradeshiya_sabha_acc_no } and Whatsapp your receipt along with your subscription number, name and NIC to { whatsApp_number }' },
  { id: '10', name: 'Footer', content: 'Thank you for your cooperation.\n- Pradeshiya Sabha' },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    name: "Monthly Bill Message",
    channels: ["SMS", "Email"],
    isDefault: true,
    schedule: {
      type: "Recurring",
      dayOfMonth: 20,
      time: "08:00",
    },
    recipients: "All Customers",
    templates: {
      sms: {
        isCustom: false,
        sections: defaultRecurringSmsTemplate,
        content: "",
      },
      email: {
        isCustom: false,
        sections: defaultRecurringSmsTemplate, // Requirement says keep same for now
        content: "",
      },
    },
  },
  {
    id: "2",
    name: "Overdue Alert",
    channels: ["SMS"],
    isDefault: true,
    schedule: {
      type: "Recurring",
      dayOfMonth: 25,
      time: "09:00",
    },
    recipients: "Overdue Customers",
    templates: {
      sms: {
        isCustom: false,
        sections: [
          { id: '1', name: 'Alert', content: 'Dear {customer_name}, your bill is overdue. Please pay immediately to avoid disconnection.' }
        ],
        content: "",
      },
      email: {
        isCustom: false,
        sections: [],
        content: "",
      },
    },
  },
  {
    id: "3",
    name: "Water supply cut-off",
    channels: ["SMS"],
    isDefault: true,
    schedule: {
      type: "One-Time",
      date: "2026-01-15",
      time: "10:00",
    },
    recipients: "Selected Customers",
    templates: {
      sms: {
        isCustom: true,
        sections: [],
        content: "Water supply will be interrupted tomorrow 8am-5pm for maintenance.",
      },
      email: {
        isCustom: true,
        sections: [],
        content: "",
      },
    },
  },
  {
    id: "4",
    name: "Custom message A",
    channels: ["SMS"],
    isDefault: false,
    schedule: {
      type: "One-Time",
      date: "2026-02-01",
      time: "12:00",
    },
    recipients: "All Customers",
    templates: {
      sms: {
        isCustom: true,
        sections: [],
        content: "Happy Independence Day!",
      },
      email: {
        isCustom: true,
        sections: [],
        content: "",
      },
    },
  },
];

export const mockHistory: MessageHistoryRow[] = [
  {
    id: "h1",
    messageName: "Monthly Bill Message",
    type: "SMS & Email",
    date: "2025-12-20",
    time: "08:00",
    successRate: 98,
    totalSent: 1200,
    totalFailed: 24,
    recipients: "All Customers",
  },
  {
    id: "h2",
    messageName: "Overdue Alert",
    type: "SMS",
    date: "2025-12-25",
    time: "09:00",
    successRate: 95,
    totalSent: 150,
    totalFailed: 7,
    recipients: "Overdue Customers",
  },
  {
    id: "h3",
    messageName: "New Year Greeting",
    type: "SMS",
    date: "2026-01-01",
    time: "00:00",
    successRate: 99,
    totalSent: 1200,
    totalFailed: 12,
    recipients: "All Customers",
  },
];