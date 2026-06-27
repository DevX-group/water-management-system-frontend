import '@/index.css';
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MainLayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  showFooter?: boolean;
}

export const MainLayout = ({ 
  children, 
  isAuthenticated = false,
  showFooter = true 
}: MainLayoutProps) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const customerLanguage = localStorage.getItem("language") || "en";
    if (i18n.language !== customerLanguage) {
      i18n.changeLanguage(customerLanguage);
    }
  }, [i18n]);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
