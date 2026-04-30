import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Eye, EyeOff, User, Mail, Lock, CreditCard } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    accountHolder: "",
    email: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNIC = (nic: string) => {
    // Sri Lanka NIC validation
    // Old format: 9 digits + V/X (e.g., 123456789V)
    // New format: 12 digits (e.g., 200012345678)
    const oldNIC = /^[0-9]{9}[VvXx]$/;
    const newNIC = /^[0-9]{12}$/;
    return oldNIC.test(nic) || newNIC.test(nic);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = { email: "", nic: "", password: "", confirmPassword: "" };
    let hasError = false;

    if (!formData.email) {
      errors.email = "Please enter your email.";
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.nic) {
      errors.nic = "Please enter your NIC number.";
      hasError = true;
    } else if (!validateNIC(formData.nic)) {
      errors.nic = "Please enter a valid NIC number (e.g., 123456789V or 200012345678).";
      hasError = true;
    }

    if (!formData.password) {
      errors.password = "Please enter your password.";
      hasError = true;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    setFormErrors(errors);

    if (!hasError) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel - Fixed Visual */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-[45%] fixed left-0 top-0 h-screen gradient-primary items-center justify-center p-8 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative text-center text-primary-foreground max-w-md">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center mx-auto mb-8"
          >
            <User className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Account Holder</h2>
          <p className="text-primary-foreground/80">
            Create your account and start managing your water bills with ease.
            Join thousands of satisfied customers.
          </p>
        </div>
      </motion.div>

      {/* Right Panel - Scrollable Form */}
      <div className="flex flex-1 lg:ml-[45%] min-h-screen items-start justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md py-8">

          {/* Glassmorphism Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8">
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
              <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
              <p className="text-muted-foreground">Welcome! Create your account to get started.</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="accountHolder"
                    placeholder="Enter account holder name"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    className="h-12 pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    style={{ caretColor: "black" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFormErrors({ ...formErrors, email: "" });
                    }}
                    className="h-12 pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    style={{ caretColor: "black" }}
                  />
                </div>
                {formErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    ⚠️ {formErrors.email}
                  </motion.p>
                )}
              </div>

              {/* NIC */}
              <div className="space-y-2">
                <Label htmlFor="nic">NIC Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="nic"
                    placeholder="Enter your NIC (e.g., 123456789V)"
                    value={formData.nic}
                    onChange={(e) => {
                      setFormData({ ...formData, nic: e.target.value });
                      setFormErrors({ ...formErrors, nic: "" });
                    }}
                    className="h-12 pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    style={{ caretColor: "black" }}
                  />
                </div>
                {formErrors.nic && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    ⚠️ {formErrors.nic}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setFormErrors({ ...formErrors, password: "" });
                    }}
                    className="h-12 pl-12 pr-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    style={{ caretColor: "black" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    ⚠️ {formErrors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setFormErrors({ ...formErrors, confirmPassword: "" });
                    }}
                    className="h-12 pl-12 pr-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    style={{ caretColor: "black" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    ⚠️ {formErrors.confirmPassword}
                  </motion.p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 gradient-primary shadow-soft hover:opacity-90 transition-opacity">
                Register
              </Button>

            </motion.form>

            <p className="text-center mt-6 text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
