import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplet, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-transparent transition-colors duration-300">
      <div className="absolute inset-0 z-0 gradient-mesh opacity-60"></div>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/10 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-400/10 blur-[120px]" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-blue-200/50 text-blue-700 mb-8 backdrop-blur-sm shadow-sm">
                <Droplet className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">HydroPay is Live</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6 text-slate-900">
                Fluid utility <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  management.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-light">
                Track every drop, pay in seconds, and stay informed with a beautifully engineered platform designed for the modern home.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-lg hover:shadow-blue-500/25 transition-all bg-blue-600 hover:bg-blue-700 text-white border-none">
                  <Link to="/signup">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-medium border-blue-200 text-blue-900 hover:bg-white hover:text-blue-700 hover:border-blue-300 transition-all bg-white/50 backdrop-blur-sm shadow-sm">
                  <Link to="/login">
                    Sign In to Dashboard
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md aspect-square"
            >
              <motion.div 
                animate={{ 
                  borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,100,200,0.1)] z-10 flex flex-col items-center justify-center p-10 overflow-hidden"
              >
                <h3 className="text-2xl font-bold mb-2 tracking-tight text-slate-800">Active Flow</h3>
                <p className="text-blue-600 text-xs tracking-widest uppercase font-semibold mb-8">System Optimal</p>
                
                <div className="w-full bg-white/90 rounded-2xl p-5 border border-blue-50 shadow-sm backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-500">Monthly Usage</span>
                    <span className="text-sm font-bold text-slate-900">14.2 Units</span>
                  </div>
                  <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" 
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-8 z-20 bg-white/90 backdrop-blur-xl border border-blue-50 p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Payment Secured</p>
                  <p className="text-sm font-bold text-slate-900">LKR 4,250</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
