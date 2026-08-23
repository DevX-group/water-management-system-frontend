import React, { useEffect } from 'react';
import '@/index.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import Usage from "./pages/Usage";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import CustomerSettings from "./pages/CustomerSettings";
import NotFound from "./pages/NotFound";
import AdminIndex from "./pages/AdminIndex";
import { CustomerInquiryPage } from "./pages/CustomerInquiryPage";
import { AboutUs } from "./pages/Info/AboutUs";
import { PrivacyPolicy } from "./pages/Info/PrivacyPolicy";
import { TermsOfService } from "./pages/Info/TermsOfService";
import { CookiePolicy } from "./pages/Info/CookiePolicy";
import { Blog } from "./pages/Info/Blog";
import CustomerPayments from "./pages/CustomerPayments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";

// Auth integrations
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { ThemeProvider } from "./contexts/ThemeProvider";
import { FontSizeProvider } from "./contexts/FontSizeProvider";
import { SystemDetailsProvider } from "./context/SystemDetailsContext";

const PWAManifestController: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const role = user?.role ?? "";
    const isMeterReader = role.toUpperCase() === "METER_READER" || role === "meter_reader";
    const existingManifest = document.querySelector('link[rel="manifest"]');

    if (isMeterReader) {
  if (!existingManifest) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.webmanifest";
    document.head.appendChild(link);
  }

  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
} else {
  if (existingManifest) {
    existingManifest.remove();
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => reg.unregister());
    });
  }
}
  }, [user?.role]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" attribute="class" disableTransitionOnChange>
    <FontSizeProvider defaultSize="medium" storageKey="vite-ui-font-size">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SystemDetailsProvider>
          <PWAManifestController />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/activate" element={<Signup />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/blog" element={<Blog />} />

                {/* Customer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                  <Route path="/customer/dashboard" element={<Dashboard />} />
                  <Route path="/customer/bills" element={<Bills />} />
                  <Route path="/customer/payments" element={<CustomerPayments />} />
                  <Route path="/customer/payments/success" element={<PaymentSuccess />} />
                  <Route path="/customer/payments/failed" element={<PaymentFailed />} />
                  <Route path="/customer/usage" element={<Usage />} />
                  <Route path="/customer/notifications" element={<Notifications />} />
                  <Route path="/customer/inquiry" element={<CustomerInquiryPage />} />
                  <Route path="/customer/profile" element={<Profile />} />
                  <Route path="/customer/settings" element={<CustomerSettings />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SYSTEM_ADMIN', 'CUSTOMER_HANDLER', 'METER_READER']} />}>
                  <Route path="/admin/*" element={<AdminIndex />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </SystemDetailsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </FontSizeProvider>
  </ThemeProvider>
);

export default App;
