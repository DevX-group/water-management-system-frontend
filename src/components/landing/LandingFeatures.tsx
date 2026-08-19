import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, ShieldCheck, CreditCard } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    title: "Deep Dive Analytics",
    subtitle: "Insights that flow",
    description: "Monitor your daily water consumption with beautiful, easy-to-understand charts. Catch anomalies instantly and understand your usage patterns like never before.",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-400",
    mockup: (
      <div className="w-full h-full max-h-[350px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-5 flex flex-col justify-end relative overflow-hidden shadow-2xl mx-auto">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-foreground">Usage Trends</span>
        </div>
        <div className="flex items-end gap-2 h-40 mt-16">
          {[40, 70, 45, 90, 65, 85, 100, 60, 45, 75].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    )
  },
  {
    title: "Instant Smart Payments",
    subtitle: "Frictionless checkout",
    description: "Settle your bills in seconds. Secure, encrypted transactions with instant confirmation and automated digital receipts delivered right to your dashboard.",
    icon: <CreditCard className="w-8 h-8" />,
    color: "from-cyan-400 to-emerald-400",
    reverse: true,
    mockup: (
      <div className="w-full h-full max-h-[350px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden shadow-2xl mx-auto">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="w-full max-w-sm mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex justify-between items-center mb-8">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              <div className="w-10 h-6 bg-white/20 rounded-md" />
            </div>
            <div className="text-3xl font-light tracking-widest mb-2 opacity-90">•••• •••• •••• 4242</div>
            <div className="flex justify-between text-sm opacity-70">
              <span>A.B. Perera</span>
              <span>12/28</span>
            </div>
         </motion.div>
      </div>
    )
  },
  {
    title: "AI-Powered Assistance",
    subtitle: "Always on duty",
    description: "Have a question? Our 24/7 intelligent assistant is always ready to help you with billing queries, leak detection tips, or service requests without waiting on hold.",
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "from-emerald-400 to-teal-500",
    mockup: (
      <div className="w-full h-full max-h-[350px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-5 flex flex-col relative overflow-hidden shadow-2xl mx-auto">
         <div className="flex-1 overflow-hidden flex flex-col justify-end gap-4 pb-4">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="self-end max-w-[80%] bg-blue-600 text-white p-4 rounded-2xl rounded-br-sm shadow-md"
            >
              Why is my bill higher this month?
            </motion.div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="self-start max-w-[85%] bg-white dark:bg-gray-800 text-foreground p-4 rounded-2xl rounded-bl-sm shadow-sm border border-border"
            >
              I noticed a 15% increase in your usage between the 12th and 14th. This pattern usually indicates a small leak or leaving a tap running. Would you like me to schedule an inspection?
            </motion.div>
         </div>
      </div>
    )
  }
];

export const LandingFeatures = () => {
  return (
    <section className="py-24 md:py-32 bg-transparent relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 text-foreground"
          >
            A radically simpler approach.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-light max-w-2xl mx-auto"
          >
            Designed for speed, clarity, and total peace of mind.
          </motion.p>
        </div>

        <div className="flex flex-col gap-24 md:gap-32 group">
          {features.map((feature, idx) => (
            <div key={idx} className={`flex flex-col ${feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16 transition-all duration-700 ease-out group-hover:opacity-10 group-hover:blur-sm hover:!opacity-100 hover:!blur-none hover:-translate-y-4 hover:scale-[1.02]`}>
              
              {/* Text Content */}
              <div className="flex-1 w-full text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-8 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h4 className={`text-xs font-bold tracking-widest uppercase mb-3 bg-clip-text text-transparent bg-gradient-to-r ${feature.color}`}>
                    {feature.subtitle}
                  </h4>
                  <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-foreground leading-[1.1]">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </div>

              {/* Visual Mockup */}
              <div className="flex-1 w-full relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full h-full relative z-10"
                >
                  {feature.mockup}
                </motion.div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
