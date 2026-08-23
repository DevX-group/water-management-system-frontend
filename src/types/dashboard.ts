// Dashboard & Widget type definitions

export type WidgetType =
  | 'STAT'
  | 'CHART'
  | 'TABLE'
  | 'LIST'
  | 'ALERT'
  | 'ACTION'
  | 'PROGRESS'
  | 'ANNOUNCEMENT';

/**
 * The set of component keys the WidgetRenderer allows.
 * Must stay in sync with the backend WidgetService.ALLOWED_COMPONENT_KEYS list.
 */
export type WidgetComponentKey =
  | 'customer-current-bill'
  | 'customer-outstanding'
  | 'customer-pay-now'
  | 'customer-usage-trend'
  | 'customer-recent-payments'
  | 'customer-notifications'
  | 'customer-bank-slip-status'
  | 'customer-inquiries'
  | 'meter-quick-entry'
  | 'meter-latest-reading'
  | 'meter-reading-history'
  | 'internal-chat-link'
  | 'handler-pending-slips'
  | 'handler-recent-payments'
  | 'handler-open-inquiries'
  | 'handler-customer-search'
  | 'admin-system-summary'
  | 'admin-usage-chart'
  | 'admin-revenue-chart'
  | 'admin-alerts'
  | 'admin-messaging-link'
  | 'admin-blogs-link'
  | 'admin-predictions-link'
  | 'superadmin-admin-count'
  | 'superadmin-region-summary'
  | 'superadmin-widget-management-link'
  | 'superadmin-user-management-link'
  | 'quick-link';

export interface DashboardWidgetConfig {
  id: number;
  widgetId: number;
  widgetKey: string;
  name: string;
  description?: string;
  widgetType: WidgetType;
  /** Safe allow-listed frontend component registry key */
  componentKey: WidgetComponentKey;
  position: number;
  colSpan: number;
  rowSpan: number;
  visible: boolean;
  /** Optional JSON string for widget-level configuration */
  configJson?: string | null;
}

export interface DashboardConfig {
  dashboardId: number;
  dashboardKey: string;
  name: string;
  assignedRole: string;
  version: number;
  widgets: DashboardWidgetConfig[];
}

export interface WidgetDefinition {
  id: number;
  widgetKey: string;
  name: string;
  description?: string;
  widgetType: WidgetType;
  componentKey: WidgetComponentKey;
  active: boolean;
  allowedRoles: string[];
  defaultColSpan: number;
  defaultRowSpan: number;
  version: number;
}

export interface SystemDashboardSummary {
  period: string;
  customerCount: number;
  activeAdminCount: number;
  pendingSlipCount: number;
  pendingSlipAmount: number;
  outstandingBillCount: number;
  outstandingAmount: number;
  paidThisMonth: number;
  openInquiryCount: number;
  activeAlertCount: number;
}

export interface CustomerDashboardSummary {
  subscriptionNumber: string;
  accountHolderName: string;
  connectionType: string;
  totalPendingBalance: number;
  unpaidBillCount: number;
  pendingSlipCount: number;
  openInquiryCount: number;
}

export interface DashboardLayoutPlacement {
  widgetId: number;
  colSpan?: number;
  rowSpan?: number;
  visible?: boolean;
  configJson?: string;
}
