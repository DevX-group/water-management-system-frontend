import '@/index.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Activity, 
  BellRing, 
  CreditCard, 
  Headphones, 
  Droplets, 
  ShieldCheck 
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AboutUs = () => {
  const pillars = [
    {
      icon: <Activity className="text-primary" size={24} />,
      title: "Smart Monitoring",
      desc: "Automated tracking of meter readings to prevent manual errors and provide instant usage data."
    },
    {
      icon: <BellRing className="text-amber-500" size={24} />,
      title: "Intelligent Alerts",
      desc: "Real-time notification systems that detect usage spikes, potential leaks, and overdue payments."
    },
    {
      icon: <CreditCard className="text-success" size={24} />,
      title: "Transparent Billing",
      desc: "A secure, digital-first approach to financial management, allowing customers to view history and settle balances."
    },
    {
      icon: <Headphones className="text-purple-500" size={24} />,
      title: "Reliable Support",
      desc: "Integrated communication channels connecting customers directly with technical and billing teams."
    }
  ];

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
           
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              About <span className="text-gradient">HydroPay</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              HydroPay is a comprehensive water management solution designed to bridge the gap between utility providers and consumers. Built with a focus on efficiency, transparency, and sustainability.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-card bg-secondary/10 overflow-hidden">
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="text-primary" /> Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We transform traditional utility management into a seamless digital experience. 
                    Our system empowers users with real-time insights into their water consumption 
                    while providing administrators with powerful tools for automated billing and 
                    smart anomaly detection.
                  </p>
                </div>
                <div className="w-full md:w-1/3 h-48 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <Droplets size={64} className="animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pillars Grid */}
          <div className="space-y-8">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center">
              Our Core <span className="text-primary">Pillars</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow group">
                    <CardContent className="p-6 flex gap-4">
                      <div className="p-3 rounded-xl bg-secondary/50 group-hover:scale-110 transition-transform h-fit">
                        {pillar.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{pillar.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action/Closing */}
          <motion.div variants={itemVariants} className="text-center py-8">
            <p className="text-xl font-medium text-slate-700 italic">
              "Dedicated to modernizing the way we manage our most precious resource."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};