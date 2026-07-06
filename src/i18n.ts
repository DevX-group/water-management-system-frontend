import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enPayments from "./locales/en/payments.json";
import siPayments from "./locales/si/payments.json";
import enBilling from "./locales/en/billing.json";
import siBilling from "./locales/si/billing.json";
import enMeterReading from "./locales/en/meterReading.json";
import siMeterReading from "./locales/si/meterReading.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        payments: enPayments,
        billing: enBilling,
        meterReading: enMeterReading,
      },
      si: {
        payments: siPayments,
        billing: siBilling,
        meterReading: siMeterReading,
      },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;