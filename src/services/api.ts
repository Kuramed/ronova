import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiFetch = async (url: string, options?: RequestInit) => {
  const method = options?.method || 'GET';
  const data = options?.body ? JSON.parse(options.body as string) : undefined;
  
  const response = await api({
    url,
    method,
    data,
    headers: options?.headers as any,
  });
  
  return response.data;
};

export const apifetch = apiFetch;