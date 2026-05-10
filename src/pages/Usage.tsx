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

// --- Types ---
interface MonthlyDataPoint {
  name: string;
  usage: number;
  limit: number;
}

interface AnalyticsData {
  averageUsage: number;
  peakUsage: number;
  minimumUsage: number;
  totalUsage: number;
  monthlyData: MonthlyDataPoint[];
}

const API_BASE = "http://localhost:8081/api";

const Usage = () => {
  const [activeChart, setActiveChart] = useState<"bar" | "pie" | "mix">("bar");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/analytics/usage?year=${year}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
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

  const monthlyData = data?.monthlyData ?? [];
  
  // Transform data for Pie Chart - Now using single color #0ea5e9
  const pieData = monthlyData.map((item) => ({
    name: item.name,
    value: item.usage,
    color: "#0ea5e9" 
  }));

  const stats = data
    ? [
        { label: "Average Usage", value: `${data.averageUsage.toLocaleString()} units`, icon: Activity },
        { label: "Peak Usage",     value: `${data.peakUsage.toLocaleString()} units`,    icon: TrendingUp },
        { label: "Minimum Usage", value: `${data.minimumUsage.toLocaleString()} units`, icon: TrendingDown },
        { label: "Total Usage",   value: `${data.totalUsage.toLocaleString()} units`,   icon: BarChart3 },
      ]
    : [];

  const tooltipStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Usage Trends</h1>
            <p className="text-muted-foreground">Analyze your water consumption patterns</p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1 self-start sm:self-auto">
            <Button
              variant="ghost" size="icon" className="h-8 w-8"
              onClick={() => setYear((y) => y - 1)}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold w-14 text-center">{year}</span>
            <Button
              variant="ghost" size="icon" className="h-8 w-8"
              onClick={() => setYear((y) => y + 1)}
              disabled={loading || year >= new Date().getFullYear()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-8">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card border-none animate-pulse">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-5 bg-slate-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, i) => (
              <Card key={i} className="shadow-card border-none">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="shadow-card border-none mb-8">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle>Usage Analysis</CardTitle>
              <CardDescription>Hover over charts to see detailed data</CardDescription>
            </div>

            <div className="flex p-1 bg-secondary/50 rounded-lg">
              <Button
                variant={activeChart === "bar" ? "default" : "ghost"}
                size="sm" onClick={() => setActiveChart("bar")}
                className={`gap-2 ${activeChart === "bar" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}`}
              >
                <BarChartHorizontal className="w-4 h-4" /> Bar
              </Button>
              <Button
                variant={activeChart === "pie" ? "default" : "ghost"}
                size="sm" onClick={() => setActiveChart("pie")}
                className={`gap-2 ${activeChart === "pie" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}`}
              >
                <PieIcon className="w-4 h-4" /> Pie
              </Button>
              <Button
                variant={activeChart === "mix" ? "default" : "ghost"}
                size="sm" onClick={() => setActiveChart("mix")}
                className={`gap-2 ${activeChart === "mix" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}`}
              >
                <LineChart className="w-4 h-4" /> Mix
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="h-[400px] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                <p className="text-sm text-muted-foreground">Syncing data...</p>
              </div>
            ) : (
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
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius={80} outerRadius={120}
                        paddingAngle={2} dataKey="value"
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={tooltipStyle}
                        itemStyle={{ fontWeight: 'bold', color: '#0ea5e9' }}
                        formatter={(value: number, name: string) => [`${value} units`, `${name}`]} 
                      />
                    </PieChart>
                  ) : (
                    <ComposedChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
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
            )}

            {!loading && activeChart === "mix" && (
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="text-sm text-muted-foreground font-medium">Monthly Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-muted-foreground font-medium">Standard Limit</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
};

export default Usage;