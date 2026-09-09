import "@/index.css";
import React from "react";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportPDF } from "@/util/exportPDF";
import { useTranslation } from "react-i18next";

export interface CustomerReportRow {
  month: string;
  totalUsage: number;
  totalAmount: number;
}

interface CustomerReportTabProps {
  customerId: string;
  setCustomerId: (customerId: string) => void;
  customerYear: string;
  setCustomerYear: (year: string) => void;
  data: CustomerReportRow[];
}

export const CustomerReportTab: React.FC<CustomerReportTabProps> = ({
  customerId,
  setCustomerId,
  customerYear,
  setCustomerYear,
  data,
}) => {
  const { t } = useTranslation("reports");

  const pdfData = data.map((item) => ({
    month: item.month,
    usage: Number(item.totalUsage ?? 0),
    revenue: Number(item.totalAmount ?? 0),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {t("customer.title")}
            </CardTitle>

            <CardDescription>
              {t("customer.description")}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder={t("customer.searchPlaceholder")}
              value={customerId}
              onChange={(event) =>
                setCustomerId(event.target.value.toUpperCase())
              }
              className="w-48"
            />

            <Select
              value={customerYear}
              onValueChange={setCustomerYear}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t("common.year")} />
              </SelectTrigger>

              <SelectContent>
                {["2023", "2024", "2025", "2026"].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />

              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
              />

              <YAxis
                stroke="hsl(var(--muted-foreground))"
                label={{
                  value: t("monthly.usageLabel"),
                  position: "top",
                  offset: 10,
                }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const row = payload[0]?.payload as CustomerReportRow;

                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-sm">
                      <p>
                        {t("customer.tooltipUsage", { value: Number(row.totalUsage ?? 0).toLocaleString() })}
                      </p>

                      <p>
                        {t("customer.tooltipRevenue", { value: Number(row.totalAmount ?? 0).toLocaleString() })}
                      </p>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="totalUsage"
                name={t("customer.seriesUsage")}
                stroke="hsl(187, 75%, 35%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            disabled={data.length === 0}
            onClick={() =>
              exportPDF(
                data.map((item) => ({
                  month: item.month,
                  usage: Number(item.totalUsage ?? 0),
                  revenue: Number(item.totalAmount ?? 0),
                })),
                `${t("customer.title")} - ${customerId} - ${customerYear}`,
                `CustomerReport-${customerId || "all"}-${customerYear}.pdf`
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