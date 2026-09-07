import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Eye, FilterX, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getActivityLogDetail, getActivityLogs } from '@/services/activityAuditService';
import type {
  ActivityAuditDetail,
  ActivityAuditFilters,
  ActivityAuditListItem,
  ActivityAuditPage,
  AuditAction,
  AuditEntityType,
  AuditSortField,
  AuditSource,
  ChangedFieldValue,
  SortDirection,
} from '@/types/activityAudit';

const ACTIONS: AuditAction[] = [
  'USER_CREATED',
  'USER_PROFILE_UPDATED',
  'USER_STATUS_CHANGED',
  'USER_ROLE_CHANGED',
  'USER_ACTIVATED',
  'PAYMENT_CREATED',
  'PAYMENT_UPDATED',
  'PAYMENT_STATUS_CHANGED',
  'PAYMENT_DELETED',
  'METER_READING_CREATED',
  'METER_READING_UPDATED',
];
const ENTITY_TYPES: AuditEntityType[] = ['USER', 'PAYMENT', 'METER_READING'];
const SOURCES: AuditSource[] = ['WEB', 'SYSTEM', 'MCP'];
const EMPTY_PAGE: ActivityAuditPage = { content: [], currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 20, last: true };
const INITIAL_FILTERS: ActivityAuditFilters = { page: 0, size: 20, sortBy: 'occurredAt', sortDirection: 'desc' };

const SI_MONTHS = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];
const TA_MONTHS = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const humanize = (value?: string | null) =>
  value ? value.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Not available';

const formatDate = (value?: string | null, lang?: string) => {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const day = String(d.getDate()).padStart(2, '0');

    if (lang?.startsWith('si')) {
      return `${year} ${SI_MONTHS[monthIndex]} ${day}`;
    }
    if (lang?.startsWith('ta')) {
      return `${year} ${TA_MONTHS[monthIndex]} ${day}`;
    }
    return `${EN_MONTHS[monthIndex]} ${day}, ${year}`;
  } catch {
    return value;
  }
};

const formatTime = (value?: string | null, lang?: string) => {
  if (!value) return '';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const isPM = hours >= 12;
    hours = hours % 12 || 12;
    const paddedHours = String(hours).padStart(2, '0');

    if (lang?.startsWith('si')) {
      const ampm = isPM ? 'ප.ව.' : 'පෙ.ව.';
      return `${ampm} ${paddedHours}:${minutes}:${seconds}`;
    }
    if (lang?.startsWith('ta')) {
      const ampm = isPM ? 'பி.ப' : 'மு.ப';
      return `${paddedHours}:${minutes}:${seconds} ${ampm}`;
    }
    const ampm = isPM ? 'PM' : 'AM';
    return `${paddedHours}:${minutes}:${seconds} ${ampm}`;
  } catch {
    return '';
  }
};

const formatDateTime = (value?: string | null, lang?: string) => {
  if (!value) return '-';
  const dateStr = formatDate(value, lang);
  const timeStr = formatTime(value, lang);
  return timeStr ? `${dateStr}, ${timeStr}` : dateStr;
};

const shortId = (value: string) => (value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value);

const safeErrorMessage = (error: unknown, fallback: string, t: (key: string) => string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) return t('detail.notAuthorized');
    if (error.response?.status === 404) return t('detail.notFound');
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length <= 180) return message;
  }
  return fallback;
};

const renderChangedValue = (value: ChangedFieldValue, t: (key: string) => string) => {
  if (value === null) return t('none');
  if (typeof value === 'object') {
    const previous = value.previous === null || value.previous === undefined ? t('none') : String(value.previous);
    const next = value.new === null || value.new === undefined ? t('none') : String(value.new);
    return `${previous} → ${next}`;
  }
  return value === 'changed' ? t('changed') : String(value);
};

