import '@/index.css';
import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';

const INVALID_MESSAGE =
  'This verification code is invalid or has expired.';

const GENERIC_MESSAGE =
  'If an account exists, a verification code has been sent to the registered recovery contact.';

const NETWORK_ERROR_MESSAGE =
  'We could not verify the code. Please check your connection and try again.';

interface ResetLocationState {
  nic?: string;
  requestAccepted?: boolean;
}

const getErrorStatus = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status;

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ResetLocationState | null;
  const nic = state?.nic;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState(
    state?.requestAccepted ? GENERIC_MESSAGE : ''
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    state?.requestAccepted ? 60 : 0
  );

  useEffect(() => {
    if (!nic) {
      navigate('/forgot-password', {
        replace: true,
      });
    }
  }, [navigate, nic]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsRemaining((seconds) =>
        Math.max(0, seconds - 1)
      );
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [secondsRemaining]);

  if (!nic) {
    return null;
  }

  const requestCode = async () => {
    if (
      secondsRemaining > 0
      || isResending
      || isVerifying
    ) {
      return;
    }

    setError('');
    setStatusMessage('');
    setIsResending(true);

    try {
      await authService.requestPasswordReset({ nic });

      // A new request invalidates the previous OTP.
      setOtp('');
      setSecondsRemaining(60);
      setStatusMessage(GENERIC_MESSAGE);
    } catch (requestError) {
      const status = getErrorStatus(requestError);

      if (status === 429) {
        setError(
          'Too many requests. Please try again later.'
        );
      } else {
        setError(
          'We could not send a new code. Please try again.'
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError(
        'Enter the six-digit verification code.'
      );
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      const response =
        await authService.verifyPasswordResetOtp({
          nic,
          otp,
        });

      if (!response.resetAuthorization) {
        setError(INVALID_MESSAGE);
        return;
      }

      navigate('/reset-password', {
        replace: true,
        state: {
          resetAuthorization:
            response.resetAuthorization,
        },
      });
    } catch (verificationError) {
      const status = getErrorStatus(
        verificationError
      );

      if (status === 429) {
        setError(
          'Too many requests. Please try again later.'
        );
      } else if (
        typeof status === 'number'
        && status >= 400
        && status < 500
      ) {
        setError(INVALID_MESSAGE);
      } else {
        setError(NETWORK_ERROR_MESSAGE);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />

        <main className="w-full max-w-md relative">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/80 dark:border-gray-700/80 rounded-3xl p-7 sm:p-8 shadow-xl">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Change NIC
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
              Enter verification code
            </h1>

            <p className="text-muted-foreground mb-6">
              Enter the six-digit code sent to your registered
              recovery contact.
            </p>

            {statusMessage && (
              <p
                role="status"
                className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-foreground"
              >
                {statusMessage}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="reset-otp">
                  Verification code
                </Label>

                <div className="relative">
                  <KeyRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary"
                    aria-hidden="true"
                  />

                  <Input
                    id="reset-otp"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                      const numericOtp =
                        event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6);

                      setOtp(numericOtp);
                      setError('');
                    }}
                    placeholder="000000"
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error
                        ? 'reset-otp-error'
                        : undefined
                    }
                    className="h-14 rounded-xl pl-12 text-xl tracking-[0.35em]"
                  />
                </div>

                {error && (
                  <p
                    id="reset-otp-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isVerifying || isResending}
                className="w-full h-14 gradient-primary rounded-xl text-base"
              >
                {isVerifying
                  ? 'Verifying...'
                  : 'Verify code'}

                {!isVerifying && (
                  <ArrowRight className="w-5 h-5" />
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {secondsRemaining > 0 ? (
                <span aria-live="polite">
                  Resend code in {secondsRemaining}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={
                    isResending || isVerifying
                  }
                  className="text-primary font-semibold hover:underline disabled:opacity-50"
                >
                  {isResending
                    ? 'Sending code...'
                    : 'Resend code'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      <div className="hidden lg:flex w-[45%] fixed right-0 top-0 h-screen gradient-dark items-center justify-center p-12 text-white">
        <div className="text-center max-w-md">
          <KeyRound
            className="w-20 h-20 mx-auto mb-8"
            aria-hidden="true"
          />

          <h2 className="text-4xl font-bold mb-4">
            One more secure step
          </h2>

          <p className="text-white/70 text-lg">
            Use your verification code to continue safely.
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-[45%] shrink-0" />
    </div>
  );
};

export default VerifyResetOtp;