import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enPayments from "./locales/en/payments.json";
import siPayments from "./locales/si/payments.json";
import enBilling from "./locales/en/billing.json";
import siBilling from "./locales/si/billing.json";
import enMeterReading from "./locales/en/meterReading.json";
import siMeterReading from "./locales/si/meterReading.json";
import enInquiry from "./locales/en/inquiry.json";
import siInquiry from "./locales/si/inquiry.json";
import enAdminBlog from "./locales/en/adminBlog.json";
import siAdminBlog from "./locales/si/adminBlog.json";
import enUserManagement from "./locales/en/userManagement.json";
import siUserManagement from "./locales/si/userManagement.json";
import enUsage from "./locales/en/usage.json";
import siUsage from "./locales/si/usage.json";
import enAlerts from "./locales/en/alerts.json";
import siAlerts from "./locales/si/alerts.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        payments: enPayments,
        billing: enBilling,
        meterReading: enMeterReading,
        inquiry: enInquiry,
        adminBlog: enAdminBlog,
        userManagement: enUserManagement,
        usage: enUsage,
        alerts: enAlerts,
      },
      si: {
        payments: siPayments,
        billing: siBilling,
        meterReading: siMeterReading,
        inquiry: siInquiry,
        adminBlog: siAdminBlog,
        userManagement: siUserManagement,
        usage: siUsage,
        alerts: siAlerts,
      },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;