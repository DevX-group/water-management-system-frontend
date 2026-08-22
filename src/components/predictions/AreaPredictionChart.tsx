import "@/index.css";
import React, {
  useEffect,
  useState,
} from "react";

import { Filter } from "lucide-react";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

import { api } from "@/services/api";

interface AreaPredictionRow {
  month: string;

  area1Usage: number | null;
  area1Revenue: number | null;
  predictedArea1Usage: number | null;
  predictedArea1Revenue: number | null;

  area2Usage: number | null;
  area2Revenue: number | null;
  predictedArea2Usage: number | null;
  predictedArea2Revenue: number | null;

  area3Usage: number | null;
  area3Revenue: number | null;
  predictedArea3Usage: number | null;
  predictedArea3Revenue: number | null;
}

interface AreaPredictionChartProps {
  selectedArea: string;
  setSelectedArea: (value: string) => void;
  selectedYear: string;
}

export const AreaPredictionChart: React.FC<
  AreaPredictionChartProps
> = ({
  selectedArea,
  setSelectedArea,
  selectedYear,
}) => {
  const [
    areaPredictionData,
    setAreaPredictionData,
  ] = useState<AreaPredictionRow[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * The backend/database filters by the selected area
   * and the current year.
   */
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    api
      .get("/predictions/area", {
        params: {
          area: selectedArea,
          year: selectedYear,
        },
        signal: controller.signal,
      })
      .then((res) => {
        setAreaPredictionData(res.data);
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") {
          console.error(
            "AREA PREDICTION ERROR:",
            err
          );

          setError(
            "Failed to load area prediction data."
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [selectedArea, selectedYear]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Area-wise Usage and Revenue Prediction -{" "}
              {selectedYear}
            </CardTitle>

            <CardDescription>
              Predicted trends up to 3 months
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            {/* Area filter */}
            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Areas
                </SelectItem>

                <SelectItem value="area1">
                  Area 1
                </SelectItem>

                <SelectItem value="area2">
                  Area 2
                </SelectItem>

                <SelectItem value="area3">
                  Area 3
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading area predictions...
          </div>
        ) : error ? (
          <div className="h-80 flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : areaPredictionData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No prediction data found.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <ComposedChart
                data={areaPredictionData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis
                  yAxisId="left"
                  label={{
                    value: "(L)",
                    angle: -90,
                    position: "insideBottomLeft",
                  }}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "(LKR)",
                    angle: 90,
                    position: "insideBottomRight",
                  }}
                />

                <Tooltip />
                <Legend />

                {/* Area 1 */}
                {(selectedArea === "all" ||
                  selectedArea === "area1") && (
                  <>
                    <Bar
                      yAxisId="left"
                      dataKey="area1Usage"
                      name="Area 1 Usage"
                      fill="#0ea5e9"
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="area1Revenue"
                      name="Area 1 Revenue"
                      fill="#0369a1"
                    />

                    <Bar
                      yAxisId="left"
                      dataKey="predictedArea1Usage"
                      name="Predicted Area 1 Usage"
                      fill="#93c5fd"
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="predictedArea1Revenue"
                      name="Predicted Area 1 Revenue"
                      fill="#60a5fa"
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
                      name="Area 2 Usage"
                      fill="#22c55e"
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="area2Revenue"
                      name="Area 2 Revenue"
                      fill="#15803d"
                    />

                    <Bar
                      yAxisId="left"
                      dataKey="predictedArea2Usage"
                      name="Predicted Area 2 Usage"
                      fill="#86efac"
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="predictedArea2Revenue"
                      name="Predicted Area 2 Revenue"
                      fill="#4ade80"
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
                      name="Area 3 Usage"
                      fill="#f59e0b"
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="area3Revenue"
                      name="Area 3 Revenue"
                      fill="#b45309"
                    />

                    <Bar
                      yAxisId="left"
                      dataKey="predictedArea3Usage"
                      name="Predicted Area 3 Usage"
                      fill="#fde68a"
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="predictedArea3Revenue"
                      name="Predicted Area 3 Revenue"
                      fill="#facc15"
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};