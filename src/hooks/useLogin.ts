import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '@/types/auth';

const VALID_CREDENTIALS = [
  { email: "superadmin@gmail.com", password: "sa@123", route: "/admin" },
  { email: "customer@gmail.com", password: "cust@123", route: "/customer/dashboard" },
];

export const useLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState<LoginFormData>({ 
    email: "", 
    password: "", 
    rememberMe: false 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

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
      (cred) => cred.email === formData.email.toLowerCase() && cred.password === formData.password
    );

    if (matchedUser) {
      navigate(matchedUser.route);
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setLoginError("");
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setLoginError("");
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleRememberChange = (rememberMe: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe }));
  };

  return {
    formData,
    showPassword,
    loginError,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleRememberChange
  };
};
