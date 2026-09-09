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
import { useTranslation } from "react-i18next";

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

  /*
   * This data has already been filtered by the
   * backend/database using area and year.
   */
  areaData: AreaReportRow[];
}

interface AreaPDFRow {
  area: string;
  month: string;
  usage: number;
  revenue: number;
}

export const AreaReportTab: React.FC<
  AreaReportTabProps
> = ({
  selectedArea,
  setSelectedArea,
  areaYear,
  setAreaYear,
  areaData,
}) => {
  const { t } = useTranslation("reports");

  /*
   * Decide which areas should appear in the PDF.
   */
  const includedAreas =
    selectedArea === "all"
      ? [
          {
            key: "area1",
            label: t("area.area1"),
          },
          {
            key: "area2",
            label: t("area.area2"),
          },
          {
            key: "area3",
            label: t("area.area3"),
          },
        ]
      : [
          {
            key: selectedArea,
            label:
              selectedArea === "area1"
                ? t("area.area1")
                : selectedArea === "area2"
                  ? t("area.area2")
                  : t("area.area3"),
          },
        ];

  /*
   * Convert each backend area/month result into
   * an individual PDF row.
   */
  const areaPdfData: AreaPDFRow[] =
    areaData.flatMap((row) =>
      includedAreas.map((area) => {
        const usage =
          area.key === "area1"
            ? row.area1Usage
            : area.key === "area2"
              ? row.area2Usage
              : row.area3Usage;

        const revenue =
          area.key === "area1"
            ? row.area1Revenue
            : area.key === "area2"
              ? row.area2Revenue
              : row.area3Revenue;

        return {
          area: area.label,
          month: row.month,
          usage: Number(usage ?? 0),
          revenue: Number(revenue ?? 0),
        };
      })
    );

  const selectedAreaLabel =
    selectedArea === "all"
      ? t("area.allAreas")
      : selectedArea === "area1"
        ? t("area.area1")
        : selectedArea === "area2"
          ? t("area.area2")
          : t("area.area3");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {t("area.title")}
            </CardTitle>

            <CardDescription>
              {t("area.description")}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            {/* Area filter sent to the backend */}
            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  {t("area.allAreas")}
                </SelectItem>

                <SelectItem value="area1">
                  {t("area.area1")}
                </SelectItem>

                <SelectItem value="area2">
                  {t("area.area2")}
                </SelectItem>

                <SelectItem value="area3">
                  {t("area.area3")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Year filter sent to the backend */}
            <Select
              value={areaYear}
              onValueChange={setAreaYear}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {[
                  "2023",
                  "2024",
                  "2025",
                  "2026",
                ].map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                  >
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
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            {/*
             * areaData contains only the data returned
             * by the backend for the selected filters.
             */}
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
                  if (
                    !active ||
                    !payload?.length
                  ) {
                    return null;
                  }

                  const row =
                    payload[0]
                      ?.payload as AreaReportRow;

                  if (!row) {
                    return null;
                  }

                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-sm shadow-md">
                      {(selectedArea === "all" ||
                        selectedArea ===
                          "area1") && (
                        <>
                          <p className="font-medium">
                            Area 1
                          </p>

                          <p>
                            Usage:{" "}
                            {Number(
                              row.area1Usage ?? 0
                            ).toLocaleString()}{" "}
                            L
                          </p>

                          <p>
                            Revenue: LKR{" "}
                            {Number(
                              row.area1Revenue ?? 0
                            ).toLocaleString()}
                          </p>
                        </>
                      )}

                      {(selectedArea === "all" ||
                        selectedArea ===
                          "area2") && (
                        <>
                          <p className="font-medium mt-2">
                            Area 2
                          </p>

                          <p>
                            Usage:{" "}
                            {Number(
                              row.area2Usage ?? 0
                            ).toLocaleString()}{" "}
                            L
                          </p>

                          <p>
                            Revenue: LKR{" "}
                            {Number(
                              row.area2Revenue ?? 0
                            ).toLocaleString()}
                          </p>
                        </>
                      )}

                      {(selectedArea === "all" ||
                        selectedArea ===
                          "area3") && (
                        <>
                          <p className="font-medium mt-2">
                            Area 3
                          </p>

                          <p>
                            Usage:{" "}
                            {Number(
                              row.area3Usage ?? 0
                            ).toLocaleString()}{" "}
                            L
                          </p>

                          <p>
                            Revenue: LKR{" "}
                            {Number(
                              row.area3Revenue ?? 0
                            ).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  );
                }}
              />

              <Legend />

              {/* Area 1 */}
              {(selectedArea === "all" ||
                selectedArea === "area1") && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="area1Usage"
                    name={t("area.series.area1Usage")}
                    fill="hsl(187, 75%, 35%)"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="area1Revenue"
                    name={t("area.series.area1Revenue")}
                    stroke="hsl(187, 75%, 55%)"
                    strokeWidth={2}
                  />
                </>
              )}

              {/* Area 2 */}
              {(selectedArea === "all" ||
                selectedArea === "area2") && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="area2Usage"
                    name={t("area.series.area2Usage")}
                    fill="hsl(152, 70%, 40%)"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="area2Revenue"
                    name={t("area.series.area2Revenue")}
                    stroke="hsl(152, 70%, 60%)"
                    strokeWidth={2}
                  />
                </>
              )}

              {/* Area 3 */}
              {(selectedArea === "all" ||
                selectedArea === "area3") && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="area3Usage"
                    name={t("area.series.area3Usage")}
                    fill="hsl(38, 92%, 55%)"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="area3Revenue"
                    name={t("area.series.area3Revenue")}
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
            disabled={areaPdfData.length === 0}
            onClick={() =>
              exportPDF(
                areaPdfData,
                `${t("area.title")} - ${selectedAreaLabel} - ${areaYear}`,
                `AreaReport-${selectedArea}-${areaYear}.pdf`,
                [
                  {
                    header: "Area",
                    value: (row) => row.area,
                    width: 1,
                    align: "left",
                  },
                  {
                    header: "Month",
                    value: (row) => row.month,
                    width: 1,
                    align: "left",
                  },
                  {
                    header: "Usage (L)",
                    value: (row) =>
                      Number(
                        row.usage ?? 0
                      ).toLocaleString(),
                    width: 1,
                    align: "right",
                  },
                  {
                    header: "Revenue (LKR)",
                    value: (row) =>
                      Number(
                        row.revenue ?? 0
                      ).toLocaleString(),
                    width: 1.2,
                    align: "right",
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