const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api'
);

console.info('[api] API base URL:', API_BASE_URL);