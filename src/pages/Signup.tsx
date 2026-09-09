import '@/index.css';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignupLeftPanel, SignupLogo } from '@/components/auth/SignupPanels';
import { SignupForm } from '@/components/auth/SignupForm';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { useTranslation } from 'react-i18next';

import type { SignupFormData, SignupFormErrors } from '@/types/auth';

const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validateNIC   = (n: string) => /^[0-9]{9}[VvXx]$/.test(n) || /^[0-9]{12}$/.test(n);

const Signup = () => {
  const { t } = useTranslation('auth');
  const { t: toastT } = useTranslation('toasts');
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
    if (!formData.password) errors.password = t('signup.errors.passwordRequired', 'Please enter your password.');
    else if (formData.password.length < 6) errors.password = t('signup.errors.passwordLength', 'Password must be at least 6 characters.');
    if (!formData.confirmPassword) errors.confirmPassword = t('signup.errors.confirmPasswordRequired', 'Please confirm your password.');
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = t('signup.errors.passwordsDontMatch', 'Passwords do not match.');

    if (!activationMode) {
      if (!formData.email) errors.email = t('signup.errors.emailRequired', 'Please enter your email.');
      else if (!validateEmail(formData.email)) errors.email = t('signup.errors.emailInvalid', 'Please enter a valid email address.');
      if (!formData.nic) errors.nic = t('signup.errors.nicRequired', 'Please enter your NIC number.');
      else if (!validateNIC(formData.nic)) errors.nic = t('signup.errors.nicInvalid', 'Please enter a valid NIC (e.g., 123456789V or 200012345678).');
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
        toast({ title: t('signup.activateTitle', 'Account Activated'), description: toastT('accountActivated') });
        navigate('/login');
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Activation failed. Please try again.';
        toast({ title: t('signup.activationFailedTitle', 'Activation Failed'), description: message || toastT('activationFailed'), variant: 'destructive' });
      }
      return;
    }

    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <SignupLeftPanel />

      <div className="flex flex-1 lg:ml-[45%] min-h-screen items-start justify-center p-8 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md py-8">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/80 dark:border-gray-700/80 rounded-3xl p-8 shadow-xl">
            <SignupLogo />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground tracking-tight">
                {activationMode ? t('signup.activateTitle', 'Activate Account') : t('signup.title', 'Sign Up')}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {activationMode
                  ? t('signup.activateSubtitle', 'Set your password to activate your account.')
                  : t('signup.subtitle', 'Welcome! Create your account to get started.')}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
