import { api } from './api';

export interface LoginRequest {
  nic: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  nic: string;
  email: string;
}

export interface ActivationRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ActivationResponse {
  message: string;
}

export interface PasswordResetRequest {
  nic: string;
}

export interface PasswordResetVerifyRequest {
  nic: string;
  otp: string;
}

export interface PasswordResetRequestResponse {
  message: string;
}

export interface PasswordResetVerifyResponse {
  resetAuthorization: string;
}

export interface PasswordResetCompleteRequest {
  resetAuthorization: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetCompleteResponse {
  message: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.info('[auth] Login request started', {
      endpoint: '/auth/login',
      nic: credentials.nic,
      hasPassword: Boolean(credentials.password),
    });

    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      console.info('[auth] Login response received', {
        status: response.status,
        nic: response.data?.nic,
        role: response.data?.role,
        hasToken: Boolean(response.data?.token),
      });
      return response.data;
    } catch (error: any) {
      console.error('[auth] Login request failed', {
        nic: credentials.nic,
        status: error?.response?.status ?? null,
        responseData: error?.response?.data ?? null,
        message: error?.message ?? 'Unknown error',
        requestUrl: error?.config?.url ?? '/auth/login',
        baseURL: error?.config?.baseURL ?? api.defaults.baseURL,
      });
      throw error;
    }
  },
  activate: async (payload: ActivationRequest): Promise<ActivationResponse> => {
    const response = await api.post<ActivationResponse>('/auth/activate', payload);
    return response.data;
  },
  requestPasswordReset: async (payload: PasswordResetRequest): Promise<PasswordResetRequestResponse> => {
    const response = await api.post<PasswordResetRequestResponse>('/auth/password-reset/request', payload);
    return response.data;
  },
  verifyPasswordResetOtp: async (payload: PasswordResetVerifyRequest): Promise<PasswordResetVerifyResponse> => {
    const response = await api.post<PasswordResetVerifyResponse>('/auth/password-reset/verify', payload);
    return response.data;
  },
  completePasswordReset: async (payload: PasswordResetCompleteRequest): Promise<PasswordResetCompleteResponse> => {
    const response = await api.post<PasswordResetCompleteResponse>('/auth/password-reset/complete', payload);
    return response.data;
  },
};
