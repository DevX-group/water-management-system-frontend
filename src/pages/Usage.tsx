import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity, TrendingUp, TrendingDown, BarChart3,
  PieChart as PieIcon, BarChartHorizontal, LineChart,
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  ComposedChart, Line, Area,
} from "recharts";

//Types 

interface MonthlyDataPoint {
  name: string;   // "Jan" … "Dec"
  usage: number;
  limit: number;
}

interface CategoryDataPoint {
  name: string;   // "Domestic" | "Garden" | "Maintenance"
  value: number;  // percentage
  color: string;  // hex
}

interface AnalyticsData {
  averageUsage: number;
  peakUsage: number;
  minimumUsage: number;
  totalUsage: number;
  monthlyData: MonthlyDataPoint[];
  categoryData: CategoryDataPoint[];
}

// Constants 

const API_BASE = "http://localhost:8081/api";

// Component 

const Usage = () => {
  const [activeChart, setActiveChart] = useState<"bar" | "pie" | "mix">("bar");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics whenever year changes 
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/analytics/usage?year=${year}`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json: AnalyticsData = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message ?? "Failed to load usage data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [year]);

  //  Derived values from API
  const monthlyData  = data?.monthlyData  ?? [];
  const categoryData = data?.categoryData ?? [];

  const stats = data
    ? [
        { label: "Average Usage", value: `${data.averageUsage.toLocaleString()} units`, icon: Activity },
        { label: "Peak Usage",    value: `${data.peakUsage.toLocaleString()} units`,    icon: TrendingUp },
        { label: "Minimum Usage", value: `${data.minimumUsage.toLocaleString()} units`, icon: TrendingDown },
        { label: "Total Usage",   value: `${data.totalUsage.toLocaleString()} units`,   icon: BarChart3 },
      ]
    : [];

  const tooltipStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  // Render 
  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">

        // Page Header + Year Selector
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Usage Trends</h1>
            <p className="text-muted-foreground">Analyze your water consumption patterns</p>
          </div>

          // Year navigator 
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1 self-start sm:self-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setYear((y) => y - 1)}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold w-14 text-center">{year}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setYear((y) => y + 1)}
              disabled={loading || year >= new Date().getFullYear()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        // Error Banner 
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-8">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

       //Stat Cards 
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="shadow-card border-none">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-5 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Card key={i} className="shadow-card border-none">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        // Chart Card 
        <Card className="shadow-card border-none mb-8">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle>Usage Analysis</CardTitle>
              <CardDescription>Select a chart type to visualize data</CardDescription>
            </div>

            {/* Chart type toggle */}
            <div className="flex p-1 bg-secondary/50 rounded-lg">
              <Button
                variant={activeChart === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("bar")}
                className={`gap-2 ${activeChart === "bar" ? "bg-sky-500 hover:bg-sky-600" : ""}`}
              >
                <BarChartHorizontal className="w-4 h-4" />
                Bar
              </Button>
              <Button
                variant={activeChart === "pie" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("pie")}
                className={`gap-2 ${activeChart === "pie" ? "bg-sky-500 hover:bg-sky-600" : ""}`}
              >
                <PieIcon className="w-4 h-4" />
                Pie
              </Button>
              <Button
                variant={activeChart === "mix" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("mix")}
                className={`gap-2 ${activeChart === "mix" ? "bg-sky-500 hover:bg-sky-600" : ""}`}
              >
                <LineChart className="w-4 h-4" />
                Mix
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Loading spinner */}
            {loading ? (
              <div className="h-[400px] w-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                <p className="text-sm">Loading usage data…</p>
              </div>
            ) : (
              <>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">

                    {activeChart === "bar" ? (
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                        <Tooltip cursor={{ fill: "transparent" }} contentStyle={tooltipStyle} />
                        <Bar dataKey="usage" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>

                    ) : activeChart === "pie" ? (
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>

                    ) : (
                      <ComposedChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="usage" fill="url(#colorUsage)" stroke="#0ea5e9" strokeWidth={2} />
                        <Line type="monotone" dataKey="limit" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Bar dataKey="usage" barSize={30} fill="#0ea5e9" radius={[4, 4, 0, 0]} opacity={0.8} />
                      </ComposedChart>
                    )}

                  </ResponsiveContainer>
                </div>

                {/* Legend — Pie */}
                {activeChart === "pie" && (
                  <div className="flex justify-center gap-6 mt-4">
                    {categoryData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legend — Mix */}
                {activeChart === "mix" && (
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-500" />
                      <span className="text-sm text-muted-foreground">Actual Usage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-sm text-muted-foreground">Limit</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
};

export default Usage;