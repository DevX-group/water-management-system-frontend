import '@/index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMessageFailures, getMessageHistory } from '@/services/messageService';
import type { FailedRecipient, MessageHistoryRow } from '@/types/messaging';
import { MessageDetailsDialog, FailedRecipientsDialog } from '@/components/messaging/MessageHistoryDialogs';

import { useMessageHistory } from '@/hooks/useMessageHistory';

export const MessageHistoryPage = () => {
  const navigate = useNavigate();
  const {
    rows,
    failedRecipients,
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
                  <TableHead className="text-right">Success Rate</TableHead>
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
                    <TableCell className="text-right">{row.successRate}%</TableCell>
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
        loadingFor={loadingFailuresFor}
        failuresError={failuresError}
        onClose={closeFailures}
        onBack={backToDetails}
      />
    </div>
  );
};