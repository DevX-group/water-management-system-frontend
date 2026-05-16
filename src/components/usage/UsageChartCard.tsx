import '@/index.css';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChartHorizontal, PieChart as PieIcon, LineChart, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line, Area } from 'recharts';

interface UsageChartCardProps {
  activeChart: "bar" | "pie" | "mix";
  setActiveChart: (v: "bar" | "pie" | "mix") => void;
  loading: boolean;
  monthlyData: any[];
  pieData: any[];
}

const tooltipStyle = { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" };

export const UsageChartCard: React.FC<UsageChartCardProps> = ({ activeChart, setActiveChart, loading, monthlyData, pieData }) => (
  <Card className="shadow-card border-none mb-8">
    <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
      <div>
        <CardTitle>Usage Analysis</CardTitle>
        <CardDescription>Hover over charts to see detailed data</CardDescription>
      </div>
      <div className="flex p-1 bg-secondary/50 rounded-lg">
        <Button variant={activeChart === "bar" ? "default" : "ghost"} size="sm" onClick={() => setActiveChart("bar")} className={`gap-2 ${activeChart === "bar" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}`}>
          <BarChartHorizontal className="w-4 h-4" /> Bar
        </Button>
        <Button variant={activeChart === "pie" ? "default" : "ghost"} size="sm" onClick={() => setActiveChart("pie")} className={`gap-2 ${activeChart === "pie" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}`}>
          <PieIcon className="w-4 h-4" /> Pie
        </Button>
        <Button variant={activeChart === "mix" ? "default" : "ghost"} size="sm" onClick={() => setActiveChart("mix")} className={`gap-2 ${activeChart === "mix" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}`}>
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
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value" style={{ cursor: 'pointer', outline: 'none' }}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 'bold', color: '#0ea5e9' }} formatter={(value: number, name: string) => [`${value} units`, `${name}`]} />
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
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-500" /><span className="text-sm text-muted-foreground font-medium">Monthly Usage</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-sm text-muted-foreground font-medium">Standard Limit</span></div>
        </div>
      )}
    </CardContent>
  </Card>
);
