import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '@/types/auth';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState<LoginFormData>({ 
    nic: "", 
    password: "", 
    rememberMe: false 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!formData.nic && !formData.password) { 
      setLoginError("Please enter your NIC and password."); 
      return; 
    }
    if (!formData.nic) { 
      setLoginError("Please enter your NIC."); 
      return; 
    }
    if (!formData.password) { 
      setLoginError("Please enter your password."); 
      return; 
    }

    try {
      const response = await authService.login({
        nic: formData.nic,
        password: formData.password
      });

      login(response);

      if (
        response.role === 'SUPER_ADMIN' ||
        response.role === 'SYSTEM_ADMIN' ||
        response.role === 'CUSTOMER_HANDLER' ||
        response.role === 'PAYMENT_HANDLER' ||
        response.role === 'METER_READER'
      ) {
        navigate('/admin');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error: any) {
      console.error('[auth] Login UI error', {
        nic: formData.nic,
        status: error?.response?.status ?? null,
        backendMessage: error?.response?.data?.message ?? null,
        networkError: !error?.response,
      });

      if (error.response && error.response.data && error.response.data.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("Invalid NIC or password. Please try again.");
      }
    }
  };

  const handleNicChange = (nic: string) => {
    setFormData(prev => ({ ...prev, nic }));
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
    handleNicChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleRememberChange
  };
};
