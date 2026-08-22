import "@/index.css";
import React from "react";
import { Download, Filter } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
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

export interface AreaReportRow {
  month: string;
  area1Usage?: number;
  area1Revenue?: number;
  area2Usage?: number;
  area2Revenue?: number;
  area3Usage?: number;
  area3Revenue?: number;
}

interface AreaReportTabProps {
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  areaYear: string;
  setAreaYear: (year: string) => void;
  areaData: AreaReportRow[];
}

export const AreaReportTab: React.FC<AreaReportTabProps> = ({
  selectedArea,
  setSelectedArea,
  areaYear,
  setAreaYear,
  areaData,
}) => {
  const pdfData = areaData.map((row) => ({
    month: row.month,
    usage:
      Number(row.area1Usage ?? 0) +
      Number(row.area2Usage ?? 0) +
      Number(row.area3Usage ?? 0),
    revenue:
      Number(row.area1Revenue ?? 0) +
      Number(row.area2Revenue ?? 0) +
      Number(row.area3Revenue ?? 0),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Area-wise Usage and Revenue Report
            </CardTitle>

            <CardDescription>
              Usage and revenue trends summarized by area for comparison
              across regions
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="area1">Area 1</SelectItem>
                <SelectItem value="area2">Area 2</SelectItem>
                <SelectItem value="area3">Area 3</SelectItem>
              </SelectContent>
            </Select>

            <Select value={areaYear} onValueChange={setAreaYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
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
            <ComposedChart data={areaData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />

              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
              />

              <YAxis
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                label={{
                  value: "(L)",
                  angle: -90,
                  position: "insideBottom",
                }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                label={{
                  value: "(LKR)",
                  angle: 90,
                  position: "insideBottom",
                }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const row = payload[0]?.payload as AreaReportRow;

                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-sm">
                      {(selectedArea === "all" ||
                        selectedArea === "area1") && (
                        <>
                          <p>
                            Area 1 Usage:{" "}
                            {Number(row.area1Usage ?? 0).toLocaleString()} L
                          </p>
                          <p>
                            Area 1 Revenue: LKR{" "}
                            {Number(row.area1Revenue ?? 0).toLocaleString()}
                          </p>
                        </>
                      )}

                      {(selectedArea === "all" ||
                        selectedArea === "area2") && (
                        <>
                          <p>
                            Area 2 Usage:{" "}
                            {Number(row.area2Usage ?? 0).toLocaleString()} L
                          </p>
                          <p>
                            Area 2 Revenue: LKR{" "}
                            {Number(row.area2Revenue ?? 0).toLocaleString()}
                          </p>
                        </>
                      )}

                      {(selectedArea === "all" ||
                        selectedArea === "area3") && (
                        <>
                          <p>
                            Area 3 Usage:{" "}
                            {Number(row.area3Usage ?? 0).toLocaleString()} L
                          </p>
                          <p>
                            Area 3 Revenue: LKR{" "}
                            {Number(row.area3Revenue ?? 0).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  );
                }}
              />

              <Legend />

              {(selectedArea === "all" ||
                selectedArea === "area1") && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="area1Usage"
                    name="Area 1 Usage (L)"
                    fill="hsl(187, 75%, 35%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="area1Revenue"
                    name="Area 1 Revenue (LKR)"
                    stroke="hsl(187, 75%, 55%)"
                    strokeWidth={2}
                  />
                </>
              )}

              {(selectedArea === "all" ||
                selectedArea === "area2") && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="area2Usage"
                    name="Area 2 Usage (L)"
                    fill="hsl(152, 70%, 40%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="area2Revenue"
                    name="Area 2 Revenue (LKR)"
                    stroke="hsl(152, 70%, 60%)"
                    strokeWidth={2}
                  />
                </>
              )}

              {(selectedArea === "all" ||
                selectedArea === "area3") && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="area3Usage"
                    name="Area 3 Usage (L)"
                    fill="hsl(38, 92%, 55%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="area3Revenue"
                    name="Area 3 Revenue (LKR)"
                    stroke="hsl(38, 92%, 75%)"
                    strokeWidth={2}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-end mt-4">
          <Button
  disabled={areaData.length === 0}
  onClick={() =>
    exportPDF(
      areaData.map((row) => ({
        month: row.month,
        usage:
          Number(row.area1Usage ?? 0) +
          Number(row.area2Usage ?? 0) +
          Number(row.area3Usage ?? 0),
        revenue:
          Number(row.area1Revenue ?? 0) +
          Number(row.area2Revenue ?? 0) +
          Number(row.area3Revenue ?? 0),
      })),
      `Area Report - ${selectedArea} - ${areaYear}`,
      `AreaReport-${selectedArea}-${areaYear}.pdf`
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