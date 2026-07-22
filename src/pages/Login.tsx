import '@/index.css';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { LoginRightPanel, LoginForm } from "@/components/auth/LoginPanels";
import { useLogin } from "@/hooks/useLogin";

const Login = () => {
  const {
    formData,
    showPassword,
    loginError,
    handleSubmit,
    handleNicChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleRememberChange
  } = useLogin();

  return (
    <div className="min-h-screen flex">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8 relative overflow-y-auto min-h-screen">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="w-full max-w-md relative">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl">
            <Link to="/" className="flex items-center gap-3 mb-10">
              <motion.div whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <span className="text-2xl font-bold text-gradient">Hydro Pay</span>
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
              <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
              <p className="text-muted-foreground text-lg">Sign in to your account to continue</p>
            </motion.div>
            <LoginForm
              formData={formData} showPassword={showPassword} loginError={loginError}
              onNicChange={handleNicChange}
              onPasswordChange={handlePasswordChange}
              onTogglePassword={togglePasswordVisibility}
              onRememberChange={handleRememberChange}
              onSubmit={handleSubmit}
            />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-center mt-8 text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">Create one</Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
      <LoginRightPanel />
      <div className="hidden lg:block w-[45%] shrink-0" />
    </div>
  );
};

export default Login;