import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MessageHistoryRow, FailedRecipient } from '@/types/messaging';

interface MessageDetailsDialogProps {
  row:          MessageHistoryRow | null;
  open:         boolean;
  onClose:      () => void;
  onViewFailed: (id: string) => void;
}

export const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  row, open, onClose, onViewFailed,
}) => {
  if (!row) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Message Details</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Message', value: row.messageName },
              { label: 'Type', value: row.type },
              { label: 'Date', value: row.date },
              { label: 'Time', value: row.time },
              { label: 'Recipients', value: String(row.recipients) },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-muted-foreground">{label}</div>
                <div className="font-medium">{value}</div>
              </div>
            ))}
            <div className="col-span-2 grid grid-cols-2 gap-3">
              <div><div className="text-muted-foreground">Email Success Rate</div><div className="font-medium">{row.emailSuccessRate}%</div></div>
              <div><div className="text-muted-foreground">SMS Success Rate</div><div className="font-medium">{row.smsSuccessRate}%</div></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Emails Sent', value: row.totalEmailsSent },
              { label: 'Total Emails Failed', value: row.totalEmailsFailed },
              { label: 'Total Emails Delivered', value: row.totalEmailsDelivered },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border p-3">
                <div className="text-muted-foreground">{label}</div>
                <div className="text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total SMSs Sent', value: row.totalSmsSent },
              { label: 'Total SMSs Failed', value: row.totalSmsFailed },
              { label: 'Total SMSs Delivered', value: row.totalSmsDelivered },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border p-3">
                <div className="text-muted-foreground">{label}</div>
                <div className="text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewFailed(row.id)}>
            View Failed Recipients
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
  if (!row) return null;
  const failures = failedRecipients;
  const canGoBack = page > 0;
  const canGoNext = page + 1 < totalPages;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader><DialogTitle>Failed Recipients</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <Button variant="outline" size="sm" onClick={() => onBack(row.id)}>Back to Message Details</Button>
          {failuresError && <div className="text-sm text-red-500">{failuresError}</div>}
          {loadingFor === row.id && <div className="text-sm text-muted-foreground">Loading failed recipients...</div>}
          {failures?.length === 0 && <div className="text-sm text-muted-foreground">No failed recipients.</div>}
          {failures?.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">SMS Failed</TableHead>
                    <TableHead className="text-right">Email Failed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failures.map((f) => (
                    <TableRow key={`${f.subscriptionNumber}-${f.smsFailed}-${f.emailFailed}`}>
                      <TableCell className="font-medium">{f.customerName || '-'}</TableCell>
                      <TableCell>{f.subscriptionNumber || '-'}</TableCell>
                      <TableCell>{f.phoneNumber || '-'}</TableCell>
                      <TableCell>{f.email || '-'}</TableCell>
                      <TableCell className="text-right">{f.smsFailed ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">{f.emailFailed ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-3 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span>Items per page</span>
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
                  ? `${page * size + 1}-${Math.min((page + 1) * size, totalElements)} of ${totalElements}`
                  : '0 items'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={!canGoBack}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {totalPages === 0 ? 0 : page + 1} of {Math.max(totalPages, 1)}
              </span>
              <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={!canGoNext}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
