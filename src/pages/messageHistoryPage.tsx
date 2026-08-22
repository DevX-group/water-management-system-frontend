import '@/index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageDetailsDialog, FailedRecipientsDialog } from '@/components/messaging/MessageHistoryDialogs';
import { useTranslation } from 'react-i18next';

import { useMessageHistory } from '@/hooks/useMessageHistory';

export const MessageHistoryPage = () => {
  const { t } = useTranslation('messaging');
  const navigate = useNavigate();
  // Hook centralizes paging, dialog state, and API calls for history/failures.
  const {
    rows,
    page,
    size,
    totalPages,
    totalElements,
    historyError,
    setPage,
    setSize,
    failedRecipients,
    failuresPage,
    failuresSize,
    failuresTotalPages,
    failuresTotalElements,
    setFailuresPage,
    setFailuresSize,
    loadingFailuresFor,
    failuresError,
    openDetailsId,
    openFailuresId,
    selectedRow,
    selectedFailedRow,
    handleViewFailed,
    closeDetails,
    closeFailures,
    openDetails,
    backToDetails
  } = useMessageHistory();

  // Pagination controls for the main history table.
  const canGoBack = page > 0;
  const canGoNext = page + 1 < totalPages;

  return (
    <div className="space-y-6 p-6 pb-24 px-0">
      <div>
        <Button variant="outline" className="h-auto py-2 px-4 whitespace-normal" onClick={() => navigate('/admin/messaging/scheduled')}>
          {t('history.backButton')}
        </Button>
      </div>

      <Card>
        <CardContent>
          {historyError && (
            <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {historyError}
            </div>
          )}
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('history.table.messageName')}</TableHead>
                  <TableHead>{t('history.table.type')}</TableHead>
                  <TableHead>{t('history.table.date')}</TableHead>
                  <TableHead>{t('history.table.time')}</TableHead>
                  <TableHead className="text-right">{t('history.table.emailSuccess')}</TableHead>
                  <TableHead className="text-right">{t('history.table.smsSuccess')}</TableHead>
                  <TableHead className="text-right">{t('history.table.details')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{t(`messageNames.${row.messageName}`, { defaultValue: row.messageName })}</TableCell>
                    <TableCell>{t(`scheduleTypes.${row.type}`, { defaultValue: row.type })}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell className="text-right">{row.emailSuccessRate}%</TableCell>
                    <TableCell className="text-right">{row.smsSuccessRate}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetails(row.id)}>
                        {t('history.table.viewDetails')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span>{t('common.itemsPerPage')}</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2"
                value={size}
                onChange={event => setSize(Number(event.target.value))}
              >
                {[10, 20, 50].map(option => (
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
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!canGoBack}>
                {t('common.previous')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('common.pageOf', { current: totalPages === 0 ? 0 : page + 1, total: Math.max(totalPages, 1) })}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!canGoNext}>
                {t('common.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <MessageDetailsDialog
        row={selectedRow} open={!!openDetailsId}
        onClose={closeDetails}
        onViewFailed={handleViewFailed}
      />
      {/* Failed recipients dialog uses separate paging state. */}
      <FailedRecipientsDialog
        row={selectedFailedRow} open={!!openFailuresId}
        failedRecipients={failedRecipients}
        page={failuresPage}
        size={failuresSize}
        totalPages={failuresTotalPages}
        totalElements={failuresTotalElements}
        onPageChange={setFailuresPage}
        onSizeChange={setFailuresSize}
        loadingFor={loadingFailuresFor}
        failuresError={failuresError}
        onClose={closeFailures}
        onBack={backToDetails}
      />
    </div>
  );
};