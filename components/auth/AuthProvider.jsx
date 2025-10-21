"use client";

import { useEffect, useRef } from 'react';
import useAuthStore from '@/store/auth/authStore';

const AuthProvider = ({ children }) => {
  const { initializeAuth, isInitialized } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once and only if not already initialized
    if (!hasInitialized.current && !isInitialized) {
      hasInitialized.current = true;
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return children;
};

export default AuthProvider;
