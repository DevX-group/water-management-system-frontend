import '@/index.css';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignupLeftPanel, SignupLogo } from '@/components/auth/SignupPanels';
import { SignupForm } from '@/components/auth/SignupForm';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

import type { SignupFormData, SignupFormErrors } from '@/types/auth';

const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validateNIC   = (n: string) => /^[0-9]{9}[VvXx]$/.test(n) || /^[0-9]{12}$/.test(n);

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activationToken = searchParams.get('token') || '';
  const activationMode = Boolean(activationToken);
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({ accountHolder: '', email: '', nic: '', password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<SignupFormErrors>({});

  const handleChangeField = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: SignupFormErrors = {};
    if (!formData.password) errors.password = 'Please enter your password.';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    if (!activationMode) {
      if (!formData.email) errors.email = 'Please enter your email.';
      else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address.';
      if (!formData.nic) errors.nic = 'Please enter your NIC number.';
      else if (!validateNIC(formData.nic)) errors.nic = 'Please enter a valid NIC (e.g., 123456789V or 200012345678).';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (activationMode) {
      try {
        await authService.activate({
          token: activationToken,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        toast({ title: 'Account Activated', description: 'You can now log in with your NIC and password.' });
        navigate('/login');
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Activation failed. Please try again.';
        toast({ title: 'Activation Failed', description: message, variant: 'destructive' });
      }
      return;
    }

    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <SignupLeftPanel />

      <div className="flex flex-1 lg:ml-[45%] min-h-screen items-start justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md py-8">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl">
            <SignupLogo />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{activationMode ? 'Activate Account' : 'Sign Up'}</h1>
              <p className="text-muted-foreground">
                {activationMode
                  ? 'Set your password to activate your account.'
                  : 'Welcome! Create your account to get started.'}
              </p>
            </motion.div>
            <SignupForm
              formData={formData} formErrors={formErrors}
              showPassword={showPassword} showConfirmPassword={showConfirmPassword}
              onTogglePassword={() => setShowPassword(p => !p)}
              onToggleConfirm={() => setShowConfirmPassword(p => !p)}
              onChangeField={handleChangeField}
              onSubmit={handleSubmit}
              activationMode={activationMode}
              submitLabel={activationMode ? 'Activate Account' : 'Register'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
