import "@/index.css";
import React from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportPDF } from "@/util/exportPDF";

export interface OverdueReportRow {
  id: string;
  customerid: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

interface OverdueReportTabProps {
  overdueBill: string;
  setOverdueBill: (customerId: string) => void;
  overdueTableData: OverdueReportRow[];
  totalOverdueAmount: number;
}

export const OverdueReportTab: React.FC<OverdueReportTabProps> = ({
  overdueBill,
  setOverdueBill,
  overdueTableData,
  totalOverdueAmount,
}) => {
  const pdfData = overdueTableData.map((bill) => ({
    month: bill.dueDate,
    usage: Number(bill.daysOverdue ?? 0),
    revenue: Number(bill.amount ?? 0),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Payments Report</CardTitle>
        <CardDescription>
          Unpaid bills that have passed their due dates with financial risk
          analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">
              Total Overdue Amount
            </p>

            <p className="text-3xl font-bold text-destructive">
              LKR {Number(totalOverdueAmount).toLocaleString()}
            </p>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">
              Number of Overdue Bills
            </p>

            <p className="text-3xl font-bold text-destructive">
              {overdueTableData.length}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Input
            placeholder="Search Customer ID"
            value={overdueBill}
            onChange={(event) =>
              setOverdueBill(event.target.value.toUpperCase())
            }
            className="w-48"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {overdueTableData.length > 0 ? (
                overdueTableData.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">
                      {bill.id}
                    </TableCell>
                    <TableCell>{bill.customerid}</TableCell>
                    <TableCell>{bill.customer}</TableCell>
                    <TableCell>
                      LKR {Number(bill.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>{bill.dueDate}</TableCell>

                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        {bill.daysOverdue} days
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button
  disabled={overdueTableData.length === 0}
  onClick={() =>
    exportPDF(
      overdueTableData.map((bill) => ({
        month: bill.dueDate,
        usage: Number(bill.daysOverdue ?? 0),
        revenue: Number(bill.amount ?? 0),
      })),
      `Overdue Payments Report${
        overdueBill
          ? ` - ${overdueBill}`
          : ""
      }`,
      `OverdueReport${
        overdueBill
          ? `-${overdueBill}`
          : ""
      }.pdf`
    )
  }
>
  <Download className="w-4 h-4 mr-2" />
  Export as PDF
</Button>
        </div>
      </CardContent>
    </Card>
  );
};