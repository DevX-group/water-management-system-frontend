import { api } from '@/services/api';
import type { ActivityAuditDetail, ActivityAuditFilters, ActivityAuditPage } from '@/types/activityAudit';

const endpoint = '/admin/activity-logs';

export const getActivityLogs = async (filters: ActivityAuditFilters): Promise<ActivityAuditPage> => {
  const params = new URLSearchParams();
  params.set('page', String(Math.max(0, filters.page ?? 0)));
  params.set('size', String(Math.min(100, Math.max(1, filters.size ?? 20))));
  params.set('sortBy', filters.sortBy ?? 'occurredAt');
  params.set('sortDirection', filters.sortDirection ?? 'desc');

  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.action) params.set('action', filters.action);
  if (filters.entityType) params.set('entityType', filters.entityType);
  if (filters.actor?.trim()) params.set('actor', filters.actor.trim());
  if (filters.source) params.set('source', filters.source);

  const response = await api.get<ActivityAuditPage>(endpoint, { params });
  return response.data;
};

export const getActivityLogDetail = async (id: string): Promise<ActivityAuditDetail> => {
  const response = await api.get<ActivityAuditDetail>(`${endpoint}/${encodeURIComponent(id)}`);
  return response.data;
};
