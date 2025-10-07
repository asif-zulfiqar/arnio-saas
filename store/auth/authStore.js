import { create } from 'zustand';
import { authService, googleAuthService } from '@/lib/api/auth';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth state - simplified for now
  initializeAuth: async () => {
    try {
      // For now, we'll assume user is authenticated if they can reach this point
      // This is a temporary solution until backend implements proper auth endpoints
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ user: null, isAuthenticated: false });
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      
      // After successful login, get user profile
      const user = await authService.getProfile();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.register(userData);
      
      set({
        isLoading: false,
        error: null,
      });

      toast.success('Registration successful! Please login to continue.');
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Google OAuth login
  googleLogin: async () => {
    set({ isLoading: true, error: null });
    
    try {
      googleAuthService.initiateGoogleAuth();
    } catch (error) {
      const errorMessage = error.message || 'Google login failed. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (code, state) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await googleAuthService.handleGoogleCallback(code, state);
      
      // After successful Google login, get user profile
      const user = await authService.getProfile();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Google login successful!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Google login failed. Please try again.';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast.success('Logged out successfully!');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedUser = await authService.getProfile(); // Assuming there's an update endpoint
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });

      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set loading state
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      set({ isAuthenticated: isAuth });
      return isAuth;
    } catch (error) {
      set({ isAuthenticated: false });
      return false;
    }
  },
}));

export default useAuthStore;
