import '@/index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageDetailsDialog, FailedRecipientsDialog } from '@/components/messaging/MessageHistoryDialogs';

import { useMessageHistory } from '@/hooks/useMessageHistory';

export const MessageHistoryPage = () => {
  const navigate = useNavigate();
  const {
    rows,
    page,
    size,
    totalPages,
    totalElements,
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

  const canGoBack = page > 0;
  const canGoNext = page + 1 < totalPages;

  return (
    <div className="space-y-6 p-6 pb-24 px-0">
      <div>
        <Button variant="outline" onClick={() => navigate('/admin/messaging/scheduled')}>
          Back to Scheduled Messages
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Email Success Rate</TableHead>
                  <TableHead className="text-right">SMS Success Rate</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.messageName}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell className="text-right">{row.emailSuccessRate}%</TableCell>
                    <TableCell className="text-right">{row.smsSuccessRate}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetails(row.id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span>Items per page</span>
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
                  ? `${page * size + 1}-${Math.min((page + 1) * size, totalElements)} of ${totalElements}`
                  : '0 items'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!canGoBack}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {totalPages === 0 ? 0 : page + 1} of {Math.max(totalPages, 1)}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!canGoNext}>
                Next
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