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

import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

interface CustomerPredictionRow {
  month: string;
  usage: number | null;
  revenue: number | null;
  predictedUsage: number | null;
  predictedRevenue: number | null;
}

interface CustomerTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CustomerPredictionRow;
  }>;
}

const CustomerTooltip = ({
  active,
  payload,
}: CustomerTooltipProps) => {
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

interface CustomerPredictionChartProps {
  searchId: string;
  setSearchId: (value: string) => void;
  selectedYear: string;
}

export const CustomerPredictionChart: React.FC<
  CustomerPredictionChartProps
> = ({
  searchId,
  setSearchId,
  selectedYear,
}) => {
  const [
    customerPredictionData,
    setCustomerPredictionData,
  ] = useState<CustomerPredictionRow[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * The backend/database filters by customer ID and the
   * current year. The delay avoids one request for every
   * immediate keystroke.
   */
  useEffect(() => {
    const normalizedCustomerId =
      searchId.trim().toUpperCase();

    if (!normalizedCustomerId) {
      setCustomerPredictionData([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      api
        .get("/predictions/customer", {
          params: {
            customerId: normalizedCustomerId,
            year: selectedYear,
          },
          signal: controller.signal,
        })
        .then((res) => {
          setCustomerPredictionData(res.data);
        })
        .catch((err) => {
          if (err.code !== "ERR_CANCELED") {
            console.error(
              "CUSTOMER PREDICTION ERROR:",
              err
            );

            setError(
              "Failed to load customer prediction data."
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchId, selectedYear]);

  /*
   * Find the first predicted month dynamically.
   */
  const firstPredictionMonth = useMemo(
    () =>
      customerPredictionData.find(
        (row) => row.predictedUsage != null
      )?.month,
    [customerPredictionData]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Customer Usage Prediction -{" "}
              {selectedYear}
            </CardTitle>

            <CardDescription>
              Forecasted usage for the selected
              customer up to 3 months
            </CardDescription>
          </div>

          <Input
            placeholder="Customer ID (e.g., C001)"
            value={searchId}
            onChange={(event) =>
              setSearchId(
                event.target.value.toUpperCase()
              )
            }
            className="w-48"
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading customer predictions...
          </div>
        ) : error ? (
          <div className="h-80 flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : customerPredictionData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No prediction data found for this customer.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={customerPredictionData}
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
                />

                <XAxis dataKey="month" />

                <YAxis
                  label={{
                    value: "Usage (L)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip
                  content={<CustomerTooltip />}
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