const localizeSummary = (
  summary: string | undefined | null,
  action: AuditAction,
  entityType: AuditEntityType,
  t: (key: string, opts?: Record<string, unknown>) => string,
  lang?: string
) => {
  if (!summary || summary.trim() === '') {
    return `${t(`actions.${action}`, { defaultValue: humanize(action) })} - ${t(`entityTypes.${entityType}`, { defaultValue: humanize(entityType) })}`;
  }

  if (!lang?.startsWith('si') && !lang?.startsWith('ta')) {
    return summary;
  }

  const userCreatedMatch = summary.match(/^Created user (.+)$/i);
  if (userCreatedMatch) {
    return t('summaryTemplates.userCreated', { name: userCreatedMatch[1], defaultValue: summary });
  }

  const userProfileMatch = summary.match(/^(?:Updated user profile for|User profile updated for) (.+)$/i);
  if (userProfileMatch) {
    return t('summaryTemplates.userProfileUpdated', { name: userProfileMatch[1], defaultValue: summary });
  }

  const userStatusMatch = summary.match(/^(?:Changed user status to|User status changed to) (.+)$/i);
  if (userStatusMatch) {
    const rawStatus = userStatusMatch[1].trim();
    const localizedStatus = t(`statuses.${rawStatus}`, { defaultValue: rawStatus });
    return t('summaryTemplates.userStatusChanged', { status: localizedStatus, defaultValue: summary });
  }

  const userRoleMatch = summary.match(/^(?:Changed user role to|User role changed to) (.+)$/i);
  if (userRoleMatch) {
    const rawRole = userRoleMatch[1].trim();
    const localizedRole = t(`roles.${rawRole}`, { defaultValue: humanize(rawRole) });
    return t('summaryTemplates.userRoleChanged', { role: localizedRole, defaultValue: summary });
  }

  const userActivatedMatch = summary.match(/^(?:Activated user account|Activated user) (.+)$/i);
  if (userActivatedMatch) {
    return t('summaryTemplates.userActivated', { name: userActivatedMatch[1], defaultValue: summary });
  }

  const paymentCreatedMatch = summary.match(/^Created payment of (.+)$/i);
  if (paymentCreatedMatch) {
    return t('summaryTemplates.paymentCreated', { amount: paymentCreatedMatch[1], defaultValue: summary });
  }

  const paymentUpdatedMatch = summary.match(/^Updated payment (.+)$/i);
  if (paymentUpdatedMatch) {
    return t('summaryTemplates.paymentUpdated', { id: paymentUpdatedMatch[1], defaultValue: summary });
  }

  const paymentStatusMatch = summary.match(/^(?:Changed payment status to|Payment status changed to) (.+)$/i);
  if (paymentStatusMatch) {
    const rawStatus = paymentStatusMatch[1].trim();
    const localizedStatus = t(`statuses.${rawStatus}`, { defaultValue: rawStatus });
    return t('summaryTemplates.paymentStatusChanged', { status: localizedStatus, defaultValue: summary });
  }

  const paymentDeletedMatch = summary.match(/^Deleted payment (.+)$/i);
  if (paymentDeletedMatch) {
    return t('summaryTemplates.paymentDeleted', { id: paymentDeletedMatch[1], defaultValue: summary });
  }

  const meterReadingMatch = summary.match(/^Created meter reading of ([0-9.]+)(?: units)?/i);
  if (meterReadingMatch) {
    return t('summaryTemplates.meterReadingCreated', { reading: meterReadingMatch[1], defaultValue: summary });
  }

  const meterReadingUpdatedMatch = summary.match(/^Updated meter reading for (.+)$/i);
  if (meterReadingUpdatedMatch) {
    return t('summaryTemplates.meterReadingUpdated', { id: meterReadingUpdatedMatch[1], defaultValue: summary });
  }

  let localized = summary;
  const statusKeys = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING', 'COMPLETED', 'PAID', 'REJECTED', 'APPROVED', 'VERIFIED', 'FAILED', 'CANCELLED'];
  for (const st of statusKeys) {
    if (localized.includes(st)) {
      localized = localized.replace(new RegExp(st, 'g'), t(`statuses.${st}`, { defaultValue: st }));
    }
  }

  const roleKeys = ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'CUSTOMER_HANDLER', 'METER_READER', 'CUSTOMER'];
  for (const rk of roleKeys) {
    if (localized.includes(rk)) {
      localized = localized.replace(new RegExp(rk, 'g'), t(`roles.${rk}`, { defaultValue: humanize(rk) }));
    }
  }

  return localized;
};

