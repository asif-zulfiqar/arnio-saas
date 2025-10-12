import api from './api';

// Auth service functions
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get user profile - temporarily disabled until backend implements this endpoint
  getProfile: async () => {
    try {
      // For now, return a mock user since the endpoint doesn't exist
      // TODO: Update this when backend implements /users/profile endpoint
      return {
        id: "temp-user-id",
        email: "user@example.com",
        firstName: "User",
        lastName: "Name",
        role: "USER"
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated - temporarily simplified
  isAuthenticated: async () => {
    try {
      // For now, check if we can make any authenticated request
      // TODO: Update this when backend implements proper auth check endpoint
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};

// Google OAuth functions
export const googleAuthService = {
  // Initiate Google OAuth
  initiateGoogleAuth: () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.arnio.co/api/v1";
    const googleAuthUrl = `${baseUrl}/google`;
    
    // Redirect to Google OAuth
    window.location.href = googleAuthUrl;
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (code, state) => {
    try {
      const response = await api.get('/google/callback', {
        params: { code, state },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
