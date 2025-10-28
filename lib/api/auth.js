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

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      // Check if there's a file upload (avatar)
      if (profileData.avatar && profileData.avatar instanceof File) {
        const formData = new FormData();
        
        // Append all profile data to FormData
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== null && profileData[key] !== undefined) {
            formData.append(key, profileData[key]);
          }
        });

        const response = await api.patch('/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Regular JSON request for non-file data
        const response = await api.patch('/users/profile', profileData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Setup user profile with avatar upload
  setupProfile: async (profileData) => {
    try {
      const formData = new FormData();
      
      // Append all profile data to FormData
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      const response = await api.post('/users/setup-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Forgot password - send OTP
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password with OTP
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/users/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend email verification
  resendVerification: async (email) => {
    try {
      const response = await api.post('/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check authentication status
  checkAuthStatus: async () => {
    try {
      const response = await api.get('/auth/status');
      return response.data;
    } catch (error) {
      return { isAuthenticated: false };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/refresh-token');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const authStatus = await authService.checkAuthStatus();
      return authStatus.auth?.hasAuthToken || false;
    } catch (error) {
      return false;
    }
  },

  // Update onboarding status
  updateOnboardingStatus: async (isOnboarded) => {
    try {
      const response = await api.patch('/auth/onboarding', { isOnboarded });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Save referral source
  saveReferralSource: async (referralSource) => {
    try {
      const response = await api.put('/users/referral', { referralSource });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get phone line status
  getPhoneLineStatus: async () => {
    try {
      const response = await api.get('/line/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Enable remember me for current session
  enableRememberMe: async () => {
    try {
      const response = await api.post('/remember-me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};

// Workspace service functions
export const workspaceService = {
  // Create a new workspace
  createWorkspace: async (workspaceData) => {
    try {
      // Check if there's a file upload (companyLogo)
      if (workspaceData.companyLogo && workspaceData.companyLogo instanceof File) {
        const formData = new FormData();
        
        // Append all workspace data to FormData
        Object.keys(workspaceData).forEach(key => {
          if (workspaceData[key] !== null && workspaceData[key] !== undefined) {
            formData.append(key, workspaceData[key]);
          }
        });

        const response = await api.post('/workspaces', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Regular JSON request for non-file data
        const response = await api.post('/workspaces', workspaceData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user workspaces
  getUserWorkspaces: async () => {
    try {
      const response = await api.get('/workspaces');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get workspaces for a specific user
  getUserWorkspacesById: async (userId) => {
    try {
      const response = await api.get(`/workspaces/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update workspace
  updateWorkspace: async (workspaceId, workspaceData) => {
    try {
      // Check if there's a file upload (companyLogo)
      if (workspaceData.companyLogo && workspaceData.companyLogo instanceof File) {
        const formData = new FormData();
        
        // Append all workspace data to FormData
        Object.keys(workspaceData).forEach(key => {
          if (workspaceData[key] !== null && workspaceData[key] !== undefined) {
            formData.append(key, workspaceData[key]);
          }
        });

        const response = await api.put(`/workspaces/${workspaceId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Regular JSON request for non-file data
        const response = await api.put(`/workspaces/${workspaceId}`, workspaceData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Team member service functions
export const teamMemberService = {
  // Invite team members to workspace
  inviteTeamMembers: async (inviteData) => {
    try {
      const response = await api.post('/team-members/invite', inviteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get team members for a workspace
  getTeamMembers: async (workspaceId) => {
    try {
      const response = await api.get(`/team-members/workspace/${workspaceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
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
