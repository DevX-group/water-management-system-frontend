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

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }
};
