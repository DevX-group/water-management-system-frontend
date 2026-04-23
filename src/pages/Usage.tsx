import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon, BarChartHorizontal, LineChart } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  Line,
  Area
} from "recharts";

// --- Mock Data ---
const monthlyData = [
  { name: "Jan", usage: 120, limit: 150 },
  { name: "Feb", usage: 145, limit: 150 },
  { name: "Mar", usage: 98,  limit: 150 },
  { name: "Apr", usage: 165, limit: 150 },
  { name: "May", usage: 140, limit: 150 },
  { name: "Jun", usage: 185, limit: 150 },
  { name: "Jul", usage: 130, limit: 150 },
  { name: "Aug", usage: 155, limit: 150 },
  { name: "Sep", usage: 110, limit: 150 },
  { name: "Oct", usage: 175, limit: 150 },
  { name: "Nov", usage: 150, limit: 150 },
  { name: "Dec", usage: 135, limit: 150 },
];

const categoryData = [
  { name: "Domestic", value: 65, color: "#0ea5e9" }, // sky-500
  { name: "Garden", value: 20, color: "#38bdf8" },   // sky-400
  { name: "Maintenance", value: 15, color: "#bae6fd" }, // sky-200
];

const Usage = () => {
  const [activeChart, setActiveChart] = useState<"bar" | "pie" | "mix">("bar");

  const stats = [
    { label: "Average Usage", value: "149 units", icon: Activity },
    { label: "Peak Usage", value: "185 units", icon: TrendingUp },
    { label: "Minimum Usage", value: "98 units", icon: TrendingDown },
    { label: "Total Usage", value: "1,790 units", icon: BarChart3 },
  ];

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Usage Trends</h1>
        <p className="text-muted-foreground mb-8">Analyze your water consumption patterns</p>

        {/* Top Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
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

        {/* Chart Toggle Section */}
        <Card className="shadow-card border-none mb-8">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle>Usage Analysis</CardTitle>
              <CardDescription>Select a chart type to visualize data</CardDescription>
            </div>
            
            {/* Toggle Buttons */}
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
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                
                {/* CONDITIONAL RENDERING BASED ON ACTIVE BUTTON */}
                
                {activeChart === "bar" ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="usage" fill="url(#colorUsage)" stroke="#0ea5e9" strokeWidth={2} />
                    <Line type="monotone" dataKey="limit" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <Bar dataKey="usage" barSize={30} fill="#0ea5e9" radius={[4, 4, 0, 0]} opacity={0.8} />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Custom Legend for Pie Chart only */}
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
            
            {/* Custom Legend for Mix Chart only */}
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

          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Usage;