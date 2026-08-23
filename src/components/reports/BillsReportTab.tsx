import "@/index.css";
import React from "react";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

export interface BillReportRow {
  id: string;
  customerid: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid";
}

interface BillChartRow {
  status: string;
  count: number;
}

interface BillsReportTabProps {
  customerSearchBill: string;
  setCustomerSearchBill: (customerId: string) => void;
  billsTableData: BillReportRow[];
  billsData: BillChartRow[];
}

export const BillsReportTab: React.FC<BillsReportTabProps> = ({
  customerSearchBill,
  setCustomerSearchBill,
  billsTableData,
  billsData,
}) => {
  const pdfData = billsTableData.map((bill) => ({
    month: bill.dueDate,
    usage: 1,
    revenue: Number(bill.amount ?? 0),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid vs Unpaid Bills Report</CardTitle>
        <CardDescription>
          Overview of bill payment status with comparison and detailed
          listings
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={billsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar
                dataKey="count"
                name="Number of Bills"
                fill="hsl(187, 75%, 35%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-end">
          <Input
            placeholder="Search Customer ID (C001,...)"
            value={customerSearchBill}
            onChange={(event) =>
              setCustomerSearchBill(event.target.value.toUpperCase())
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {billsTableData.length > 0 ? (
                billsTableData.map((bill) => (
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bill.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bill.status}
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
  disabled={billsTableData.length === 0}
  onClick={() =>
    exportPDF(
      billsTableData,
      `Bills Report${
        customerSearchBill
          ? ` - ${customerSearchBill}`
          : ""
      }`,
      `BillsReport${
        customerSearchBill
          ? `-${customerSearchBill}`
          : ""
      }.pdf`,
      [
        {
          header: "Bill ID",
          value: (bill) => bill.id,
          width: 1,
        },
        {
          header: "Customer ID",
          value: (bill) => bill.customerid,
          width: 1.2,
        },
        {
          header: "Customer",
          value: (bill) => bill.customer,
          width: 1.5,
        },
        {
          header: "Amount",
          value: (bill) =>
            `LKR ${Number(
              bill.amount ?? 0
            ).toLocaleString()}`,
          width: 1.3,
          align: "right",
        },
        {
          header: "Due Date",
          value: (bill) => bill.dueDate,
          width: 1.2,
        },
        {
          header: "Status",
          value: (bill) => bill.status,
          width: 1,
          align: "center",
        },
      ]
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