import React from 'react';
import type { WidgetComponentKey } from '@/types/dashboard';
import { WidgetUnavailable } from './WidgetUnavailable';
import { useTranslation } from 'react-i18next';

// Customer widgets
import { CurrentBillWidget } from './widgets/CurrentBillWidget';
import { OutstandingBalanceWidget } from './widgets/OutstandingBalanceWidget';
import { CustomerRecentPaymentsWidget } from './widgets/CustomerRecentPaymentsWidget';
import { CustomerNotificationsWidget } from './widgets/CustomerNotificationsWidget';
import { BankSlipStatusWidget } from './widgets/BankSlipStatusWidget';
import { CustomerUsageTrendWidget } from './widgets/CustomerUsageTrendWidget';

// Admin shared widgets
import { SystemSummaryWidget } from './widgets/SystemSummaryWidget';
import { ActiveAlertsWidget } from './widgets/ActiveAlertsWidget';
import { SystemUsageChartWidget } from './widgets/SystemUsageChartWidget';
import { MonthlyRevenueChartWidget } from './widgets/MonthlyRevenueChartWidget';
import { PendingSlipsWidget } from './widgets/PendingSlipsWidget';
import { AdminRecentPaymentsWidget } from './widgets/AdminRecentPaymentsWidget';
import { OpenInquiriesWidget } from './widgets/OpenInquiriesWidget';
import { LatestReadingWidget } from './widgets/LatestReadingWidget';
import { RegionSummaryWidget } from './widgets/RegionSummaryWidget';

// Quick link / action widget
import { QuickLinkWidget } from './widgets/QuickLinkWidget';
import {
  CreditCard, Gauge, HelpCircle, Send,
  BookOpen, TrendingUp, Settings, Users, LayoutDashboard,
  Search, MessageCircle,
} from 'lucide-react';

export interface WidgetRendererProps {
  componentKey: WidgetComponentKey;
  name: string;
  configJson?: string | null;
}

// Localized Quick Link Wrappers
const PayNowQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.payNow.label')}
      description={t('quickLinks.payNow.description')}
      to="/customer/payments"
      icon={CreditCard}
      variant="primary"
    />
  );
};

const CustomerInquiriesQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.myInquiries.label')}
      description={t('quickLinks.myInquiries.description')}
      to="/customer/inquiry"
      icon={HelpCircle}
      variant="accent"
    />
  );
};

const MeterQuickEntryQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.meterEntry.label')}
      description={t('quickLinks.meterEntry.description')}
      to="/admin/meter"
      icon={Gauge}
      variant="primary"
    />
  );
};

const InternalChatQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.internalChat.label')}
      description={t('quickLinks.internalChat.description')}
      to="/admin/internal-chat"
      icon={MessageCircle}
      variant="accent"
    />
  );
};

const CustomerSearchQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.customerSearch.label')}
      description={t('quickLinks.customerSearch.description')}
      to="/admin/users"
      icon={Search}
      variant="default"
    />
  );
};

const MessagingQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.messaging.label')}
      description={t('quickLinks.messaging.description')}
      to="/admin/messaging"
      icon={Send}
      variant="primary"
    />
  );
};

const BlogsQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.blogs.label')}
      description={t('quickLinks.blogs.description')}
      to="/admin/blog"
      icon={BookOpen}
      variant="accent"
    />
  );
};

const PredictionsQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.predictions.label')}
      description={t('quickLinks.predictions.description')}
      to="/admin/predictions"
      icon={TrendingUp}
      variant="accent"
    />
  );
};

const WidgetManagementQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.widgetManagement.label')}
      description={t('quickLinks.widgetManagement.description')}
      to="/admin/widget-management"
      icon={Settings}
      variant="default"
    />
  );
};

const AdminManagementQuickLink = () => {
  const { t } = useTranslation('widgetManagement');
  return (
    <QuickLinkWidget
      label={t('quickLinks.adminManagement.label')}
      description={t('quickLinks.adminManagement.description')}
      to="/admin/users"
      icon={Users}
      variant="default"
    />
  );
};

/**
 * Static allow-listed widget registry.
 */
const WIDGET_REGISTRY: Record<
  WidgetComponentKey,
  React.ComponentType<{ configJson?: string | null }>
> = {
  // ── Customer ──────────────────────────────────────────────────────────────
  'customer-current-bill': () => <CurrentBillWidget />,
  'customer-outstanding': () => <OutstandingBalanceWidget />,
  'customer-pay-now': () => <PayNowQuickLink />,
  'customer-usage-trend': () => <CustomerUsageTrendWidget />,
  'customer-recent-payments': () => <CustomerRecentPaymentsWidget />,
  'customer-notifications': () => <CustomerNotificationsWidget />,
  'customer-bank-slip-status': () => <BankSlipStatusWidget />,
  'customer-inquiries': () => <CustomerInquiriesQuickLink />,

  // ── Meter Reader ──────────────────────────────────────────────────────────
  'meter-quick-entry': () => <MeterQuickEntryQuickLink />,
  'meter-latest-reading': () => <LatestReadingWidget />,
  'meter-reading-history': () => <LatestReadingWidget />,

  // ── Shared Staff ──────────────────────────────────────────────────────────
  'internal-chat-link': () => <InternalChatQuickLink />,

  // ── Customer Handler ──────────────────────────────────────────────────────
  'handler-pending-slips': () => <PendingSlipsWidget />,
  'handler-recent-payments': () => <AdminRecentPaymentsWidget />,
  'handler-open-inquiries': () => <OpenInquiriesWidget />,
  'handler-customer-search': () => <CustomerSearchQuickLink />,

  // ── System Admin ──────────────────────────────────────────────────────────
  'admin-system-summary': () => <SystemSummaryWidget />,
  'admin-usage-chart': () => <SystemUsageChartWidget />,
  'admin-revenue-chart': () => <MonthlyRevenueChartWidget />,
  'admin-alerts': () => <ActiveAlertsWidget />,
  'admin-messaging-link': () => <MessagingQuickLink />,
  'admin-blogs-link': () => <BlogsQuickLink />,
  'admin-predictions-link': () => <PredictionsQuickLink />,

  // ── Super Admin ───────────────────────────────────────────────────────────
  'superadmin-admin-count': () => <SystemSummaryWidget />,
  'superadmin-region-summary': () => <RegionSummaryWidget />,
  'superadmin-widget-management-link': () => <WidgetManagementQuickLink />,
  'superadmin-user-management-link': () => <AdminManagementQuickLink />,

  // ── Generic ───────────────────────────────────────────────────────────────
  'quick-link': ({ configJson }) => {
    let cfg: { label?: string; to?: string; description?: string } = {};
    try { cfg = configJson ? JSON.parse(configJson) : {}; } catch {}
    return (
      <QuickLinkWidget
        label={cfg.label ?? 'Quick Link'}
        description={cfg.description}
        to={cfg.to ?? '/'}
        icon={LayoutDashboard}
        variant="default"
      />
    );
  },
};

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ componentKey, name, configJson }) => {
  const Component = WIDGET_REGISTRY[componentKey];

  if (!Component) {
    return <WidgetUnavailable widgetKey={componentKey} reason={`Widget "${name}" is not available.`} />;
  }

  return <Component configJson={configJson} />;
};
