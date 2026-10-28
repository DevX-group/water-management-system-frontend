import type { NotificationType } from '@/types/customerNotification';

type TFunction = (key: string, options?: Record<string, string>) => string;

/**
 * Extracts the numeric amount from a MANUAL_PAYMENT backend message.
 * e.g. "Your manual payment of Rs. 200 has been added successfully." → "200"
 */
const extractAmount = (message: string): string => {
  const match = message.match(/Rs\.\s*([\d,]+(?:\.\d+)?)/i);
  return match ? match[1] : '';
};

/**
 * Returns a translated title for the given notification type.
 * Falls back to the original backend title if no translation key is found.
 */
export const translateNotificationTitle = (
  type: NotificationType,
  fallback: string,
  t: TFunction
): string => {
  const key = `notification.titles.${type}`;
  const translated = t(key);
  return translated !== key ? translated : fallback;
};

/**
 * Returns a translated message for the given notification type.
 * For MANUAL_PAYMENT, extracts the amount from the backend message and
 * injects it into the translated template via {{amount}} interpolation.
 * Falls back to the original backend message if no translation is found.
 */
export const translateNotificationMessage = (
  type: NotificationType,
  message: string,
  t: TFunction
): string => {
  const key = `notification.messages.${type}`;

  if (type === 'MANUAL_PAYMENT') {
    const amount = extractAmount(message);
    const translated = t(key, { amount });
    return translated !== key ? translated : message;
  }

  const translated = t(key);
  return translated !== key ? translated : message;
};
