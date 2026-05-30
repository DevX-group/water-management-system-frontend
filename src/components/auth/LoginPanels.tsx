import '@/index.css';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplets, Shield, Zap, Bell } from 'lucide-react';

const features = [
  { icon: Shield, text: 'Secure & encrypted' },
  { icon: Zap,    text: 'Instant payments' },
  { icon: Bell,   text: 'Smart alerts' },
];

export const LoginRightPanel: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
    className="hidden lg:flex w-[45%] fixed right-0 top-0 h-screen gradient-dark items-center justify-center p-12 overflow-hidden"
  >
    <div className="absolute inset-0 gradient-mesh opacity-30" />
    <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
    <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />

    <div className="relative text-center text-white max-w-md">
      <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 shadow-glow">
        <Droplets className="w-14 h-14" />
      </motion.div>
      <h2 className="text-4xl font-bold mb-4">Manage Your Water Bills</h2>
      <p className="text-white/70 text-lg mb-10 leading-relaxed">
        Track consumption, pay instantly, and get smart insights all in one place.
      </p>
      <div className="space-y-4">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 backdrop-blur flex items-center justify-center border border-white/20">
              <f.icon className="w-5 h-5 text-accent" />
            </div>
            <span className="font-medium text-white/80">{f.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

interface LoginFormProps {
  formData:     { email: string; password: string; rememberMe: boolean };
  showPassword: boolean;
  loginError:   string;
  onEmailChange:    (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onRememberChange: (v: boolean) => void;
  onSubmit:         (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData, showPassword, loginError,
  onEmailChange, onPasswordChange, onTogglePassword, onRememberChange, onSubmit,
}) => {
  // Lazy imports to keep bundle clean
  const { Input }    = require('@/components/ui/input');
  const { Label }    = require('@/components/ui/label');
  const { Button }   = require('@/components/ui/button');
  const { Checkbox } = require('@/components/ui/checkbox');
  const { Eye, EyeOff, Mail, Lock, ArrowRight } = require('lucide-react');

  return (
    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
          <Input id="email" type="email" placeholder="Enter your email" value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onEmailChange(e.target.value); }}
            style={{ caretColor: 'black' }}
            className="h-14 rounded-xl pl-12 input-premium text-base bg-card border-gray-200 text-gray-900 placeholder:text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onPasswordChange(e.target.value); }}
            style={{ caretColor: 'black' }}
            className="h-14 rounded-xl pl-12 pr-14 input-premium text-base bg-card border-gray-200 text-gray-900 placeholder:text-gray-400" />
          <button type="button" onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {loginError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 backdrop-blur-sm">
          <span>⚠️ {loginError}</span>
        </motion.div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox id="rememberMe" checked={formData.rememberMe}
            onCheckedChange={(c: boolean) => onRememberChange(c)} className="rounded-md" />
          <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">Remember me</Label>
        </div>
        <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
      </div>
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button type="submit" className="w-full h-14 gradient-primary shadow-soft rounded-xl text-base gap-2 btn-shine">
          Sign In <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.form>
  );
};
