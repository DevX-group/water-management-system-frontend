import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplets, Eye, EyeOff, ArrowRight, Shield, Zap, Bell, Mail, Lock } from "lucide-react";

const features = [
  { icon: Shield, text: "Secure & encrypted" },
  { icon: Zap, text: "Instant payments" },
  { icon: Bell, text: "Smart alerts" },
];

const VALID_CREDENTIALS = [
  { email: "superadmin@gmail.com", password: "sa@123", route: "/admin" },
  { email: "customer@gmail.com", password: "cust@123", route: "/customer/dashboard" },
];

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Empty field validation
    if (!formData.email && !formData.password) {
      setLoginError("Please enter your email and password.");
      return;
    }

    if (!formData.email) {
      setLoginError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setLoginError("Please enter your password.");
      return;
    }

    const matchedUser = VALID_CREDENTIALS.find(
      (cred) =>
        cred.email === formData.email.toLowerCase() &&
        cred.password === formData.password
    );

    if (matchedUser) {
      navigate(matchedUser.route);
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Scrollable Form */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8 relative overflow-y-auto min-h-screen"
      >
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="w-full max-w-md relative">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-10">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
              >
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <span className="text-2xl font-bold text-gradient">Hydro Pay</span>
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
              <p className="text-muted-foreground text-lg">Sign in to your account to continue</p>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Email Field with Icon */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setLoginError("");
                    }}
                    style={{ caretColor: "black" }}
                    className="h-14 rounded-xl pl-12 input-premium text-base bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password Field with Icon */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setLoginError("");
                    }}
                    style={{ caretColor: "black" }}
                    className="h-14 rounded-xl pl-12 pr-14 input-premium text-base bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Error Message */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 backdrop-blur-sm"
                >
                  <span>⚠️ {loginError}</span>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    className="rounded-md"
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" className="w-full h-14 gradient-primary shadow-soft rounded-xl text-base gap-2 btn-shine">
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-8 text-muted-foreground"
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Create one
              </Link>
            </motion.p>

          </div>
        </div>
      </motion.div>

      {/* Right Panel - Fixed */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-[45%] fixed right-0 top-0 h-screen gradient-dark items-center justify-center p-12 overflow-hidden"
      >
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
        />
        
        <div className="relative text-center text-white max-w-md">
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 shadow-glow"
          >
            <Droplets className="w-14 h-14" />
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4">Manage Your Water Bills</h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Track consumption, pay instantly, and get smart insights all in one place.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/40 to-cyan-500/40 backdrop-blur flex items-center justify-center border border-white/20">
                  <feature.icon className="w-5 h-5 text-cyan-300" />
                </div>
                <span className="font-medium text-white/80">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Spacer to prevent left panel content going under fixed right panel */}
      <div className="hidden lg:block w-[45%] shrink-0" />

    </div>
  );
};

export default Login;