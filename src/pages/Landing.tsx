import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Droplets, 
  Activity, 
  Zap, 
  Shield, 
  Bell,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  CreditCard
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-time Analytics",
    description: "Monitor consumption patterns with AI-powered insights and predictive analysis.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "One-click payments with multiple secure options including cards & wallets.",
    gradient: "from-amber-500 to-orange-400"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Proactive alerts for anomalies, due dates, and conservation tips.",
    gradient: "from-violet-500 to-purple-400"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption protecting your data and transactions.",
    gradient: "from-emerald-500 to-teal-400"
  },
];

const stats = [
  { value: "50K+", label: "Active Users", icon: TrendingUp },
  { value: "99.9%", label: "Uptime", icon: Clock },
  { value: "₹2Cr+", label: "Processed", icon: CreditCard },
];

const benefits = [
  "24/7 consumption tracking",
  "Paperless billing",
  "Multiple payment options",
  "Detailed analytics",
  "Instant confirmations",
  "Smart reminders",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Landing = () => {
  return (
    <MainLayout isAuthenticated={false}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Next-gen Water Management Platform
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Manage water bills{" "}
              <span className="text-gradient">effortlessly</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The modern way to track consumption, pay bills instantly, 
              and get intelligent insights. Join thousands managing smarter.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg" className="gradient-primary shadow-soft h-14 px-8 text-base rounded-xl gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-8 md:gap-16 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful tools designed for modern water bill management
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="h-full p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-500 card-interactive">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Why WaterFlow
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The smarter way to{" "}
                <span className="text-gradient">manage bills</span>
              </h2>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                Join thousands who've simplified their water bill management. 
                Experience the convenience of a truly modern platform.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              <Link to="/signup">
                <Button size="lg" className="gradient-primary shadow-soft h-14 px-8 text-base rounded-xl gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20" />
              <div className="relative glass-card rounded-3xl p-8 shadow-elevated">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Payable</p>
                      <p className="text-3xl font-bold">Rs. 2,390</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                      <Droplets className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-2xl">
                      <p className="text-sm text-muted-foreground">Last Bill</p>
                      <p className="text-xl font-bold mt-1">Rs. 3,200</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-2xl">
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="text-xl font-bold mt-1">Dec 15</p>
                    </div>
                  </div>

                  <div className="p-4 bg-success/10 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-success">Last payment received on Nov 30</span>
                  </div>
                  
                  <Button className="w-full h-12 gradient-primary rounded-xl text-base">
                    Pay Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center mx-auto mb-8">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg">
            Join thousands of satisfied customers managing their water bills with ease.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-base rounded-xl shadow-lg gap-2 hover:bg-white">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Landing;