import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.arnio.co/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  }
  // async (error) => {
  //   // If we get a 401, try to refresh token first
  //   if (error.response?.status === 401) {
  //     const originalRequest = error.config;

  //     // Avoid infinite loops
  //     if (!originalRequest._retry) {
  //       originalRequest._retry = true;

  //       try {
  //         // Try to refresh the token
  //         await api.post('/refresh-token');

  //         // Retry the original request
  //         return api(originalRequest);
  //       } catch (refreshError) {
  //         // Refresh failed, redirect to login
  //         if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
  //           // Clear any stored auth state
  //           if (typeof window !== 'undefined') {
  //             window.location.href = '/login';
  //           }
  //         }
  //       }
  //     }
  //   }

  //   return Promise.reject(error);
  // }
);

export default api;
