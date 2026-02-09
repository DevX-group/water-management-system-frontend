import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, 
  ArrowRight, 
  Calendar, 
  CreditCard, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Activity,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Clock
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Dashboard = () => {
  const user = {
    name: "A.B.C. Example Name",
    subscriptionNo: "R10001",
    type: "Metered",
    region: "Regional",
    phone: "0711234567",
    email: "example001@gmail.com",
  };

  const billingSummary = {
    totalPayable: 2390.0,
    lastBillAmount: 3200.0,
    billingPeriod: "November 2025",
    dueDate: "15/12/2025",
    lastPayment: 2300.0,
    lastPaymentDate: "30/10/2025",
    avgMonthlyBill: 2100.0,
    trend: -12,
  };

  const usageData = [65, 80, 45, 90, 70, 85, 55, 75, 60, 95, 80, 70];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-muted-foreground">Welcome back,</span>
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient">{user.name}</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Billing Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Total Payable Card */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-elevated overflow-hidden">
                  <div className="gradient-primary p-8 relative overflow-hidden">
                    <div className="absolute inset-0 gradient-mesh opacity-20" />
                    <motion.div 
                      className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm mb-1 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Total Amount Due
                        </p>
                        <p className="text-5xl font-bold text-white">
                          Rs. {billingSummary.totalPayable.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          {billingSummary.trend < 0 ? (
                            <span className="flex items-center gap-1 text-green-200 text-sm bg-white/10 px-2 py-1 rounded-full">
                              <TrendingDown className="w-4 h-4" />
                              {Math.abs(billingSummary.trend)}% less than last month
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-200 text-sm bg-white/10 px-2 py-1 rounded-full">
                              <TrendingUp className="w-4 h-4" />
                              {billingSummary.trend}% more than last month
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center"
                      >
                        <Droplets className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-gradient-to-b from-background to-secondary/20">
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-border/50 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-bold text-lg">{billingSummary.dueDate}</p>
                        </div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-border/50 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Bill</p>
                          <p className="font-bold text-lg">Rs. {billingSummary.lastBillAmount.toLocaleString()}</p>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* UPDATED BUTTONS SECTION */}
                    <div className="flex gap-3">
                      <Link to="/payments" className="flex-1">
                        {/* Removed: motion.div wrapper, btn-shine class, and gradient-primary */}
                        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-xl gap-2 transition-colors">
                            Make Payment
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to="/bills" className="flex-1">
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button variant="outline" className="w-full h-12 rounded-xl gap-2">
                            View Bills
                          </Button>
                        </motion.div>
                      </Link>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>

              {/* Billing Details Grid */}
              <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Billing Period", value: billingSummary.billingPeriod, icon: Calendar },
                  { label: "Last Payment", value: `Rs. ${billingSummary.lastPayment.toLocaleString()}`, sub: `On ${billingSummary.lastPaymentDate}`, icon: CreditCard },
                  { label: "Avg Monthly", value: `Rs. ${billingSummary.avgMonthlyBill.toLocaleString()}`, sub: "Last 12 months", icon: Activity },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="stat-card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xl font-bold">{item.value}</p>
                    {item.sub && <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>}
                  </motion.div>
                ))}
              </motion.div>

              {/* Usage Preview */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-card border-none overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      Usage Analytics
                    </CardTitle>
                    <Link to="/usage">
                      <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="h-40 flex items-end justify-between gap-2 px-2">
                      {usageData.map((value, i) => (
                        <motion.div 
                          key={i} 
                          className="flex-1 flex flex-col items-center gap-2"
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${value}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className={`w-full rounded-t-lg transition-all cursor-pointer hover:opacity-80 ${
                              i === 10 ? 'gradient-primary shadow-soft' : 'bg-secondary hover:bg-primary/20'
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">{monthLabels[i]}</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Monthly Consumption (Units)
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Connection Info */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card className="shadow-card border-none overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-secondary/50 to-transparent pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    {[
                      { icon: User, label: "Subscription No", value: user.subscriptionNo },
                      { icon: Droplets, label: "Connection Type", value: user.type },
                      { icon: MapPin, label: "Region", value: user.region },
                      { icon: Phone, label: "Phone", value: user.phone },
                      { icon: Mail, label: "Email", value: user.email },
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-medium truncate">{item.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { to: "/usage", icon: Activity, label: "View Usage Analytics" },
                      { to: "/profile", icon: User, label: "Update Profile" },
                      { to: "/notifications", icon: Sparkles, label: "Check Notifications" },
                    ].map((action, index) => (
                      <Link key={index} to={action.to}>
                        <motion.div 
                          whileHover={{ scale: 1.02, x: 4 }} 
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button variant="outline" className="w-full justify-between h-12 rounded-xl group">
                            <span className="flex items-center gap-3">
                              <action.icon className="w-4 h-4 text-primary" />
                              {action.label}
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Button>
                        </motion.div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;