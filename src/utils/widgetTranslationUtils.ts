import i18n from '@/i18n';

const STORAGE_KEY_PREFIX = 'wms_widget_custom_names_';

export const getCustomWidgetTranslations = (lang: string): Record<string, string> => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${lang}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const setCustomWidgetTranslation = (key: string, lang: string, value: string) => {
  try {
    const current = getCustomWidgetTranslations(lang);
    current[key] = value;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${lang}`, JSON.stringify(current));

    // Update runtime i18n resource bundle so t('widgets.<key>') updates immediately
    i18n.addResource(lang, 'widgetManagement', `widgets.${key}`, value);

    // Dispatch a custom event to notify all WidgetContainers across the page
    window.dispatchEvent(new CustomEvent('wms-widget-translation-updated', {
      detail: { key, lang, value }
    }));
  } catch (err) {
    console.error('Failed to save custom widget translation', err);
  }
};

export const initializeWidgetTranslationsFromStorage = () => {
  ['en', 'si', 'ta'].forEach(lang => {
    const custom = getCustomWidgetTranslations(lang);
    Object.entries(custom).forEach(([key, val]) => {
      i18n.addResource(lang, 'widgetManagement', `widgets.${key}`, val);
    });
  });
};

export const getWidgetTitleForLang = (
  widgetKeyOrComponentKey: string | undefined,
  fallbackName: string,
  lang: string
): string => {
  if (!widgetKeyOrComponentKey) return fallbackName;

  // 1. Check custom overrides from localStorage
  const custom = getCustomWidgetTranslations(lang);
  if (custom[widgetKeyOrComponentKey]) {
    return custom[widgetKeyOrComponentKey];
  }

  // 2. Check i18n dictionary
  const translated = i18n.t(`widgets.${widgetKeyOrComponentKey}`, {
    lng: lang,
    ns: 'widgetManagement',
    defaultValue: '',
  });

  if (translated && translated !== `widgets.${widgetKeyOrComponentKey}`) {
    return translated;
  }

  return fallbackName;
};
