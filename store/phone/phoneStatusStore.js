import { create } from 'zustand';
import { authService } from '../../lib/api/auth';

const usePhoneStatusStore = create((set, get) => ({
  // State
  status: null, // 'ACTIVE', 'PENDING', 'INACTIVE'
  phoneNumber: null,
  progress: 0,
  isVisible: false,
  isPolling: false,
  pollingInterval: null,
  error: null,
  hasCheckedAfterOnboarding: false,

  // Actions
  setStatus: (status) => set({ status }),
  
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  
  setProgress: (progress) => set({ progress }),
  
  setVisible: (isVisible) => set({ isVisible }),
  
  setError: (error) => set({ error }),
  
  setHasCheckedAfterOnboarding: (hasChecked) => set({ hasCheckedAfterOnboarding: hasChecked }),

  // Check phone line status
  checkPhoneLineStatus: async () => {
    try {
      console.log('PhoneStatusStore - Checking phone line status...');
      set({ error: null });
      const response = await authService.getPhoneLineStatus();
      
      console.log('PhoneStatusStore - API Response:', response);
      
      if (response.success) {
        const { status, phoneNumber } = response.data;
        console.log('PhoneStatusStore - Status:', status, 'Phone:', phoneNumber);
        set({ 
          status, 
          phoneNumber,
          isVisible: true,
          error: null 
        });
        
        // If status is ACTIVE, stop polling
        if (status === 'ACTIVE') {
          console.log('PhoneStatusStore - Phone line is active, stopping polling');
          get().stopPolling();
        }
        
        return { success: true, status, phoneNumber };
      } else {
        console.log('PhoneStatusStore - No phone line available:', response.message);
        set({ 
          status: 'INACTIVE', 
          isVisible: true,
          error: response.message || 'No phone line available'
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || 'Failed to check phone line status';
      console.error('PhoneStatusStore - Error checking status:', errorMessage);
      set({ 
        error: errorMessage,
        status: 'INACTIVE',
        isVisible: true
      });
      return { success: false, error: errorMessage };
    }
  },

  // Start polling for status updates
  startPolling: () => {
    const { isPolling } = get();
    if (isPolling) return;

    set({ isPolling: true });
    
    const interval = setInterval(async () => {
      const { status } = get();
      
      // Only poll if status is not ACTIVE
      if (status !== 'ACTIVE') {
        await get().checkPhoneLineStatus();
      } else {
        get().stopPolling();
      }
    }, 60000); // Poll every 1 minute

    set({ pollingInterval: interval });
  },

  // Stop polling
  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    set({ 
      isPolling: false, 
      pollingInterval: null 
    });
  },

  // Initialize phone status check after onboarding
  initializePhoneStatusCheck: async () => {
    const { hasCheckedAfterOnboarding } = get();
    
    console.log('PhoneStatusStore - Initializing phone status check, hasChecked:', hasCheckedAfterOnboarding);
    
    // Only check once after onboarding
    if (hasCheckedAfterOnboarding) {
      console.log('PhoneStatusStore - Already checked after onboarding, skipping');
      return;
    }
    
    set({ hasCheckedAfterOnboarding: true });
    
    // Check initial status
    console.log('PhoneStatusStore - Checking initial phone status...');
    await get().checkPhoneLineStatus();
    
    // Start polling if status is not ACTIVE
    const { status } = get();
    console.log('PhoneStatusStore - Initial status:', status);
    if (status !== 'ACTIVE') {
      console.log('PhoneStatusStore - Starting polling for status updates...');
      get().startPolling();
    }
  },

  // Close popup
  closePopup: () => {
    set({ isVisible: false });
    get().stopPolling();
  },

  // Reset store
  reset: () => {
    get().stopPolling();
    set({
      status: null,
      phoneNumber: null,
      progress: 0,
      isVisible: false,
      isPolling: false,
      pollingInterval: null,
      error: null,
      hasCheckedAfterOnboarding: false
    });
  }
}));

export default usePhoneStatusStore;
