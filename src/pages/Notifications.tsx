import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertOctagon, CheckCircle2 } from "lucide-react";

// Mock Data
const alerts = [
  { id: 1, severity: "critical", title: "Pipe Burst Detected", description: "Major leak detected in Main Zone A. Immediate action required.", usage: "450 units", time: "10 mins ago" },
  { id: 2, severity: "critical", title: "Sensor Malfunction", description: "Master meter is not responding.", usage: null, time: "30 mins ago" },
  { id: 3, severity: "high", title: "Unusual Night Usage", description: "High water consumption detected during sleeping hours (2-5 AM)", usage: "85 units", time: "4 hours ago" },
  { id: 4, severity: "high", title: "Usage Spike Detected", description: "Water usage 40% higher than average", usage: "120 units", time: "1 day ago" },
  { id: 5, severity: "medium", title: "Pressure Drop", description: "Slight pressure drop observed in garden line.", usage: null, time: "6 hours ago" },
  { id: 6, severity: "medium", title: "Continuous Flow", description: "Water flow detected for 4 hours continuously.", usage: "45 units", time: "8 hours ago" },
  { id: 7, severity: "info", title: "Bill Due Reminder", description: "Your water bill is due in 5 days", usage: null, time: "2 days ago" },
  { id: 8, severity: "info", title: "System Update", description: "Maintenance scheduled for next Tuesday.", usage: null, time: "3 days ago" },
];

const Notifications = () => {
  const [filter, setFilter] = useState("all");

  // Helper: Return styles for the Card Background & Text
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical": return { 
        cardBg: "bg-red-100/80", // Darker pastel for visibility
        borderColor: "border-red-200",
        textColor: "text-red-900",
        icon: AlertOctagon, 
        iconColor: "text-red-700",
        dismissBtn: "bg-red-200 text-red-800 hover:bg-red-300"
      };
      case "high": return { 
        cardBg: "bg-orange-100/80", 
        borderColor: "border-orange-200",
        textColor: "text-orange-900",
        icon: AlertTriangle, 
        iconColor: "text-orange-700",
        dismissBtn: "bg-orange-200 text-orange-800 hover:bg-orange-300"
      };
      case "medium": return { 
        cardBg: "bg-amber-100/80", 
        borderColor: "border-amber-200",
        textColor: "text-amber-900",
        icon: AlertTriangle, 
        iconColor: "text-amber-700",
        dismissBtn: "bg-amber-200 text-amber-800 hover:bg-amber-300"
      };
      default: return { 
        cardBg: "bg-blue-100/80", 
        borderColor: "border-blue-200",
        textColor: "text-blue-900",
        icon: Info, 
        iconColor: "text-blue-700",
        dismissBtn: "bg-blue-200 text-blue-800 hover:bg-blue-300"
      };
    }
  };

  const counts = {
    critical: alerts.filter(a => a.severity === "critical").length,
    high: alerts.filter(a => a.severity === "high").length,
    medium: alerts.filter(a => a.severity === "medium").length,
    info: alerts.filter(a => a.severity === "info").length,
  };

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <MainLayout isAuthenticated={true}>
      <div className="min-h-screen bg-[#FFFDF5]"> 
        <div className="container mx-auto px-4 py-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-slate-800">Anomaly Alerts</h1>
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Critical", count: counts.critical, color: "text-red-600" },
              { label: "High", count: counts.high, color: "text-orange-600" },
              { label: "Medium", count: counts.medium, color: "text-amber-600" },
              { label: "Info", count: counts.info, color: "text-blue-600" },
            ].map((stat, i) => (
              <Card key={i} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <span className="capitalize text-slate-500 font-medium mb-1 text-sm">{stat.label}</span>
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.count}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Bar */}
          <Card className="rounded-full border-none shadow-sm mb-8 bg-white mx-auto max-w-4xl">
            <CardContent className="p-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="font-semibold px-6 text-slate-700 hidden sm:block">Filter by severity:</span>
                <div className="flex flex-wrap justify-center gap-1 w-full sm:w-auto">
                  <Button 
                    onClick={() => setFilter("all")}
                    size="sm"
                    className={`rounded-full px-6 transition-colors ${filter === "all" ? "bg-slate-800 text-white" : "bg-transparent text-slate-600 hover:bg-slate-100"}`}
                  >
                    All
                  </Button>
                  <Button 
                    onClick={() => setFilter("critical")}
                    size="sm"
                    className={`rounded-full px-6 transition-colors ${filter === "critical" ? "bg-red-500 text-white hover:bg-red-600" : "bg-transparent text-slate-600 hover:bg-red-50"}`}
                  >
                    Critical
                  </Button>
                  <Button 
                    onClick={() => setFilter("high")}
                    size="sm"
                    className={`rounded-full px-6 transition-colors ${filter === "high" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-transparent text-slate-600 hover:bg-orange-50"}`}
                  >
                    High
                  </Button>
                  <Button 
                    onClick={() => setFilter("medium")}
                    size="sm"
                    className={`rounded-full px-6 transition-colors ${filter === "medium" ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-transparent text-slate-600 hover:bg-amber-50"}`}
                  >
                    Medium
                  </Button>
                  <Button 
                    onClick={() => setFilter("info")}
                    size="sm"
                    className={`rounded-full px-6 transition-colors ${filter === "info" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-transparent text-slate-600 hover:bg-blue-50"}`}
                  >
                    Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <div className="space-y-3 max-w-4xl mx-auto">
            {filteredAlerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);
              const Icon = styles.icon;
              
              return (
                <Card 
                  key={alert.id} 
                  className={`rounded-3xl border-none shadow-sm transition-all ${styles.cardBg}`}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    
                    {/* Left Side: Icon & Text */}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl bg-white/60 backdrop-blur-sm ${styles.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div>
                        <h3 className={`font-bold text-lg ${styles.textColor}`}>
                          {alert.title}
                        </h3>
                        <p className={`${styles.textColor} opacity-80 text-sm mb-1`}>{alert.description}</p>
                        
                        <div className={`flex items-center gap-4 text-xs font-medium ${styles.textColor} opacity-70`}>
                          {alert.usage && <span>Usage: {alert.usage}</span>}
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Action */}
                    <Button 
                      size="sm"
                      className={`rounded-full px-5 h-8 font-medium shadow-none ${styles.dismissBtn}`}
                    >
                      Dismiss
                    </Button>

                  </CardContent>
                </Card>
              );
            })}
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No alerts found</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;