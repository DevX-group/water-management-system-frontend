import '@/index.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { validateNIC } from '@/validations/userValidations';

const getErrorStatus = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [nic, setNic] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedNic = nic.trim().toUpperCase();

    if (!normalizedNic) {
      setError('Please enter your NIC number.');
      return;
    }

    if (!validateNIC(normalizedNic)) {
      setError(
        'Please enter a valid NIC (e.g., 123456789V or 200012345678).'
      );
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await authService.requestPasswordReset({
        nic: normalizedNic,
      });

      navigate('/verify-reset-otp', {
        state: {
          nic: normalizedNic,
          requestAccepted: true,
        },
      });
    } catch (requestError) {
      const status = getErrorStatus(requestError);

      if (status === 429) {
        setError(
          'Too many requests. Please try again later.'
        );
      } else {
        setError(
          'We could not process your request. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative"
        >
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/80 dark:border-gray-700/80 rounded-3xl p-7 sm:p-8 shadow-xl">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </div>

              <span className="text-2xl font-bold text-gradient">
                Hydro Pay
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-3">
              Forgot your password?
            </h1>

            <p className="text-muted-foreground mb-8">
              Enter your NIC and we will send a verification
              code if an account is eligible for recovery.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="forgot-password-nic">
                  NIC Number
                </Label>

                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary"
                    aria-hidden="true"
                  />

                  <Input
                    id="forgot-password-nic"
                    value={nic}
                    onChange={(event) => {
                      setNic(event.target.value);
                      setError('');
                    }}
                    placeholder="Enter your NIC"
                    autoComplete="off"
                    autoCapitalize="characters"
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error
                        ? 'forgot-password-error'
                        : undefined
                    }
                    className="h-14 rounded-xl pl-12 text-base"
                  />
                </div>

                {error && (
                  <p
                    id="forgot-password-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 gradient-primary rounded-xl text-base"
              >
                {isSubmitting
                  ? 'Sending code...'
                  : 'Send verification code'}

                {!isSubmitting && (
                  <ArrowRight className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </motion.main>
      </div>

      <div className="hidden lg:flex w-[45%] fixed right-0 top-0 h-screen gradient-dark items-center justify-center p-12 text-white">
        <div className="text-center max-w-md">
          <Droplets
            className="w-20 h-20 mx-auto mb-8"
            aria-hidden="true"
          />

          <h2 className="text-4xl font-bold mb-4">
            Secure account recovery
          </h2>

          <p className="text-white/70 text-lg">
            Verify your identity to continue managing your
            water services.
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-[45%] shrink-0" />
    </div>
  );
};

export default ForgotPassword;