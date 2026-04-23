import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { getMessageHistory } from "../services/messageService";
import { MessageHistoryRow } from "../types/messaging";

export const MessageHistoryPage = () => {
  const [rows, setRows] = useState<MessageHistoryRow[]>([]);

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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
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
                              <div>
                                <div className="text-muted-foreground">Success Rate</div>
                                <div className="font-medium">{row.successRate}%</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Total Sent</div>
                                <div className="text-lg font-semibold">{row.totalSent}</div>
                              </div>
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Failed</div>
                                <div className="text-lg font-semibold">{row.totalFailed}</div>
                              </div>
                              <div className="rounded-md border p-3">
                                <div className="text-muted-foreground">Delivered</div>
                                <div className="text-lg font-semibold">{row.totalDelivered}</div>
                              </div>
                            </div>
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