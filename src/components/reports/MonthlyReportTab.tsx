import "@/index.css";
import React from "react";
import { Download } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportPDF } from "@/util/exportPDF";
import { useTranslation } from "react-i18next";

export interface MonthlyReportRow {
  month: string;
  usage?: number;
  revenue?: number;
  totalUsage?: number;
  totalRevenue?: number;
}

interface MonthlyReportTabProps {
  year: number;
  setYear: (year: number) => void;
  reports: MonthlyReportRow[];
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({
  year,
  setYear,
  reports,
}) => {
  const { t } = useTranslation("reports");

  const pdfData = reports.map((item) => ({
    month: item.month,
    usage: Number(item.usage ?? item.totalUsage ?? 0),
    revenue: Number(item.revenue ?? item.totalRevenue ?? 0),
  }));

  return (
    <Card id="monthly-report">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("monthly.title")}</CardTitle>
            <CardDescription>
              {t("monthly.description")}
            </CardDescription>
          </div>

          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t("common.year")} />
            </SelectTrigger>

            <SelectContent>
              {["2023", "2024", "2025", "2026"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={reports}>
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
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />

              <Bar
                dataKey="usage"
                name={t("monthly.usageSeries")}
                fill="hsl(187, 75%, 35%)"
                radius={[4, 4, 0, 0]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                name={t("monthly.revenueSeries")}
                stroke="hsl(152, 70%, 40%)"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            disabled={reports.length === 0}
            onClick={() =>
              exportPDF(
                reports.map((item) => ({
                  month: item.month,
                  usage: Number(item.usage ?? item.totalUsage ?? 0),
                  revenue: Number(item.revenue ?? item.totalRevenue ?? 0),
                })),
                `${t("monthly.title")} - ${year}`,
                `MonthlyReport-${year}.pdf`
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