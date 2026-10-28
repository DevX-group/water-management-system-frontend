const MONTHS_SI = [
  'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
  'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
];

const MONTHS_TA = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

const MONTHS_EN_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_EN_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_PREFIXES_EN = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

/**
 * Resolves a raw month indicator (number, English name, ISO string, etc.) into 0-11 index.
 */
export const getMonthIndex = (raw: string | number | undefined | null): number => {
  if (raw === undefined || raw === null || raw === '') return -1;

  if (typeof raw === 'number') {
    if (raw >= 1 && raw <= 12) return raw - 1;
    if (raw >= 0 && raw <= 11) return raw;
    return -1;
  }

  const str = String(raw).trim();

  // e.g. "M1", "M01", "M12"
  if (/^M\d{1,2}$/i.test(str)) {
    const num = parseInt(str.slice(1), 10);
    if (num >= 1 && num <= 12) return num - 1;
  }

  // e.g. "2026-05" or "2026-5"
  if (/^\d{4}-\d{1,2}$/.test(str)) {
    const parts = str.split('-');
    const num = parseInt(parts[1], 10);
    if (num >= 1 && num <= 12) return num - 1;
  }

  // Pure digits: "1" .. "12" or "01" .. "12"
  if (/^\d{1,2}$/.test(str)) {
    const num = parseInt(str, 10);
    if (num >= 1 && num <= 12) return num - 1;
    if (num === 0) return 0;
  }

  const lower = str.toLowerCase();

  // Match English prefix
  for (let i = 0; i < MONTH_PREFIXES_EN.length; i++) {
    if (lower.startsWith(MONTH_PREFIXES_EN[i])) {
      return i;
    }
  }

  // Match Sinhala full/short month names
  for (let i = 0; i < MONTHS_SI.length; i++) {
    if (str.includes(MONTHS_SI[i]) || MONTHS_SI[i].includes(str)) {
      return i;
    }
  }

  // Match Tamil full/short month names
  for (let i = 0; i < MONTHS_TA.length; i++) {
    if (str.includes(MONTHS_TA[i]) || MONTHS_TA[i].includes(str)) {
      return i;
    }
  }

  return -1;
};

/**
 * Format a month name/identifier according to language ('si', 'ta', 'en')
 */
export const formatMonthLabel = (
  rawMonth: string | number | undefined | null,
  lang: string = 'en',
  useShortFormIfEnglish: boolean = true
): string => {
  const idx = getMonthIndex(rawMonth);
  if (idx < 0 || idx > 11) return String(rawMonth ?? '');

  if (lang === 'si') {
    return MONTHS_SI[idx];
  }

  if (lang === 'ta') {
    return MONTHS_TA[idx];
  }

  return useShortFormIfEnglish ? MONTHS_EN_SHORT[idx] : MONTHS_EN_FULL[idx];
};
