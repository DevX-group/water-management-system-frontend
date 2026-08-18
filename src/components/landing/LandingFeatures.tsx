import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Zap, Waves, CreditCard, Activity } from 'lucide-react';

const features = [
  {
    title: "Deep Dive Analytics",
    description: "Monitor your daily water consumption with beautiful, easy-to-understand charts. Catch leaks early and save money.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-blue-600 text-white shadow-blue-500/20",
    bgIcon: <Waves className="w-48 h-48 absolute -bottom-10 -right-10 text-blue-500/5" />
  },
  {
    title: "Instant Smart Payments",
    description: "Settle your bills in seconds. Secure, encrypted transactions with instant confirmation and automated receipts.",
    icon: <CreditCard className="w-6 h-6" />,
    color: "bg-cyan-500 text-white shadow-cyan-500/20",
    bgIcon: <Zap className="w-48 h-48 absolute -bottom-10 -right-10 text-cyan-500/5" />
  },
  {
    title: "AI-Powered Assistance",
    description: "Have a question? Our 24/7 intelligent assistant is always ready to help you with billing queries or service requests.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-emerald-500 text-white shadow-emerald-500/20",
    bgIcon: <Activity className="w-48 h-48 absolute -bottom-10 -right-10 text-emerald-500/5" />
  }
];

export const LandingFeatures = () => {
  return (
    <section className="py-32 bg-transparent relative z-20 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8 text-slate-900"
          >
            Everything you need, <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              nothing you don't.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 font-light max-w-2xl mx-auto"
          >
            A radically simpler approach to managing your utility services. 
            Designed for speed, clarity, and total peace of mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative group rounded-3xl bg-white/80 backdrop-blur-xl border border-white overflow-hidden hover:border-blue-200 transition-colors shadow-sm hover:shadow-[0_8px_30px_rgba(0,100,200,0.08)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50/50 to-transparent" />
              
              <div className="relative p-10 h-full flex flex-col z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${feature.color}`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold tracking-tight mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
              {feature.bgIcon}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-blue-500 transition-all duration-700 ease-out`} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
