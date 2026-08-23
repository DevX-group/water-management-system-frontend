import { useCallback, useEffect, useMemo, useState } from 'react';
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

const ACTIONS: AuditAction[] = ['USER_CREATED', 'USER_PROFILE_UPDATED', 'USER_STATUS_CHANGED', 'USER_ROLE_CHANGED', 'USER_ACTIVATED', 'PAYMENT_CREATED', 'PAYMENT_UPDATED', 'PAYMENT_STATUS_CHANGED', 'PAYMENT_DELETED', 'METER_READING_CREATED', 'METER_READING_UPDATED'];
const ENTITY_TYPES: AuditEntityType[] = ['USER', 'PAYMENT', 'METER_READING'];
const SOURCES: AuditSource[] = ['WEB', 'SYSTEM', 'MCP'];
const EMPTY_PAGE: ActivityAuditPage = { content: [], currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 20, last: true };
const INITIAL_FILTERS: ActivityAuditFilters = { page: 0, size: 20, sortBy: 'occurredAt', sortDirection: 'desc' };

const humanize = (value?: string | null) => value ? value.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Not available';
const formatDateTime = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value));
const shortId = (value: string) => value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;

const safeErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) return 'You are not authorized to view activity logs.';
    if (error.response?.status === 404) return 'The requested activity record was not found.';
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length <= 180) return message;
  }
  return fallback;
};

const renderChangedValue = (value: ChangedFieldValue) => {
  if (value === null) return 'None';
  if (typeof value === 'object') {
    const previous = value.previous === null || value.previous === undefined ? 'None' : String(value.previous);
    const next = value.new === null || value.new === undefined ? 'None' : String(value.new);
    return `${previous} → ${next}`;
  }
  return value === 'changed' ? 'Changed' : String(value);
};

