import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="bg-transparent border-t border-blue-200/50 pt-20 pb-10 relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Droplet className="text-blue-600 w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase text-slate-900">HydroPay</span>
            </div>
            <p className="text-sm text-slate-600 font-light max-w-xs leading-relaxed">
              Simplifying utility management for modern homes. Track, pay, and resolve issues effortlessly.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-slate-900 tracking-wide">Product</h4>
            <ul className="space-y-4 text-sm font-light text-slate-600">
              <li><Link to="/login" className="hover:text-blue-600 transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-blue-600 transition-colors">Create Account</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-slate-900 tracking-wide">Legal</h4>
            <ul className="space-y-4 text-sm font-light text-slate-600">
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-slate-900 tracking-wide">Connect</h4>
            <ul className="space-y-4 text-sm font-light text-slate-600">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-light">
            © {new Date().getFullYear()} HydroPay Services. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/80 border border-blue-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
              <span className="text-xs font-bold">X</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/80 border border-blue-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
              <span className="text-xs font-bold">in</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
