import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplet, MoveRight, ChevronRight, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent transition-colors duration-500 pt-20">
      
      {/* Clean Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Deep blue backdrop only, no glowing orbs */}
        <div className="absolute inset-0 bg-transparent dark:bg-background"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/50 border border-border mb-12 mt-10"
        >
          <motion.div 
            animate={{ y: [0, -3, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Droplet className="w-4 h-4 text-blue-500 fill-blue-500" />
          </motion.div>
          <span className="text-sm font-medium tracking-wide text-foreground">Hydropay is live now</span>
        </motion.div>
        
        {/* Hero Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] leading-[0.95] mb-8 text-foreground">
            Fluid tracking.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400">
              Crystal clear.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto font-light tracking-tight">
            An immersive platform to monitor every drop, settle bills instantly, and gain unparalleled insight into your utility flow.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
        >
          <Button asChild size="lg" className="w-full sm:w-auto h-16 px-10 rounded-full text-lg font-semibold shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300">
            <Link to="/signup">
              Dive In Now <MoveRight className="ml-3 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 rounded-full text-lg font-medium border-border text-foreground hover:bg-accent transition-all duration-300">
            <Link to="/login" className="flex items-center">
              Enter Dashboard <ChevronRight className="ml-2 w-5 h-5 opacity-50" />
            </Link>
          </Button>
        </motion.div>

        {/* Professional Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto mt-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
          
          <div className="relative rounded-t-[2rem] bg-card border border-border border-b-0 shadow-sm p-4 overflow-hidden">
             
             {/* Mockup Top Bar */}
             <div className="h-4 flex items-center gap-1.5 px-4 mb-6 border-b border-border/50 pb-4">
               <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
               <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
               <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
             </div>

             {/* Mockup Content */}
             <div className="bg-background rounded-xl p-8 sm:p-12 border border-border/40 flex flex-col md:flex-row gap-12 items-center min-h-[300px] relative">
                
                {/* Large Bouncing Water Drop */}
                <div className="flex-1 flex justify-center items-center relative">
                  {/* Decorative background circle behind the drop */}
                  <div className="absolute w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
                  
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <div className="relative flex items-center justify-center w-40 h-40 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_bottom,white,transparent)] before:opacity-30 before:mix-blend-overlay">
                      <Droplet className="w-16 h-16 text-white fill-white opacity-90 drop-shadow-md" />
                    </div>
                  </motion.div>
                </div>

                {/* Usage Statistics */}
                <div className="flex-[1.5] w-full text-left relative z-10 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm mb-6 w-fit">
                    <Activity className="w-4 h-4" /> Real-time Meter Sync
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wider">Current Month</p>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">1,245 <span className="text-xl md:text-2xl text-muted-foreground font-normal">L</span></h3>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wider">Estimated Bill</p>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Rs 850</h3>
                    </div>
                  </div>

                  {/* Progress/Usage Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Safe Usage Zone</span>
                      <span>62% of monthly average</span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "62%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                  
                </div>
                
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
