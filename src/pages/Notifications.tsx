import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertOctagon, CheckCircle2, Loader2 } from "lucide-react";

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ critical: 0, high: 0, medium: 0, info: 0 });

  // 1. Fetch Summary Counts for the top cards
  const fetchCounts = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/alerts/counts");
      if (response.ok) {
        const data = await response.json();
        setCounts({
          critical: data.critical || 0,
          high: data.high || 0,
          medium: data.medium || 0,
          info: data.info || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // 2. Fetch Alerts based on selected filter
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const url = filter === "all" 
        ? "http://localhost:8081/api/alerts" 
        : `http://localhost:8081/api/alerts?severity=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Dismiss Action
  const handleDismiss = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/alerts/${id}/dismiss`, {
        method: "PATCH",
      });
      if (response.ok) {
        // Refresh data after successful dismissal
        fetchAlerts();
        fetchCounts();
      }
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  // Trigger fetches on mount and when filter changes
  useEffect(() => {
    fetchAlerts();
    fetchCounts();
  }, [filter]);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical": return { 
        cardBg: "bg-red-100/80", textColor: "text-red-900", icon: AlertOctagon, 
        iconColor: "text-red-700", dismissBtn: "bg-red-200 text-red-800 hover:bg-red-300"
      };
      case "high": return { 
        cardBg: "bg-orange-100/80", textColor: "text-orange-900", icon: AlertTriangle, 
        iconColor: "text-orange-700", dismissBtn: "bg-orange-200 text-orange-800 hover:bg-orange-300"
      };
      case "medium": return { 
        cardBg: "bg-amber-100/80", textColor: "text-amber-900", icon: AlertTriangle, 
        iconColor: "text-amber-700", dismissBtn: "bg-amber-200 text-amber-800 hover:bg-amber-300"
      };
      default: return { 
        cardBg: "bg-blue-100/80", textColor: "text-blue-900", icon: Info, 
        iconColor: "text-blue-700", dismissBtn: "bg-blue-200 text-blue-800 hover:bg-blue-300"
      };
    }
  };

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
              <Card key={i} className="rounded-3xl border-none shadow-sm bg-white">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <span className="capitalize text-slate-500 font-medium mb-1 text-sm">{stat.label}</span>
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.count}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Bar */}
          <Card className="rounded-full border-none shadow-sm mb-8 bg-white mx-auto max-w-4xl">
            <CardContent className="p-2 flex justify-center gap-1">
              {["all", "critical", "high", "medium", "info"].map((type) => (
                <Button 
                  key={type}
                  onClick={() => setFilter(type)}
                  size="sm"
                  className={`rounded-full px-6 transition-colors ${filter === type ? "bg-slate-800 text-white" : "bg-transparent text-slate-600 hover:bg-slate-100"}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Alert List */}
          <div className="space-y-3 max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : alerts.map((alert: any) => {
              const styles = getSeverityStyles(alert.severity);
              const Icon = styles.icon;
              return (
                <Card key={alert.id} className={`rounded-3xl border-none shadow-sm ${styles.cardBg}`}>
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl bg-white/60 ${styles.iconColor}`}><Icon /></div>
                      <div>
                        <h3 className={`font-bold text-lg ${styles.textColor}`}>{alert.title}</h3>
                        <p className={`${styles.textColor} opacity-80 text-sm`}>{alert.description}</p>
                        <div className="flex gap-4 text-xs mt-1 opacity-70 font-medium">
                          {alert.usage && <span>Usage: {alert.usage}</span>}
                          <span>{new Date(alert.time).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleDismiss(alert.id)} size="sm" className={`rounded-full px-5 ${styles.dismissBtn}`}>
                      Dismiss
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            
            {!loading && alerts.length === 0 && (
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