const AuditDetailDialog = ({ id, open, onOpenChange }: { id: string | null; open: boolean; onOpenChange: (open: boolean) => void }) => {
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
      .catch(err => { if (active) setError(safeErrorMessage(err, 'Unable to load activity details.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, open]);

  const fields = detail?.changedFields ? Object.entries(detail.changedFields) : [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity details</DialogTitle>
          <DialogDescription>Read-only, sanitized information recorded by the system.</DialogDescription>
        </DialogHeader>
        {loading && <div className="space-y-3" aria-label="Loading activity details"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-24 w-full" /><Skeleton className="h-20 w-full" /></div>}
        {error && <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
        {detail && (
          <div className="space-y-5 text-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Occurred</dt><dd className="font-medium">{formatDateTime(detail.occurredAt)}</dd></div>
              <div><dt className="text-muted-foreground">Source</dt><dd><Badge variant="outline">{detail.source}</Badge></dd></div>
              <div><dt className="text-muted-foreground">Actor</dt><dd className="font-medium">{detail.actorDisplayName}</dd></div>
              <div><dt className="text-muted-foreground">Actor role</dt><dd>{humanize(detail.actorRole)}</dd></div>
              <div><dt className="text-muted-foreground">Action</dt><dd>{humanize(detail.action)}</dd></div>
              <div><dt className="text-muted-foreground">Entity type</dt><dd>{humanize(detail.entityType)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted-foreground">Entity ID</dt><dd className="break-all font-mono">{detail.entityId}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted-foreground">Summary</dt><dd>{detail.summary}</dd></div>
            </dl>
            <section aria-labelledby="changed-fields-heading">
              <h3 id="changed-fields-heading" className="mb-2 font-semibold">Changed fields</h3>
              {fields.length === 0 ? <p className="text-muted-foreground">No changed fields were recorded.</p> : (
                <div className="overflow-hidden rounded-md border">
                  <Table><TableHeader><TableRow><TableHead>Field</TableHead><TableHead>Safe value</TableHead></TableRow></TableHeader>
                    <TableBody>{fields.map(([field, value]) => <TableRow key={field}><TableCell className="font-medium">{humanize(field)}</TableCell><TableCell className="break-words">{renderChangedValue(value)}</TableCell></TableRow>)}</TableBody>
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
    try { setData(await getActivityLogs(filters)); }
    catch (err) { setError(safeErrorMessage(err, 'Unable to load activity logs. Check your connection and try again.')); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const hasActiveFilters = useMemo(() => Boolean(filters.from || filters.to || filters.action || filters.entityType || filters.actor || filters.source), [filters]);
  const setDraftValue = <K extends keyof ActivityAuditFilters>(key: K, value: ActivityAuditFilters[K]) => setDraft(current => ({ ...current, [key]: value }));
  const applyFilters = () => {
    const from = draft.from ? new Date(draft.from) : null;
    const to = draft.to ? new Date(draft.to) : null;
    if (from && to && from > to) { setValidationError('Start date and time must not be after the end date and time.'); return; }
    setValidationError('');
    setFilters({ ...draft, from: from?.toISOString(), to: to?.toISOString(), page: 0 });
  };
  const resetFilters = () => { setValidationError(''); setDraft(INITIAL_FILTERS); setFilters(INITIAL_FILTERS); };
  const changePage = (page: number) => setFilters(current => ({ ...current, page }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Activity Logs</h1><p className="mt-1 text-muted-foreground">Read-only system activity records for administrative review.</p></div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Filters</CardTitle><CardDescription>Narrow results without exposing private customer or payment information.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="audit-from">From (inclusive)</Label><Input id="audit-from" type="datetime-local" value={draft.from && !draft.from.endsWith('Z') ? draft.from : ''} disabled={loading} onChange={event => setDraftValue('from', event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="audit-to">To (inclusive)</Label><Input id="audit-to" type="datetime-local" value={draft.to && !draft.to.endsWith('Z') ? draft.to : ''} disabled={loading} onChange={event => setDraftValue('to', event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="audit-actor">Actor</Label><Input id="audit-actor" placeholder="Search display name" value={draft.actor ?? ''} disabled={loading} onChange={event => setDraftValue('actor', event.target.value)} onKeyDown={event => { if (event.key === 'Enter') applyFilters(); }} /></div>
            <FilterSelect label="Action" value={draft.action} disabled={loading} options={ACTIONS} onChange={value => setDraftValue('action', value as AuditAction | undefined)} />
            <FilterSelect label="Entity type" value={draft.entityType} disabled={loading} options={ENTITY_TYPES} onChange={value => setDraftValue('entityType', value as AuditEntityType | undefined)} />
            <FilterSelect label="Source" value={draft.source} disabled={loading} options={SOURCES} onChange={value => setDraftValue('source', value as AuditSource | undefined)} />
            <FilterSelect label="Sort by" value={draft.sortBy} disabled={loading} options={['occurredAt', 'action', 'entityType', 'source']} onChange={value => setDraftValue('sortBy', value as AuditSortField)} allLabel={undefined} />
            <FilterSelect label="Direction" value={draft.sortDirection} disabled={loading} options={['desc', 'asc']} onChange={value => setDraftValue('sortDirection', value as SortDirection)} allLabel={undefined} />
          </div>
          {validationError && <p role="alert" className="text-sm text-destructive">{validationError}</p>}
          <div className="flex flex-wrap gap-2"><Button onClick={applyFilters} disabled={loading}><Search className="mr-2 h-4 w-4" />Apply filters</Button><Button variant="outline" onClick={resetFilters} disabled={loading}><FilterX className="mr-2 h-4 w-4" />Reset</Button></div>
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle className="text-lg">Recorded activity</CardTitle><CardDescription>{data.totalElements.toLocaleString()} total record{data.totalElements === 1 ? '' : 's'}</CardDescription></CardHeader>
        <CardContent>
          {error ? <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-center"><p className="text-destructive">{error}</p><Button className="mt-4" variant="outline" onClick={load}>Try again</Button></div>
            : loading ? <div className="space-y-3" aria-label="Loading activity logs">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}</div>
            : data.content.length === 0 ? <div className="py-12 text-center"><p className="font-medium">{hasActiveFilters ? 'No activity matches these filters.' : 'No activity has been recorded yet.'}</p><p className="mt-1 text-sm text-muted-foreground">{hasActiveFilters ? 'Adjust or reset the filters to continue.' : 'New read-only records will appear here.'}</p></div>
            : <AuditTable items={data.content} onView={setSelectedId} />}

          {!error && data.totalPages > 0 && <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row"><p className="text-sm text-muted-foreground">Page {data.currentPage + 1} of {data.totalPages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={loading || data.currentPage === 0} onClick={() => changePage(data.currentPage - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button><Button variant="outline" size="sm" disabled={loading || data.last} onClick={() => changePage(data.currentPage + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button></div></div>}
        </CardContent>
      </Card>
      <AuditDetailDialog id={selectedId} open={Boolean(selectedId)} onOpenChange={open => { if (!open) setSelectedId(null); }} />
    </div>
  );
};

const FilterSelect = ({ label, value, options, disabled, onChange, allLabel = 'All' }: { label: string; value?: string; options: string[]; disabled: boolean; onChange: (value?: string) => void; allLabel?: string }) => (
  <div className="space-y-2"><Label>{label}</Label><Select value={value ?? '__all'} disabled={disabled} onValueChange={next => onChange(next === '__all' ? undefined : next)}><SelectTrigger aria-label={label}><SelectValue /></SelectTrigger><SelectContent>{allLabel !== undefined && <SelectItem value="__all">{allLabel}</SelectItem>}{options.map(option => <SelectItem key={option} value={option}>{humanize(option)}</SelectItem>)}</SelectContent></Select></div>
);

const AuditTable = ({ items, onView }: { items: ActivityAuditListItem[]; onView: (id: string) => void }) => (
  <div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow><TableHead>Occurred</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Summary</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Details</TableHead></TableRow></TableHeader>
    <TableBody>{items.map(item => <TableRow key={item.id}><TableCell className="min-w-44 whitespace-nowrap">{formatDateTime(item.occurredAt)}</TableCell><TableCell><div className="min-w-36"><p className="font-medium">{item.actorDisplayName}</p><p className="text-xs text-muted-foreground">{humanize(item.actorRole)}</p></div></TableCell><TableCell><Badge variant="secondary">{humanize(item.action)}</Badge></TableCell><TableCell><div><Badge variant="outline">{humanize(item.entityType)}</Badge><p className="mt-1 font-mono text-xs" title={item.entityId}>{shortId(item.entityId)}</p></div></TableCell><TableCell className="min-w-56 max-w-md">{item.summary}</TableCell><TableCell><Badge variant="outline">{item.source}</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" aria-label={`View details for activity ${item.id}`} onClick={() => onView(item.id)}><Eye className="mr-1 h-4 w-4" />View</Button></TableCell></TableRow>)}</TableBody>
  </Table></div>
);
