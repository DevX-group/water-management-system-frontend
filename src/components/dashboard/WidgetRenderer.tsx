import React from 'react';
import type { WidgetComponentKey } from '@/types/dashboard';
import { WidgetUnavailable } from './WidgetUnavailable';

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
  CreditCard, Gauge, MessageSquare, HelpCircle, Send,
  BookOpen, TrendingUp, Settings, Users, LayoutDashboard,
  Search, MessageCircle,
} from 'lucide-react';

export interface WidgetRendererProps {
  componentKey: WidgetComponentKey;
  name: string;
  configJson?: string | null;
}

/**
 * Static allow-listed widget registry.
 *
 * Maps each {@link WidgetComponentKey} to a concrete React component.
 * Unknown keys render {@link WidgetUnavailable} as a safe fallback.
 *
 * SECURITY: This map is the sole authoritative source for widget rendering.
 * The backend componentKey value is treated as an opaque string that is
 * looked up here — it is never used as a dynamic import path or eval target.
 */
const WIDGET_REGISTRY: Record<
  WidgetComponentKey,
  React.ComponentType<{ configJson?: string | null }>
> = {
  // ── Customer ──────────────────────────────────────────────────────────────
  'customer-current-bill': () => <CurrentBillWidget />,
  'customer-outstanding': () => <OutstandingBalanceWidget />,
  'customer-pay-now': () => (
    <QuickLinkWidget
      label="Pay Now"
      description="Make a payment online"
      to="/customer/payments"
      icon={CreditCard}
      variant="primary"
    />
  ),
  'customer-usage-trend': () => <CustomerUsageTrendWidget />,
  'customer-recent-payments': () => <CustomerRecentPaymentsWidget />,
  'customer-notifications': () => <CustomerNotificationsWidget />,
  'customer-bank-slip-status': () => <BankSlipStatusWidget />,
  'customer-inquiries': () => (
    <QuickLinkWidget
      label="My Inquiries"
      description="View or submit support requests"
      to="/customer/inquiry"
      icon={HelpCircle}
      variant="accent"
    />
  ),

  // ── Meter Reader ──────────────────────────────────────────────────────────
  'meter-quick-entry': () => (
    <QuickLinkWidget
      label="Enter Meter Reading"
      description="Record a new meter reading"
      to="/admin/meter"
      icon={Gauge}
      variant="primary"
    />
  ),
  'meter-latest-reading': () => <LatestReadingWidget />,
  'meter-reading-history': () => <LatestReadingWidget />,

  // ── Shared Staff ──────────────────────────────────────────────────────────
  'internal-chat-link': () => (
    <QuickLinkWidget
      label="Internal Chat"
      description="Staff messaging"
      to="/admin/internal-chat"
      icon={MessageCircle}
      variant="accent"
    />
  ),

  // ── Customer Handler ──────────────────────────────────────────────────────
  'handler-pending-slips': () => <PendingSlipsWidget />,
  'handler-recent-payments': () => <AdminRecentPaymentsWidget />,
  'handler-open-inquiries': () => <OpenInquiriesWidget />,
  'handler-customer-search': () => (
    <QuickLinkWidget
      label="Customer Management"
      description="Search and manage customers"
      to="/admin/customers"
      icon={Search}
      variant="default"
    />
  ),

  // ── System Admin ──────────────────────────────────────────────────────────
  'admin-system-summary': () => <SystemSummaryWidget />,
  'admin-usage-chart': () => <SystemUsageChartWidget />,
  'admin-revenue-chart': () => <MonthlyRevenueChartWidget />,
  'admin-alerts': () => <ActiveAlertsWidget />,
  'admin-messaging-link': () => (
    <QuickLinkWidget
      label="Messaging"
      description="Send bulk SMS / notifications"
      to="/admin/messaging"
      icon={Send}
      variant="primary"
    />
  ),
  'admin-blogs-link': () => (
    <QuickLinkWidget
      label="Blog Management"
      description="Create and manage blog posts"
      to="/admin/blog"
      icon={BookOpen}
      variant="accent"
    />
  ),
  'admin-predictions-link': () => (
    <QuickLinkWidget
      label="Predictions"
      description="AI-powered usage forecasts"
      to="/admin/predictions"
      icon={TrendingUp}
      variant="accent"
    />
  ),

  // ── Super Admin ───────────────────────────────────────────────────────────
  'superadmin-admin-count': () => <SystemSummaryWidget />,
  'superadmin-region-summary': () => <RegionSummaryWidget />,
  'superadmin-widget-management-link': () => (
    <QuickLinkWidget
      label="Widget Management"
      description="Configure dashboard widgets"
      to="/admin/widget-management"
      icon={Settings}
      variant="default"
    />
  ),
  'superadmin-user-management-link': () => (
    <QuickLinkWidget
      label="Admin Management"
      description="Manage admin users and roles"
      to="/admin/users"
      icon={Users}
      variant="default"
    />
  ),

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
