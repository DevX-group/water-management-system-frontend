import '@/index.css';
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import { CustomerChatbot } from "../chatbot/CustomerChatbot";

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
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer />}
      
      {/* Floating Global Chatbot */}
      <CustomerChatbot />
    </div>
  );
};
