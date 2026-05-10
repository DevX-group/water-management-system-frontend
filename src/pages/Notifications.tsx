import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertOctagon, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

const Notifications = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 10;

  // Use the subscription number currently in your database
  const subNum = "SK-2341"; 

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/alerts/${id}/dismiss`, { 
        method: 'PATCH' 
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to dismiss alert", err);
    }
  };

  useEffect(() => { 
    fetchAlerts(); 
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return { 
        cardBg: "bg-red-100/80", 
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
    critical: alerts.filter(a => a.severity.toLowerCase() === "critical").length,
    high: alerts.filter(a => a.severity.toLowerCase() === "high").length,
    medium: alerts.filter(a => a.severity.toLowerCase() === "medium").length,
    info: alerts.filter(a => a.severity.toLowerCase() === "info").length,
  };

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.severity.toLowerCase() === filter);

  return (
    <MainLayout isAuthenticated={true}>
      <div className="min-h-screen bg-[#FFFDF5]"> 
        <div className="container mx-auto px-4 py-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-slate-800">Anomaly Alerts</h1>
          </div>

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

          <Card className="rounded-full border-none shadow-sm mb-8 bg-white mx-auto max-w-4xl">
            <CardContent className="p-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="font-semibold px-6 text-slate-700 hidden sm:block">Filter by severity:</span>
                <div className="flex flex-wrap justify-center gap-1 w-full sm:w-auto">
                  {["all", "critical", "high", "medium", "info"].map((lvl) => (
                    <Button 
                      key={lvl}
                      onClick={() => setFilter(lvl)}
                      size="sm"
                      className={`rounded-full px-6 capitalize transition-colors ${
                        filter === lvl 
                        ? (lvl === 'all' ? 'bg-slate-800 text-white' : `bg-${lvl === 'critical' ? 'red' : lvl === 'high' ? 'orange' : lvl === 'medium' ? 'amber' : 'blue'}-500 text-white`) 
                        : "bg-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
            ) : filteredAlerts.slice(currentIndex, currentIndex + itemsPerPage).map((alert) => {
              const styles = getSeverityStyles(alert.severity);
              const Icon = styles.icon;
              
              return (
                <Card 
                  key={alert.id} 
                  className={`rounded-3xl border-none shadow-sm transition-all ${styles.cardBg}`}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl bg-white/60 backdrop-blur-sm ${styles.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${styles.textColor}`}>{alert.title}</h3>
                        <p className={`${styles.textColor} opacity-80 text-sm mb-1`}>{alert.description}</p>
                        <div className={`flex items-center gap-4 text-xs font-medium ${styles.textColor} opacity-70`}>
                          {alert.usage && <span>Usage: {alert.usage}</span>}
                          <span>{new Date(alert.time).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleDismiss(alert.id)}
                      size="sm"
                      className={`rounded-full px-5 h-8 font-medium shadow-none ${styles.dismissBtn}`}
                    >
                      Dismiss
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredAlerts.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-8 pb-10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full bg-white shadow-sm"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - itemsPerPage))}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="text-sm font-medium text-slate-500">
                  {currentIndex + 1} - {Math.min(currentIndex + itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full bg-white shadow-sm"
                  onClick={() => setCurrentIndex(prev => Math.min(filteredAlerts.length - itemsPerPage, prev + itemsPerPage))}
                  disabled={currentIndex + itemsPerPage >= filteredAlerts.length}
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
            
            {!loading && filteredAlerts.length === 0 && (
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