import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessageFailures, getMessageHistory } from "../services/messageService";
import { FailedRecipient, MessageHistoryRow } from "../types/messaging";

export const MessageHistoryPage = () => {
  const [rows, setRows] = useState<MessageHistoryRow[]>([]);
  const [failedRecipients, setFailedRecipients] = useState<Record<string, FailedRecipient[]>>({});
  const [loadingFailuresFor, setLoadingFailuresFor] = useState<string | null>(null);
  const [failuresError, setFailuresError] = useState<string | null>(null);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
  const [openFailuresId, setOpenFailuresId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMessageHistory();
        setRows(data);
      } catch (error) {
        console.error("Failed to load message history", error);
      }
    };

    load();
  }, []);

  const loadFailures = async (sentMessageId: string) => {
    if (failedRecipients[sentMessageId]) {
      return;
    }

    setLoadingFailuresFor(sentMessageId);
    setFailuresError(null);
    try {
      const data = await getMessageFailures(sentMessageId);
      setFailedRecipients((prev) => ({ ...prev, [sentMessageId]: data }));
    } catch (error) {
      console.error("Failed to load failed recipients", error);
      setFailuresError("Failed to load failed recipients");
    } finally {
      setLoadingFailuresFor(null);
    }
  };

  const openFailures = async (sentMessageId: string) => {
    await loadFailures(sentMessageId);
    setOpenDetailsId(null);
    setOpenFailuresId(sentMessageId);
  };

  return (
    <div className="space-y-6 p-6 pb-24 px-0">
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">Message History</h1>
        <p className="text-muted-foreground">
          Review delivery results for sent messages.
        </p>
      </div> */}

      <Card>
        {/* <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader> */}
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
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.messageName}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell className="text-right">{row.successRate}%</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsId === row.id}
                        onOpenChange={(open) => setOpenDetailsId(open ? row.id : null)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDetailsId(row.id)}
                        >
                          View Details
                        </Button>
                        <DialogContent className="sm:max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-muted-foreground">Message</div>
                                <div className="font-medium">{row.messageName}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Type</div>
                                <div className="font-medium">{row.type}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Date</div>
                                <div className="font-medium">{row.date}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Time</div>
                                <div className="font-medium">{row.time}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Recipients</div>
                                <div className="font-medium">{row.recipients}</div>
                              </div>
                              <div className="col-span-2 grid grid-cols-2 gap-3">
                                <div>
                                  <div className="text-muted-foreground">Email Success Rate</div>
                                  <div className="font-medium">{row.emailSuccessRate}%</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">SMS Success Rate</div>
                                  <div className="font-medium">{row.smsSuccessRate}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total Emails Sent</div>
                                <div className="text-lg font-semibold">{row.totalEmailsSent}</div>
                              </div>
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total Emails Failed</div>
                                <div className="text-lg font-semibold">{row.totalEmailsFailed}</div>
                              </div>
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total Emails Delivered</div>
                                <div className="text-lg font-semibold">{row.totalEmailsDelivered}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total SMSs Sent</div>
                                <div className="text-lg font-semibold">{row.totalSmsSent}</div>
                              </div>
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total SMSs Failed</div>
                                <div className="text-lg font-semibold">{row.totalSmsFailed}</div>
                              </div>
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total SMSs Delivered</div>
                                <div className="text-lg font-semibold">{row.totalSmsDelivered}</div>
                              </div>
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openFailures(row.id)}
                              >
                                View Failed Recipients
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog
                        open={openFailuresId === row.id}
                        onOpenChange={(open) => setOpenFailuresId(open ? row.id : null)}
                      >
                        <DialogContent className="sm:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Failed Recipients</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setOpenFailuresId(null);
                                  setOpenDetailsId(row.id);
                                }}
                              >
                                Back to Message Details
                              </Button>
                            </div>
                            {failuresError && (
                              <div className="text-sm text-red-500">{failuresError}</div>
                            )}
                            {loadingFailuresFor === row.id && (
                              <div className="text-sm text-muted-foreground">Loading failed recipients...</div>
                            )}
                            {failedRecipients[row.id] && failedRecipients[row.id].length === 0 && (
                              <div className="text-sm text-muted-foreground">No failed recipients.</div>
                            )}
                            {failedRecipients[row.id] && failedRecipients[row.id].length > 0 && (
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
                                    {failedRecipients[row.id].map((failure) => (
                                      <TableRow
                                        key={`${failure.subscriptionNumber}-${failure.smsFailed}-${failure.emailFailed}`}
                                      >
                                        <TableCell className="font-medium">
                                          {failure.customerName || "-"}
                                        </TableCell>
                                        <TableCell>{failure.subscriptionNumber || "-"}</TableCell>
                                        <TableCell>{failure.phoneNumber || "-"}</TableCell>
                                        <TableCell>{failure.email || "-"}</TableCell>
                                        <TableCell className="text-right">
                                          {failure.smsFailed ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {failure.emailFailed ? "Yes" : "No"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}