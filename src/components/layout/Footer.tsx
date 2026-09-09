import '@/index.css';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useSystemDetails } from '@/context/SystemDetailsContext';
import { useTranslation } from 'react-i18next';

const footerLinks = {
  product: [
    { nameKey: "customer.dashboard", path: "/customer/dashboard" },
    { nameKey: "customer.bills", path: "/customer/bills" },
    { nameKey: "customer.payments", path: "/customer/payments" },
  ],
  company: [
    { nameKey: "footer.about", path: "/about" },
    { nameKey: "footer.blog", path: "/blog" },
  ],
  legal: [
    { nameKey: "footer.privacy", path: "/privacy" },
    { nameKey: "footer.terms", path: "/terms" },
    { nameKey: "footer.cookies", path: "/cookies" },
  ],
};

export const Footer = () => {
  const { systemDetails } = useSystemDetails();
  const { t } = useTranslation();

  const companyName = systemDetails?.companyName || 'HydroPay';
  const email = systemDetails?.officeEmail || 'support@hydropay.com';
  const phone = systemDetails?.officeContactNumber || '+94 41 227 6365';
  const address = systemDetails?.officeAddress || 'Galle, Sri Lanka';

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
                {t('landing:footer.description')}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{email}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{address}</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-5">{t('landing:footer.product')}</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                    >
                      {t(`navbar:${link.nameKey}`)}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-5">{t('landing:footer.company')}</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                    >
                      {t(`landing:${link.nameKey}`)}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-5">{t('landing:footer.legal')}</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                    >
                      {t(`landing:${link.nameKey}`)}
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
          © 2026 WaterFlow. {t('landing:footer.rights')}
        </p>
        
           
          </div>
        </div>
      </div>
    </footer>
  );
};