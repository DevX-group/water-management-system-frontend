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
import Payments from "./pages/Payments";
import Usage from "./pages/Usage";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminIndex from "./pages/AdminIndex";
import { PaymentsPage } from "./pages/PaymentsPage";
import {CustomerInquiryPage} from "./pages/CustomerInquiryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<Dashboard />} />
          <Route path="/customer/bills" element={<Bills />} />
          <Route path="/customer/payments" element={<Payments />} />
          <Route path="/customer/usage" element={<Usage />} />
          <Route path="/customer/notifications" element={<Notifications />} />
          <Route path="/customer/inquiry" element={<CustomerInquiryPage />} />
          <Route path="/customer/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminIndex />} />
          
          {/* Legacy Routes for backwards compatibility */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/customer/inquiry" element={<CustomerInquiryPage />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
