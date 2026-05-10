import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplets, User } from 'lucide-react';

export const SignupLeftPanel: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    className="hidden lg:flex w-[45%] fixed left-0 top-0 h-screen gradient-primary items-center justify-center p-8 overflow-hidden"
  >
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
    </div>
    <div className="relative text-center text-primary-foreground max-w-md">
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center mx-auto mb-8"
      >
        <User className="w-12 h-12" />
      </motion.div>
      <h2 className="text-3xl font-bold mb-4">Account Holder</h2>
      <p className="text-primary-foreground/80">
        Create your account and start managing your water bills with ease. Join thousands of satisfied customers.
      </p>
    </div>
  </motion.div>
);

export const SignupLogo: React.FC = () => (
  <Link to="/" className="flex items-center gap-2 mb-8">
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
    >
      <Droplets className="w-6 h-6 text-primary-foreground" />
    </motion.div>
    <span className="text-2xl font-bold text-gradient">Hydro Pay</span>
  </Link>
);
