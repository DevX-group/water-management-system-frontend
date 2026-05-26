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
import NotFound from "./pages/NotFound";
import AdminIndex from "./pages/AdminIndex";
import {CustomerInquiryPage} from "./pages/CustomerInquiryPage";
import { AboutUs } from "./pages/Info/AboutUs";
import { PrivacyPolicy } from "./pages/Info/PrivacyPolicy";
import { TermsOfService } from "./pages/Info/TermsOfService";
import { CookiePolicy } from "./pages/Info/CookiePolicy";
import { Blog } from "./pages/Info/Blog";
import CustomerPayments from "./pages/CustomerPayments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

// Auth integrations
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SYSTEM_ADMIN']} />}>
              <Route path="/admin/*" element={<AdminIndex />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
