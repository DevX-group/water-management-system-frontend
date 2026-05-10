import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, TrendingUp, AlertCircle, CheckCircle2, Download, Eye, Loader2, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";

// The Subscription Number would ideally come from your Auth Context
const SUBSCRIPTION_NUMBER = "SK-2341"; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Bills = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingBill, setViewingBill] = useState<any | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 1. Fetch Bills from Spring Boot Database
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/bills/customer/${SUBSCRIPTION_NUMBER}`);
        if (response.ok) {
          const data = await response.json();
          setBills(data);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // 2. Logic for Filtered View
  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // 3. Dynamic Summary Stats from Database Data
  const totalPaid = bills
    .filter(b => b.status.toLowerCase() === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalOutstanding = bills
    .filter(b => b.status.toLowerCase() !== "paid")
    .reduce((sum, b) => sum + b.balanceDue, 0);

  const avgMonthly = bills.length > 0 
    ? (bills.reduce((sum, b) => sum + b.totalAmount, 0) / bills.length) 
    : 0;

  const summaryStats = [
    { 
      label: "Total Paid", 
      value: `LKR ${totalPaid.toLocaleString()}`, 
      icon: CheckCircle2, 
      color: "text-success",
      bgColor: "bg-success/10"
    },
    { 
      label: "Outstanding", 
      value: `LKR ${totalOutstanding.toLocaleString()}`, 
      icon: AlertCircle, 
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    { 
      label: "Avg Monthly", 
      value: `LKR ${avgMonthly.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 
      icon: TrendingUp, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
  ];

  // Handler functions
  const handleCloseView = () => {
    setViewingBill(null);
    setZoom(1);
    setRotation(0);
    setImageError(false);
  };

  const handleDownload = async (bill: any) => {
    try {
      const response = await fetch(`http://localhost:8081/api/bills/${bill.billId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bill-${bill.billingPeriod}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading bill:", error);
    }
  };

  const getBillImageUrl = (billId: string) => {
    return `http://localhost:8081/api/bills/${billId}/image`;
  };

  if (loading) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Billing <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground text-lg">View and manage all your water bills for {SUBSCRIPTION_NUMBER}</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4 mb-8">
            {summaryStats.map((stat, index) => (
              <motion.div key={index} whileHover={{ y: -4, scale: 1.02 }} className="stat-card">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-card border-none mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by period (e.g. 2026-04)..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bills Table */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-card border-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-5 font-semibold text-sm">Billing Period</th>
                      <th className="text-left p-5 font-semibold text-sm">Amount</th>
                      <th className="text-left p-5 font-semibold text-sm">Usage</th>
                      <th className="text-left p-5 font-semibold text-sm">Status</th>
                      <th className="text-left p-5 font-semibold text-sm">Due Date</th>
                      <th className="text-right p-5 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => (
                      <motion.tr 
                        key={bill.billId} 
                        className="border-t border-border hover:bg-secondary/30 transition-colors group"
                      >
                        <td className="p-5 font-semibold">{bill.billingPeriod}</td>
                        <td className="p-5 font-bold text-lg">LKR {bill.totalAmount.toLocaleString()}</td>
                        <td className="p-5 text-muted-foreground">{bill.usageUnits} units</td>
                        <td className="p-5">
                          <Badge
                            variant="secondary"
                            className={`rounded-full px-3 py-1 ${
                              bill.status.toLowerCase() === "paid" 
                                ? "bg-success/10 text-success" 
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {bill.status}
                          </Badge>
                        </td>
                        <td className="p-5 text-muted-foreground">{bill.dueDate}</td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setViewingBill(bill); setImageLoading(true); }}><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(bill)}><Download className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredBills.length === 0 && (
                  <div className="p-10 text-center text-muted-foreground">No bills found.</div>
                )}
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </div>

      {/* ── Bill Image Viewer Modal ── */}
      <AnimatePresence>
        {viewingBill && (
          <motion.div
            key="bill-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseView(); }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10 flex-shrink-0">
              <div>
                <p className="text-white font-bold text-base">Bill — {viewingBill.billingPeriod}</p>
                <p className="text-white/50 text-xs mt-0.5">
                  LKR {viewingBill.totalAmount?.toLocaleString()} · {viewingBill.usageUnits} units
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="Zoom out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setZoom(z => Math.min(3, z + 0.25))} title="Zoom in">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setRotation(r => (r + 90) % 360)} title="Rotate">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => handleDownload(viewingBill)} title="Download PDF">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 ml-2"
                  onClick={handleCloseView} title="Close">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Image area */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-white/40" />
                </div>
              )}
              {imageError ? (
                <div className="text-center text-white/40">
                  <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Bill image not available</p>
                </div>
              ) : (
                <motion.img
                  key={viewingBill.billId}
                  src={getBillImageUrl(viewingBill.billId)}
                  alt={`Bill ${viewingBill.billingPeriod}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: imageLoading ? 0 : 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    transition: "transform 0.2s ease",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                  }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => { setImageLoading(false); setImageError(true); }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-6 px-6 py-3 bg-black/60 border-t border-white/10 flex-shrink-0">
              <Badge
                variant="secondary"
                className={`rounded-full px-3 py-1 ${
                  viewingBill.status?.toLowerCase() === "paid"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {viewingBill.status}
              </Badge>
              <span className="text-white/40 text-xs">Due: {viewingBill.dueDate}</span>
              <span className="text-white/40 text-xs">ID: {viewingBill.billId}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Bills;