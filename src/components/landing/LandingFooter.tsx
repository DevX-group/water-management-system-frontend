import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const LandingFooter = () => {
  return (
    <footer className="bg-transparent relative z-20 transition-colors duration-300 overflow-hidden">
      
     

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5 pr-10">
            <Link to="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Droplet className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">HydroPay</span>
            </Link>
            <p className="text-base text-muted-foreground font-light leading-relaxed max-w-md">
              A beautifully engineered platform designed to simplify utility management for the modern home. Track, pay, and resolve issues effortlessly.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-semibold mb-6 text-foreground tracking-wide text-sm uppercase">Platform</h4>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li><Link to="/login" className="hover:text-blue-600 transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-blue-600 transition-colors">Create Account</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing & Plans</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold mb-6 text-foreground tracking-wide text-sm uppercase">Legal</h4>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold mb-6 text-foreground tracking-wide text-sm uppercase">Connect</h4>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Journal</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Support Center</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground font-light">
            © {new Date().getFullYear()} HydroPay Technologies Inc. All rights reserved.
          </p>
          <div className="flex gap-3">
            {['X', 'In', 'Ig'].map((social, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:bg-blue-500 hover:text-white transition-all">
                <span className="text-xs font-bold">{social}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
