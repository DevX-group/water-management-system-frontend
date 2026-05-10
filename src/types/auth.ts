export type SignupFormData = {
  accountHolder: string;
  email: string;
  nic: string;
  password: string;
  confirmPassword: string;
};

export type SignupFormErrors = {
  email?: string;
  nic?: string;
  password?: string;
  confirmPassword?: string;
};

export interface LoginFormData {
  email:      string;
  password:   string;
  rememberMe: boolean;
}

