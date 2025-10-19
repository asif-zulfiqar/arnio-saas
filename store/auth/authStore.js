import { create } from 'zustand';
import { authService, googleAuthService, workspaceService, teamMemberService } from '@/lib/api/auth';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth state
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Check if user is authenticated using the auth status endpoint
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Get user profile if authenticated
        const response = await authService.getProfile();
        // Handle different response structures
        const user = response?.user || response?.data || response;
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      
      // Handle different response structures
      const user = response?.user || response?.data || response;
      
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

  // Get user profile
  getProfile: async () => {
    try {
      const response = await authService.getProfile();
      // Handle different response structures
      return response?.user || response?.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = await authService.getProfile();
      // Handle different response structures
      const user = updatedUser?.user || updatedUser?.data || updatedUser;
      
      set({
        user,
        isLoading: false,
        error: null,
      });

      toast.success('Profile updated successfully!');
      return { success: true, user };
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

  // Setup user profile
  setupProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.setupProfile(profileData);
      const updatedUser = await authService.getProfile();
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });

      toast.success('Profile setup successfully!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.message || 'Profile setup failed. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.forgotPassword(email);
      set({ isLoading: false, error: null });
      
      toast.success('Password reset OTP sent to your email!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to send reset OTP. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.resetPassword(resetData);
      set({ isLoading: false, error: null });
      
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.resendVerification(email);
      set({ isLoading: false, error: null });
      
      toast.success('Verification email sent!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to send verification email. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Get user workspaces
  getUserWorkspaces: async (userId) => {
    try {
      const response = await workspaceService.getUserWorkspacesById(userId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create workspace
  createWorkspace: async (workspaceData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await workspaceService.createWorkspace(workspaceData);
      set({ isLoading: false, error: null });
      
      toast.success('Workspace created successfully!');
      return { success: true, workspace: response };
    } catch (error) {
      const errorMessage = error.message || 'Failed to create workspace. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Update workspace
  updateWorkspace: async (workspaceId, workspaceData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await workspaceService.updateWorkspace(workspaceId, workspaceData);
      set({ isLoading: false, error: null });
      
      toast.success('Workspace updated successfully!');
      return { success: true, workspace: response };
    } catch (error) {
      const errorMessage = error.message || 'Failed to update workspace. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Invite team members
  inviteTeamMembers: async (inviteData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await teamMemberService.inviteTeamMembers(inviteData);
      set({ isLoading: false, error: null });
      
      toast.success('Team members invited successfully!');
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.message || 'Failed to invite team members. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
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

  // Update onboarding status
  updateOnboardingStatus: async (isOnboarded) => {
    set({ isLoading: true, error: null });
    
    // Always update local user state first, regardless of API success/failure
    const currentUser = get().user;
    if (currentUser) {
      set({ 
        user: { ...currentUser, isOnboarded },
        isLoading: false,
        error: null 
      });
    }
    
    try {
      const response = await authService.updateOnboardingStatus(isOnboarded);
      
      // Don't show success toast for onboarding status - it's not critical
      return { success: true, response };
    } catch (error) {
      const errorMessage = error.message || 'Failed to update onboarding status. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
      });

      // Don't show error toast for onboarding status - don't block user flow
      console.error('Onboarding status update failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Save referral source
  saveReferralSource: async (referralSource) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.saveReferralSource(referralSource);
      
      set({
        isLoading: false,
        error: null,
      });

      toast.success('Referral source saved successfully!');
      return { success: true, response };
    } catch (error) {
      const errorMessage = error.message || 'Failed to save referral source. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },
}));

export default useAuthStore;
