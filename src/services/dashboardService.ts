import { api } from '@/services/api';
import type {
  DashboardConfig,
  DashboardLayoutPlacement,
  SystemDashboardSummary,
  CustomerDashboardSummary,
  WidgetDefinition,
} from '@/types/dashboard';

/**
 * Returns the active dashboard configuration for the authenticated user's role.
 * The backend derives the role from the JWT and returns the appropriate dashboard.
 */
export const getDashboardConfig = async (): Promise<DashboardConfig> => {
  const res = await api.get('/dashboards/me');
  return res.data;
};

/**
 * Returns the active dashboard configuration for a specific role.
 * Restricted to SUPER_ADMIN.
 */
export const getDashboardConfigByRole = async (role: string): Promise<DashboardConfig> => {
  const res = await api.get(`/dashboards/role/${role}`);
  return res.data;
};

/**
 * Returns system-wide aggregated statistics.
 * Restricted to SUPER_ADMIN and SYSTEM_ADMIN.
 */
export const getSystemSummary = async (): Promise<SystemDashboardSummary> => {
  const res = await api.get('/dashboards/summary/system');
  return res.data;
};

/**
 * Returns customer-scoped dashboard statistics.
 * Backend enforces ownership — customers can only see their own data.
 */
export const getCustomerSummary = async (): Promise<CustomerDashboardSummary> => {
  const res = await api.get('/dashboards/summary/customer');
  return res.data;
};

// ── Widget Catalog (Super Admin) ────────────────────────────────────────────

export const getWidgetCatalog = async (): Promise<WidgetDefinition[]> => {
  const res = await api.get('/widgets/catalog');
  return res.data;
};

export const createWidget = async (
  payload: Omit<WidgetDefinition, 'id' | 'version'>
): Promise<WidgetDefinition> => {
  const res = await api.post('/widgets', payload);
  return res.data;
};

export const updateWidget = async (
  id: number,
  payload: Partial<Omit<WidgetDefinition, 'id' | 'version'>>
): Promise<WidgetDefinition> => {
  const res = await api.put(`/widgets/${id}`, payload);
  return res.data;
};

export const deactivateWidget = async (id: number): Promise<void> => {
  await api.delete(`/widgets/${id}`);
};

export const addWidgetToRole = async (role: string, widgetId: number): Promise<void> => {
  await api.post(`/dashboards/role/${role}/widgets/${widgetId}`);
};

export const removeWidgetFromRole = async (role: string, widgetId: number): Promise<void> => {
  await api.delete(`/dashboards/role/${role}/widgets/${widgetId}`);
};

/**
 * Replaces the full widget layout for a dashboard.
 * @param dashboardId - The dashboard to update
 * @param placements - Ordered array of widget placements
 */
export const updateDashboardLayout = async (
  dashboardId: number,
  placements: DashboardLayoutPlacement[]
): Promise<void> => {
  await api.put(`/dashboards/${dashboardId}/widgets`, placements);
};
