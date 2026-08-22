import '@/index.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';

const MIN_PASSWORD_LENGTH = 6;

const SUCCESS_MESSAGE =
  'Your password has been reset successfully. You can now sign in with your new password.';

const INVALID_AUTHORIZATION_MESSAGE =
  'Your password-reset session is invalid or has expired. Please restart the password recovery process.';

const PASSWORD_REQUIREMENTS_MESSAGE =
  'Please check that your password meets the requirements and try again.';

interface ResetLocationState {
  resetAuthorization?: unknown;
}

const getErrorStatus = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status;

const getErrorMessage = (error: unknown) =>
  (
    error as {
      response?: {
        data?: {
          message?: unknown;
        };
      };
    }
  )?.response?.data?.message;

const isInvalidAuthorizationError = (
  status: number | undefined,
  message: unknown,
) => {
  if ([401, 403, 404, 410].includes(status ?? 0)) {
    return true;
  }

  if (typeof message !== 'string') {
    return false;
  }

  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes('invalid') ||
    normalizedMessage.includes('expired') ||
    normalizedMessage.includes('consumed') ||
    normalizedMessage.includes('already used') ||
    normalizedMessage.includes('authorization')
  );
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const resetAuthorization = (
    location.state as ResetLocationState | null
  )?.resetAuthorization;

  const hasAuthorization =
    typeof resetAuthorization === 'string' &&
    resetAuthorization.trim().length > 0;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isAuthorizationInvalid, setIsAuthorizationInvalid] =
    useState(false);

  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!hasAuthorization) {
      navigate('/forgot-password', { replace: true });
    }
  }, [hasAuthorization, navigate]);

  useEffect(
    () => () => {
      if (redirectTimer.current !== null) {
        window.clearTimeout(redirectTimer.current);
      }
    },
    [],
  );

  if (!hasAuthorization) {
    return null;
  }

  const clearPasswordFields = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const validate = () => {
    if (!newPassword) {
      return 'Please enter your new password.';
    }

    if (!confirmPassword) {
      return 'Please confirm your new password.';
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (newPassword !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting || isComplete || isAuthorizationInvalid) {
      return;
    }

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await authService.completePasswordReset({
        resetAuthorization,
        newPassword,
        confirmPassword,
      });

      clearPasswordFields();
      setIsComplete(true);

      redirectTimer.current = window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1800);
    } catch (requestError) {
      const status = getErrorStatus(requestError);
      const backendMessage = getErrorMessage(requestError);

      if (status === 429) {
        setError('Too many requests. Please try again later.');
      } else if (
        isInvalidAuthorizationError(status, backendMessage)
      ) {
        clearPasswordFields();
        setError('');
        setIsAuthorizationInvalid(true);
      } else if (
        typeof status === 'number' &&
        status >= 400 &&
        status < 500
      ) {
        setError(PASSWORD_REQUIREMENTS_MESSAGE);
      } else {
        setError(
          'We could not reset your password. Please check your connection and try again.',
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

        <main className="w-full max-w-md relative">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/80 dark:border-gray-700/80 rounded-3xl p-7 sm:p-8 shadow-xl">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Restart recovery
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Droplets
                  className="w-6 h-6 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>

              <span className="text-2xl font-bold text-gradient">
                Hydro Pay
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-3">
              Create a new password
            </h1>

            <p className="text-muted-foreground mb-6">
              Choose a password you will use the next time you sign in.
            </p>

            {isComplete ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-foreground"
              >
                {SUCCESS_MESSAGE}
              </div>
            ) : isAuthorizationInvalid ? (
              <div
                role="alert"
                className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
              >
                <p className="text-sm text-destructive">
                  {INVALID_AUTHORIZATION_MESSAGE}
                </p>

                <Button asChild className="w-full rounded-xl">
                  <Link to="/forgot-password" replace>
                    Restart password recovery
                  </Link>
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>

                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary"
                      aria-hidden="true"
                    />

                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setError('');
                      }}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error
                          ? 'reset-password-error password-guidance'
                          : 'password-guidance'
                      }
                      disabled={isSubmitting}
                      className="h-14 rounded-xl pl-12 pr-12 text-base"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword((visible) => !visible)
                      }
                      disabled={isSubmitting}
                      aria-label={
                        showNewPassword
                          ? 'Hide new password'
                          : 'Show new password'
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 disabled:opacity-50"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <Eye className="w-5 h-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">
                    Confirm Password
                  </Label>

                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary"
                      aria-hidden="true"
                    />

                    <Input
                      id="confirm-new-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setError('');
                      }}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error
                          ? 'reset-password-error password-guidance'
                          : 'password-guidance'
                      }
                      disabled={isSubmitting}
                      className="h-14 rounded-xl pl-12 pr-12 text-base"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      disabled={isSubmitting}
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirmed password'
                          : 'Show confirmed password'
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 disabled:opacity-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <Eye className="w-5 h-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <p
                  id="password-guidance"
                  className="text-sm text-muted-foreground"
                >
                  Password must be at least {MIN_PASSWORD_LENGTH}{' '}
                  characters.
                </p>

                {error && (
                  <p
                    id="reset-password-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 gradient-primary rounded-xl text-base"
                >
                  {isSubmitting
                    ? 'Resetting password...'
                    : 'Reset password'}

                  {!isSubmitting && (
                    <ArrowRight
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>

      <div className="hidden lg:flex w-[45%] fixed right-0 top-0 h-screen gradient-dark items-center justify-center p-12 text-white">
        <div className="text-center max-w-md">
          <Lock
            className="w-20 h-20 mx-auto mb-8"
            aria-hidden="true"
          />

          <h2 className="text-4xl font-bold mb-4">
            Your account, secured
          </h2>

          <p className="text-white/70 text-lg">
            Set a fresh password and return to your water services.
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-[45%] shrink-0" />
    </div>
  );
};

export default ResetPassword;