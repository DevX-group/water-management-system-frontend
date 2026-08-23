export type AuditAction =
  | 'USER_CREATED'
  | 'USER_PROFILE_UPDATED'
  | 'USER_STATUS_CHANGED'
  | 'USER_ROLE_CHANGED'
  | 'USER_ACTIVATED'
  | 'PAYMENT_CREATED'
  | 'PAYMENT_UPDATED'
  | 'PAYMENT_STATUS_CHANGED'
  | 'PAYMENT_DELETED'
  | 'METER_READING_CREATED'
  | 'METER_READING_UPDATED';

export type AuditEntityType = 'USER' | 'PAYMENT' | 'METER_READING';
export type AuditSource = 'WEB' | 'SYSTEM' | 'MCP';
export type AuditActorRole = 'SUPER_ADMIN' | 'SYSTEM_ADMIN' | 'CUSTOMER_HANDLER' | 'METER_READER' | 'CUSTOMER';
export type AuditSortField = 'occurredAt' | 'action' | 'entityType' | 'source';
export type SortDirection = 'asc' | 'desc';
export type ChangedFieldValue = string | number | boolean | null | { previous?: unknown; new?: unknown };

export interface ActivityAuditListItem {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  actorDisplayName: string;
  actorRole: AuditActorRole | null;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  summary: string;
  source: AuditSource;
}

export interface ActivityAuditDetail extends ActivityAuditListItem {
  changedFields: Record<string, ChangedFieldValue> | null;
}

export interface ActivityAuditPage {
  content: ActivityAuditListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  last: boolean;
}

export interface ActivityAuditFilters {
  page?: number;
  size?: number;
  sortBy?: AuditSortField;
  sortDirection?: SortDirection;
  from?: string;
  to?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  actor?: string;
  source?: AuditSource;
}
