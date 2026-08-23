import "@/index.css";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
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

import { api } from "@/services/api";

interface MonthlyPredictionRow {
  month: string;
  usage: number | null;
  revenue: number | null;
  predictedUsage: number | null;
  predictedRevenue: number | null;
}

interface PredictionTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: MonthlyPredictionRow;
  }>;
}

const PredictionTooltip = ({
  active,
  payload,
}: PredictionTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
      <p className="font-semibold mb-2">
        {data.month}
      </p>

      {data.usage != null && (
        <p>
          Actual Usage:{" "}
          {Number(data.usage).toLocaleString()} L
        </p>
      )}

      {data.revenue != null && (
        <p>
          Actual Revenue: LKR{" "}
          {Number(data.revenue).toLocaleString()}
        </p>
      )}

      {data.predictedUsage != null && (
        <p className="text-orange-500">
          Predicted Usage:{" "}
          {Number(
            data.predictedUsage
          ).toLocaleString()}{" "}
          L
        </p>
      )}

      {data.predictedRevenue != null && (
        <p className="text-orange-500">
          Predicted Revenue: LKR{" "}
          {Number(
            data.predictedRevenue
          ).toLocaleString()}
        </p>
      )}
    </div>
  );
};

interface MonthlyPredictionChartProps {
  selectedYear: string;
}

export const MonthlyPredictionChart: React.FC<
  MonthlyPredictionChartProps
> = ({ selectedYear }) => {
  const [
    monthlyPredictionData,
    setMonthlyPredictionData,
  ] = useState<MonthlyPredictionRow[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * The current year is supplied by PredictionsPage.
   * The backend/database selects only that year's data.
   */
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    api
      .get("/predictions/monthly", {
        params: {
          year: selectedYear,
        },
        signal: controller.signal,
      })
      .then((res) => {
        setMonthlyPredictionData(res.data);
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") {
          console.error(
            "MONTHLY PREDICTION ERROR:",
            err
          );

          setError(
            "Failed to load monthly prediction data."
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
  }, [selectedYear]);

  /*
   * Find the first predicted month dynamically.
   */
  const firstPredictionMonth = useMemo(
    () =>
      monthlyPredictionData.find(
        (row) => row.predictedUsage != null
      )?.month,
    [monthlyPredictionData]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Monthly Usage and Revenue Prediction -{" "}
          {selectedYear}
        </CardTitle>

        <CardDescription>
          Overall consumption and revenue trends
          predicted up to 3 months
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading monthly predictions...
          </div>
        ) : error ? (
          <div className="h-80 flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : monthlyPredictionData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No prediction data found for the current
            year.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={monthlyPredictionData}
              >
                {firstPredictionMonth && (
                  <ReferenceLine
                    x={firstPredictionMonth}
                    stroke="gray"
                    strokeDasharray="3 3"
                    label="Prediction Start"
                  />
                )}

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
                  content={<PredictionTooltip />}
                />

                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Actual Usage"
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="predictedUsage"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Usage"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};