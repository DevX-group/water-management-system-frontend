import '@/index.css';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MessageHistoryRow, FailedRecipient } from '@/types/messaging';
import { useTranslation } from 'react-i18next';

interface MessageDetailsDialogProps {
  row:          MessageHistoryRow | null;
  open:         boolean;
  onClose:      () => void;
  onViewFailed: (id: string) => void;
}

export const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  row, open, onClose, onViewFailed,
}) => {
  const { t } = useTranslation('messaging');
  // Details modal for a single sent message.
  if (!row) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>{t('historyDetails.title')}</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t('historyDetails.message'), value: t(`messageNames.${row.messageName}`, { defaultValue: row.messageName }) },
              { label: t('historyDetails.type'), value: t(`scheduleTypes.${row.type}`, { defaultValue: row.type }) },
              { label: t('historyDetails.date'), value: row.date },
              { label: t('historyDetails.time'), value: row.time },
              { label: t('historyDetails.recipients'), value: String(row.recipients) },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-muted-foreground">{label}</div>
                <div className="font-medium">{value}</div>
              </div>
            ))}
            <div className="col-span-2 grid grid-cols-2 gap-3">
              <div><div className="text-muted-foreground">{t('historyDetails.emailSuccessRate')}</div><div className="font-medium">{row.emailSuccessRate}%</div></div>
              <div><div className="text-muted-foreground">{t('historyDetails.smsSuccessRate')}</div><div className="font-medium">{row.smsSuccessRate}%</div></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('historyDetails.totalEmailsSent'), value: row.totalEmailsSent },
              { label: t('historyDetails.totalEmailsFailed'), value: row.totalEmailsFailed },
              { label: t('historyDetails.totalEmailsDelivered'), value: row.totalEmailsDelivered },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border p-3">
                <div className="text-muted-foreground">{label}</div>
                <div className="text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('historyDetails.totalSmsSent'), value: row.totalSmsSent },
              { label: t('historyDetails.totalSmsFailed'), value: row.totalSmsFailed },
              { label: t('historyDetails.totalSmsDelivered'), value: row.totalSmsDelivered },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border p-3">
                <div className="text-muted-foreground">{label}</div>
                <div className="text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewFailed(row.id)}>
            {t('historyDetails.viewFailedRecipients')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FailedRecipientsDialogProps {
  row:              MessageHistoryRow | null;
  open:             boolean;
  failedRecipients: FailedRecipient[];
  page:             number;
  size:             number;
  totalPages:       number;
  totalElements:    number;
  onPageChange:     (page: number) => void;
  onSizeChange:     (size: number) => void;
  loadingFor:       string | null;
  failuresError:    string | null;
  onClose:          () => void;
  onBack:           (id: string) => void;
}

export const FailedRecipientsDialog: React.FC<FailedRecipientsDialogProps> = ({
  row,
  open,
  failedRecipients,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
  loadingFor,
  failuresError,
  onClose,
  onBack,
}) => {
  const { t } = useTranslation('messaging');
  // Modal that lists failed recipients with independent paging.
  if (!row) return null;
  const failures = failedRecipients;
  const canGoBack = page > 0;
  const canGoNext = page + 1 < totalPages;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader><DialogTitle>{t('failedRecipients.title')}</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <Button variant="outline" size="sm" onClick={() => onBack(row.id)}>{t('failedRecipients.backToDetails')}</Button>
          {failuresError && <div className="text-sm text-red-500">{failuresError}</div>}
          {loadingFor === row.id && <div className="text-sm text-muted-foreground">{t('failedRecipients.loading')}</div>}
          {failures?.length === 0 && <div className="text-sm text-muted-foreground">{t('failedRecipients.empty')}</div>}
          {failures?.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('failedRecipients.table.customer')}</TableHead>
                    <TableHead>{t('failedRecipients.table.subscription')}</TableHead>
                    <TableHead>{t('failedRecipients.table.phone')}</TableHead>
                    <TableHead>{t('failedRecipients.table.email')}</TableHead>
                    <TableHead className="text-right">{t('failedRecipients.table.smsFailed')}</TableHead>
                    <TableHead className="text-right">{t('failedRecipients.table.emailFailed')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failures.map((f) => (
                    <TableRow key={`${f.subscriptionNumber}-${f.smsFailed}-${f.emailFailed}`}>
                      <TableCell className="font-medium">{f.customerName || '-'}</TableCell>
                      <TableCell>{f.subscriptionNumber || '-'}</TableCell>
                      <TableCell>{f.phoneNumber || '-'}</TableCell>
                      <TableCell>{f.email || '-'}</TableCell>
                      <TableCell className="text-right">{f.smsFailed ? t('common.yes') : t('common.no')}</TableCell>
                      <TableCell className="text-right">{f.emailFailed ? t('common.yes') : t('common.no')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-3 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span>{t('common.itemsPerPage')}</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2"
                value={size}
                onChange={event => onSizeChange(Number(event.target.value))}
              >
                {[5, 10, 20].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground">
                {totalElements > 0
                  ? t('common.itemsCount', { start: page * size + 1, end: Math.min((page + 1) * size, totalElements), total: totalElements })
                  : t('common.zeroItems')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={!canGoBack}>
                {t('common.previous')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('common.pageOf', { current: totalPages === 0 ? 0 : page + 1, total: Math.max(totalPages, 1) })}
              </span>
              <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={!canGoNext}>
                {t('common.next')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