const AuditDetailDialog = ({ id, open, onOpenChange }: { id: string | null; open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { t, i18n } = useTranslation('activityLog');
  const [detail, setDetail] = useState<ActivityAuditDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !id) return;
    let active = true;
    setLoading(true);
    setError('');
    setDetail(null);
    getActivityLogDetail(id)
      .then(data => { if (active) setDetail(data); })
      .catch(err => { if (active) setError(safeErrorMessage(err, t('detail.loadError'), t)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, open, t]);

  const fields = detail?.changedFields ? Object.entries(detail.changedFields) : [];
  const getActionLabel = (action: string) => t(`actions.${action}`, { defaultValue: humanize(action) });
  const getEntityLabel = (entityType: string) => t(`entityTypes.${entityType}`, { defaultValue: humanize(entityType) });
  const getSourceLabel = (source: string) => t(`sources.${source}`, { defaultValue: source });
  const getRoleLabel = (role?: string | null) => (role ? t(`roles.${role}`, { defaultValue: humanize(role) }) : t('notAvailable'));
  const getFieldLabel = (field: string) => t(`fields.${field}`, { defaultValue: humanize(field) });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('detail.title')}</DialogTitle>
          <DialogDescription>{t('detail.subtitle')}</DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="space-y-3" aria-label={t('detail.title')}>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {error && <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
        {detail && (
          <div className="space-y-5 text-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">{t('detail.occurred')}</dt>
                <dd className="font-medium">{formatDateTime(detail.occurredAt, i18n.language)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('detail.source')}</dt>
                <dd><Badge variant="outline">{getSourceLabel(detail.source)}</Badge></dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('detail.actor')}</dt>
                <dd className="font-medium">{detail.actorDisplayName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('detail.actorRole')}</dt>
                <dd>{getRoleLabel(detail.actorRole)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('detail.action')}</dt>
                <dd>{getActionLabel(detail.action)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('detail.entityType')}</dt>
                <dd>{getEntityLabel(detail.entityType)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">{t('detail.entityId')}</dt>
                <dd className="break-all font-mono">{detail.entityId}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">{t('detail.summary')}</dt>
                <dd className="font-medium text-foreground">
                  {localizeSummary(detail.summary, detail.action, detail.entityType, t, i18n.language)}
                </dd>
              </div>
            </dl>
            <section aria-labelledby="changed-fields-heading">
              <h3 id="changed-fields-heading" className="mb-2 font-semibold">{t('detail.changedFields')}</h3>
              {fields.length === 0 ? (
                <p className="mt-1 text-muted-foreground">{t('detail.noChangedFields')}</p>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('detail.fieldColumn')}</TableHead>
                        <TableHead>{t('detail.valueColumn')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map(([field, value]) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium">{getFieldLabel(field)}</TableCell>
                          <TableCell className="break-words">{renderChangedValue(value, t)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const ActivityAuditLogsPage = () => {
  const { t, i18n } = useTranslation('activityLog');
  const [draft, setDraft] = useState<ActivityAuditFilters>(INITIAL_FILTERS);
  const [filters, setFilters] = useState<ActivityAuditFilters>(INITIAL_FILTERS);
  const [data, setData] = useState<ActivityAuditPage>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getActivityLogs(filters));
    } catch (err) {
      setError(safeErrorMessage(err, t('loadError'), t));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  useEffect(() => {
    load();
  }, [load]);

  const hasActiveFilters = useMemo(
    () => Boolean(filters.from || filters.to || filters.action || filters.entityType || filters.actor || filters.source),
    [filters]
  );
  const setDraftValue = <K extends keyof ActivityAuditFilters>(key: K, value: ActivityAuditFilters[K]) =>
    setDraft(current => ({ ...current, [key]: value }));

  const applyFilters = () => {
    const from = draft.from ? new Date(draft.from) : null;
    const to = draft.to ? new Date(draft.to) : null;
    if (from && to && from > to) {
      setValidationError(t('filters.validationError'));
      return;
    }
    setValidationError('');
    setFilters({ ...draft, from: from?.toISOString(), to: to?.toISOString(), page: 0 });
  };

  const resetFilters = () => {
    setValidationError('');
    setDraft(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
  };

  const changePage = (page: number) => setFilters(current => ({ ...current, page }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('page.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('filters.title')}</CardTitle>
          <CardDescription>{t('filters.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="audit-from">{t('filters.from')}</Label>
              <Input
                id="audit-from"
                type="datetime-local"
                value={draft.from && !draft.from.endsWith('Z') ? draft.from : ''}
                disabled={loading}
                onChange={event => setDraftValue('from', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-to">{t('filters.to')}</Label>
              <Input
                id="audit-to"
                type="datetime-local"
                value={draft.to && !draft.to.endsWith('Z') ? draft.to : ''}
                disabled={loading}
                onChange={event => setDraftValue('to', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-actor">{t('filters.actor')}</Label>
              <Input
                id="audit-actor"
                placeholder={t('filters.actorPlaceholder')}
                value={draft.actor ?? ''}
                disabled={loading}
                onChange={event => setDraftValue('actor', event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') applyFilters();
                }}
              />
            </div>
            <FilterSelect
              label={t('filters.action')}
              value={draft.action}
              disabled={loading}
              options={ACTIONS}
              onChange={value => setDraftValue('action', value as AuditAction | undefined)}
              allLabel={t('filters.all')}
              getOptionLabel={opt => t(`actions.${opt}`, { defaultValue: humanize(opt) })}
            />
            <FilterSelect
              label={t('filters.entityType')}
              value={draft.entityType}
              disabled={loading}
              options={ENTITY_TYPES}
              onChange={value => setDraftValue('entityType', value as AuditEntityType | undefined)}
              allLabel={t('filters.all')}
              getOptionLabel={opt => t(`entityTypes.${opt}`, { defaultValue: humanize(opt) })}
            />
            <FilterSelect
              label={t('filters.source')}
              value={draft.source}
              disabled={loading}
              options={SOURCES}
              onChange={value => setDraftValue('source', value as AuditSource | undefined)}
              allLabel={t('filters.all')}
              getOptionLabel={opt => t(`sources.${opt}`, { defaultValue: opt })}
            />
            <FilterSelect
              label={t('filters.sortBy')}
              value={draft.sortBy}
              disabled={loading}
              options={['occurredAt', 'action', 'entityType', 'source']}
              onChange={value => setDraftValue('sortBy', value as AuditSortField)}
              allLabel={undefined}
              getOptionLabel={opt => t(`sortFields.${opt}`, { defaultValue: humanize(opt) })}
            />
            <FilterSelect
              label={t('filters.direction')}
              value={draft.sortDirection}
              disabled={loading}
              options={['desc', 'asc']}
              onChange={value => setDraftValue('sortDirection', value as SortDirection)}
              allLabel={undefined}
              getOptionLabel={opt => t(`sortDirections.${opt}`, { defaultValue: humanize(opt) })}
            />
          </div>
          {validationError && <p role="alert" className="text-sm text-destructive">{validationError}</p>}
          <div className="flex flex-wrap gap-2">
            <Button onClick={applyFilters} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {t('filters.apply')}
            </Button>
            <Button variant="outline" onClick={resetFilters} disabled={loading}>
              <FilterX className="mr-2 h-4 w-4" />
              {t('filters.reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('results.title')}</CardTitle>
          <CardDescription>{t('results.totalRecords', { count: data.totalElements })}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-center">
              <p className="text-destructive">{error}</p>
              <Button className="mt-4" variant="outline" onClick={load}>
                {t('results.tryAgain')}
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-3" aria-label={t('page.title')}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : data.content.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium">{hasActiveFilters ? t('results.emptyFiltered') : t('results.emptyDefault')}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasActiveFilters ? t('results.emptyFilteredHint') : t('results.emptyDefaultHint')}
              </p>
            </div>
          ) : (
            <AuditTable items={data.content} onView={setSelectedId} t={t} lang={i18n.language} />
          )}

          {!error && data.totalPages > 0 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                {t('results.page', { current: data.currentPage + 1, total: data.totalPages })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading || data.currentPage === 0}
                  onClick={() => changePage(data.currentPage - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  {t('results.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading || data.last}
                  onClick={() => changePage(data.currentPage + 1)}
                >
                  {t('results.next')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <AuditDetailDialog id={selectedId} open={Boolean(selectedId)} onOpenChange={open => { if (!open) setSelectedId(null); }} />
    </div>
  );
};

const FilterSelect = ({
  label,
  value,
  options,
  disabled,
  onChange,
  allLabel,
  getOptionLabel,
}: {
  label: string;
  value?: string;
  options: string[];
  disabled: boolean;
  onChange: (value?: string) => void;
  allLabel?: string;
  getOptionLabel?: (opt: string) => string;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={value ?? '__all'} disabled={disabled} onValueChange={next => onChange(next === '__all' ? undefined : next)}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {allLabel !== undefined && <SelectItem value="__all">{allLabel}</SelectItem>}
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {getOptionLabel ? getOptionLabel(option) : humanize(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const AuditTable = ({
  items,
  onView,
  t,
  lang,
}: {
  items: ActivityAuditListItem[];
  onView: (id: string) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
  lang?: string;
}) => (
  <div className="overflow-hidden rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.occurred')}</TableHead>
          <TableHead>{t('table.actor')}</TableHead>
          <TableHead>{t('table.action')}</TableHead>
          <TableHead>{t('table.entity')}</TableHead>
          <TableHead>{t('table.summary')}</TableHead>
          <TableHead>{t('table.source')}</TableHead>
          <TableHead className="text-right">{t('table.details')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell className="min-w-44 whitespace-nowrap">
              <div className="font-medium text-sm">{formatDate(item.occurredAt, lang)}</div>
              <div className="text-xs text-muted-foreground">{formatTime(item.occurredAt, lang)}</div>
            </TableCell>
            <TableCell>
              <div className="min-w-36">
                <p className="font-medium">{item.actorDisplayName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.actorRole ? t(`roles.${item.actorRole}`, { defaultValue: humanize(item.actorRole) }) : t('notAvailable')}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {t(`actions.${item.action}`, { defaultValue: humanize(item.action) })}
              </Badge>
            </TableCell>
            <TableCell>
              <div>
                <Badge variant="outline">
                  {t(`entityTypes.${item.entityType}`, { defaultValue: humanize(item.entityType) })}
                </Badge>
                <p className="mt-1 font-mono text-xs" title={item.entityId}>
                  {shortId(item.entityId)}
                </p>
              </div>
            </TableCell>
            <TableCell className="min-w-56 max-w-md text-sm text-foreground/90 leading-relaxed">
              {localizeSummary(item.summary, item.action, item.entityType, t, lang)}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {t(`sources.${item.source}`, { defaultValue: item.source })}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" aria-label={t('table.viewAriaLabel', { id: item.id })} onClick={() => onView(item.id)}>
                <Eye className="mr-1 h-4 w-4" />
                {t('table.view')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
