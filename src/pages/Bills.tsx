import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, TrendingUp, AlertCircle, CheckCircle2, Download, Eye } from "lucide-react";

const bills = [
  { period: "2025 November", amount: 3200, usage: 112, status: "unpaid", dueDate: "Dec 15, 2025" },
  { period: "2025 October", amount: 2800, usage: 98, status: "paid", dueDate: "Nov 15, 2025" },
  { period: "2025 September", amount: 3100, usage: 108, status: "paid", dueDate: "Oct 15, 2025" },
  { period: "2025 August", amount: 2600, usage: 91, status: "paid", dueDate: "Sep 15, 2025" },
  { period: "2025 July", amount: 2900, usage: 102, status: "paid", dueDate: "Aug 15, 2025" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Bills = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = [
    { 
      label: "Total Paid", 
      value: "LKR 23,790", 
      icon: CheckCircle2, 
      color: "text-success",
      bgColor: "bg-success/10"
    },
    { 
      label: "Outstanding", 
      value: "LKR 2,390", 
      icon: AlertCircle, 
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    { 
      label: "Avg Monthly", 
      value: "LKR 2,100", 
      icon: TrendingUp, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
  ];

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Billing <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground text-lg">View and manage all your water bills</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4 mb-8">
            {summaryStats.map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                className="stat-card"
              >
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
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Filter Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by month..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-11 h-12 rounded-xl input-premium"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                      <SelectItem value="paid" className="rounded-lg">Paid</SelectItem>
                      <SelectItem value="unpaid" className="rounded-lg">Unpaid</SelectItem>
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
                    {filteredBills.map((bill, i) => (
                      <motion.tr 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-t border-border hover:bg-secondary/30 transition-colors group"
                      >
                        <td className="p-5">
                          <span className="font-semibold">{bill.period}</span>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-lg">LKR {bill.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-5">
                          <span className="text-muted-foreground">{bill.usage} units</span>
                        </td>
                        <td className="p-5">
                          <Badge 
                            variant="secondary"
                            className={`rounded-full px-3 py-1 ${
                              bill.status === "paid" 
                                ? "bg-success/10 text-success border-success/20" 
                                : "bg-warning/10 text-warning border-warning/20"
                            }`}
                          >
                            {bill.status === "paid" ? "✓ Paid" : "• Pending"}
                          </Badge>
                        </td>
                        <td className="p-5 text-muted-foreground">{bill.dueDate}</td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Bills;