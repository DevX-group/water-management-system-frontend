import '@/index.css';
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
  failedRecipients: Record<string, FailedRecipient[]>;
  loadingFor:       string | null;
  failuresError:    string | null;
  onClose:          () => void;
  onBack:           (id: string) => void;
}

export const FailedRecipientsDialog: React.FC<FailedRecipientsDialogProps> = ({
  row, open, failedRecipients, loadingFor, failuresError, onClose, onBack,
}) => {
  if (!row) return null;
  const failures = failedRecipients[row.id];
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
