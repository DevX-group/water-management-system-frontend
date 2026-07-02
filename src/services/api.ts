import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken, removeToken } from '../utils/authUtils';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (isFormData && config.headers) {
      const headers = config.headers as any;
      if (typeof headers.delete === 'function') {
        headers.delete('Content-Type');
        headers.delete('content-type');
      } else {
        delete headers['Content-Type'];
        delete headers['content-type'];
      }
    }

    if (token && config.headers) {
      const headers = config.headers as any;
      if (typeof headers.set === 'function') {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    // Only clear auth on 401 (unauthenticated). 403 is an authorization error.
    if (status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
