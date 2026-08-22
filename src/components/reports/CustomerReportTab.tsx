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
              Customer-wise Usage and Revenue Report
            </CardTitle>

            <CardDescription>
              Individual customer consumption and billing trends for a
              selected year
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search Customer ID (e.g. C001)"
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
                <SelectValue placeholder="Year" />
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
                  value: "Usage (L)",
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
                        Usage:{" "}
                        {Number(row.totalUsage ?? 0).toLocaleString()} L
                      </p>

                      <p>
                        Revenue: LKR{" "}
                        {Number(row.totalAmount ?? 0).toLocaleString()}
                      </p>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="totalUsage"
                name="Customer Usage (L)"
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
      `Customer Report - ${customerId} - ${customerYear}`,
      `CustomerReport-${customerId || "all"}-${customerYear}.pdf`
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