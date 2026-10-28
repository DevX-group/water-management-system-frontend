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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("reports");

  const pdfData = overdueTableData.map((bill) => ({
    month: bill.dueDate,
    usage: Number(bill.daysOverdue ?? 0),
    revenue: Number(bill.amount ?? 0),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("overdue.title")}</CardTitle>
        <CardDescription>
          {t("overdue.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">
              {t("overdue.totalAmount")}
            </p>

            <p className="text-3xl font-bold text-destructive">
              LKR {Number(totalOverdueAmount).toLocaleString()}
            </p>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">
              {t("overdue.numberOfBills")}
            </p>

            <p className="text-3xl font-bold text-destructive">
              {overdueTableData.length}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Input
            placeholder={t("overdue.searchPlaceholder")}
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
                <TableHead>{t("overdue.table.billId")}</TableHead>
                <TableHead>{t("overdue.table.customerId")}</TableHead>
                <TableHead>{t("overdue.table.customer")}</TableHead>
                <TableHead>{t("overdue.table.amount")}</TableHead>
                <TableHead>{t("overdue.table.dueDate")}</TableHead>
                <TableHead>{t("overdue.table.daysOverdue")}</TableHead>
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
                        {bill.daysOverdue} {t("overdue.days")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {t("overdue.table.noResults")}
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
                overdueTableData,
                `${t("overdue.title")}${
                  overdueBill
                    ? ` - ${overdueBill}`
                    : ""
                }`,
                `OverdueReport${
                  overdueBill
                    ? `-${overdueBill}`
                    : ""
                }.pdf`,
                [
                  {
                    header: t("overdue.table.billId"),
                    value: (bill) => bill.id,
                    width: 1,
                  },
                  {
                    header: t("overdue.table.customerId"),
                    value: (bill) => bill.customerid,
                    width: 1.2,
                  },
                  {
                    header: t("overdue.table.customer"),
                    value: (bill) => bill.customer,
                    width: 1.5,
                  },
                  {
                    header: t("overdue.table.amount"),
                    value: (bill) =>
                      `LKR ${Number(
                        bill.amount ?? 0
                      ).toLocaleString()}`,
                    width: 1.3,
                    align: "right",
                  },
                  {
                    header: t("overdue.table.dueDate"),
                    value: (bill) => bill.dueDate,
                    width: 1.2,
                  },
                  {
                    header: t("overdue.table.daysOverdue"),
                    value: (bill) =>
                      `${bill.daysOverdue} ${t("overdue.days")}`,
                    width: 1.1,
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