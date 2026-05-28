import type { TriggerType } from '@/types/messaging';

// Shared formatting helpers for messaging UI.
/**
 * Formats a trigger type enum value into a human-readable label.
 * e.g. 'PAYMENT_CONFIRMED' → 'Payment Confirmed'
 */
export const formatTriggerType = (triggerType: TriggerType): string => {
  return triggerType
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Replaces message template placeholders with  preview values.
 */
export const replacePlaceholders = (text: string): string => {
  let res = text || '';
  res = res.replace(/{customer_name}/g, 'John Doe');
  res = res.replace(/{customer_number}/g, 'CUS-12345');
  res = res.replace(/{monthly_fee}/g, '1500.00');
  res = res.replace(/{outstanding_balance}/g, '500.00');
  res = res.replace(/{total_balance}/g, '2000.00');
  res = res.replace(/{overdue_threshold}/g, '800.00');
  res = res.replace(/{reconnection_fee}/g, '1000.00');
  res = res.replace(/{pradeshiya_sabha_acc_no}/g, '234207');
  res = res.replace(/{whatsApp_number}/g, '011 2241435');
  return res;
};
