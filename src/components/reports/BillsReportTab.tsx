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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("reports");

  const pdfData = billsTableData.map((bill) => ({
    month: bill.dueDate,
    usage: 1,
    revenue: Number(bill.amount ?? 0),
  }));

  const translatedBillsData = billsData.map((item) => ({
    ...item,
    statusDisplay:
      item.status === "Paid"
        ? t("bills.status.paid")
        : t("bills.status.unpaid"),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("bills.title")}</CardTitle>
        <CardDescription>
          {t("bills.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={translatedBillsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="statusDisplay" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar
                dataKey="count"
                name={t("bills.chart.numberOfBills")}
                fill="hsl(187, 75%, 35%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-end">
          <Input
            placeholder={t("bills.searchPlaceholder")}
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
                <TableHead>{t("bills.table.billId")}</TableHead>
                <TableHead>{t("bills.table.customerId")}</TableHead>
                <TableHead>{t("bills.table.customer")}</TableHead>
                <TableHead>{t("bills.table.amount")}</TableHead>
                <TableHead>{t("bills.table.dueDate")}</TableHead>
                <TableHead>{t("bills.table.status")}</TableHead>
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
                        {bill.status === "Paid"
                          ? t("bills.status.paid")
                          : t("bills.status.unpaid")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {t("bills.table.noResults")}
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
                `${t("bills.title")}${
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
                    header: t("bills.table.billId"),
                    value: (bill) => bill.id,
                    width: 1,
                  },
                  {
                    header: t("bills.table.customerId"),
                    value: (bill) => bill.customerid,
                    width: 1.2,
                  },
                  {
                    header: t("bills.table.customer"),
                    value: (bill) => bill.customer,
                    width: 1.5,
                  },
                  {
                    header: t("bills.table.amount"),
                    value: (bill) =>
                      `LKR ${Number(
                        bill.amount ?? 0
                      ).toLocaleString()}`,
                    width: 1.3,
                    align: "right",
                  },
                  {
                    header: t("bills.table.dueDate"),
                    value: (bill) => bill.dueDate,
                    width: 1.2,
                  },
                  {
                    header: t("bills.table.status"),
                    value: (bill) =>
                      bill.status === "Paid"
                        ? t("bills.status.paid")
                        : t("bills.status.unpaid"),
                    width: 1,
                    align: "center",
                  },
                ]
              )
            }
          >
            <Download className="w-4 h-4 mr-2" />
            {t("common.exportPdf")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};