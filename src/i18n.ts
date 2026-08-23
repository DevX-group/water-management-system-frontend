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
import taPayments from "./locales/ta/payments.json";
import taBilling from "./locales/ta/billing.json";
import taMeterReading from "./locales/ta/meterReading.json";
import taInquiry from "./locales/ta/inquiry.json";
import taUsage from "./locales/ta/usage.json";
import taAlerts from "./locales/ta/alerts.json";
import taAdminBlog from "./locales/ta/adminBlog.json";
import taUserManagement from "./locales/ta/userManagement.json";
import enNavbar from "./locales/en/navbar.json";
import siNavbar from "./locales/si/navbar.json";
import taNavbar from "./locales/ta/navbar.json";
import enMessaging from "./locales/en/messaging.json";
import siMessaging from "./locales/si/messaging.json";
import taMessaging from "./locales/ta/messaging.json";
import enSystemSettings from "./locales/en/systemSettings.json";
import siSystemSettings from "./locales/si/systemSettings.json";
import taSystemSettings from "./locales/ta/systemSettings.json";
import enReports from "./locales/en/reports.json";
import siReports from "./locales/si/reports.json";
import taReports from "./locales/ta/reports.json";

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
        navbar: enNavbar,
        messaging: enMessaging,
        systemSettings: enSystemSettings,
        reports: enReports,
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
        navbar: siNavbar,
        messaging: siMessaging,
        systemSettings: siSystemSettings,
        reports: siReports,
      },
      ta: {
        payments: taPayments,
        billing: taBilling,
        meterReading: taMeterReading,
        inquiry: taInquiry,
        adminBlog: taAdminBlog,
        userManagement: taUserManagement,
        usage: taUsage,
        alerts: taAlerts,
        navbar: taNavbar,
        messaging: taMessaging,
        systemSettings: taSystemSettings,
        reports: taReports,
      },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;