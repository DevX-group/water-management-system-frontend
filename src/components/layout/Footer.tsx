import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bills", path: "/bills" },
    { name: "Payments", path: "/payments" },
    { name: "Analytics", path: "/usage" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ],
};



export const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Main Footer */}
      <div className="gradient-dark py-16 relative">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">HydroPay</span>
              </Link>
              <p className="text-white/60 max-w-sm leading-relaxed">
                The modern way to manage your water bills. Track consumption, 
                pay instantly, and get intelligent insights.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">support@hydropay.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">+94 41 227 6365</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Colombo, Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-5">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-5">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-5">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/50 text-sm text-center">
          © 2025 WaterFlow. All rights reserved.
        </p>
        
           
          </div>
        </div>
      </div>
    </footer>
  );
};