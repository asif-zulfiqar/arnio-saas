"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/auth/authStore';
import useOnboardingStore from '@/store/onboarding/onboardingStore';
import Loader from '../global/small/Loader';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initializeAuth, checkAuth, user, isLoading: authLoading } = useAuthStore();
  const { isCompleted, hasBeenShown } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(true);

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/otp',
    '/email-confirmation',
    '/auth/google/callback',
    '/google/callback',
  ];

  // Define auth routes that should redirect to dashboard if user is already authenticated
  const authRoutes = ['/login', '/signup'];

  // Define onboarding flow routes
  const onboardingRoutes = ['/create-profile', '/workspace', '/team-members', '/preferences'];

  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        // Initialize auth state by checking with backend
        await initializeAuth();
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    // Only initialize auth if we're not on a public route
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    if (!isPublicRoute) {
      initializeAuthState();
    } else {
      setIsLoading(false);
    }
  }, [initializeAuth, pathname]);

  // Update loading state based on auth loading
  useEffect(() => {
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    if (isPublicRoute) {
      setIsLoading(false);
    } else {
      setIsLoading(authLoading);
    }
  }, [authLoading, pathname]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      router.push('/');
      return;
    }

    // Handle onboarding flow
    if (isAuthenticated && user) {
      const isOnboarded = user.isOnboarded;
      console.log("AuthGuard - User object:", user);
      console.log("AuthGuard - User workspaces:", user.workspaces);
      console.log("AuthGuard - Onboarding completed:", isCompleted);
      console.log("AuthGuard - Onboarding hasBeenShown:", hasBeenShown);
      
      // If user is not onboarded and trying to access main dashboard
      if (!isOnboarded && pathname === '/') {
        console.log("AuthGuard - User is not onboarded, checking signup completion status");
        
        // Check if user has completed the entire signup flow
        const hasProfile = user.firstName && user.lastName && user.phone;
        const hasWorkspace = user.workspaces && user.workspaces.length > 0;
        
        if (hasProfile && hasWorkspace) {
          // User has completed profile and workspace - they should be on preferences or dashboard
          // Don't redirect them back to team-members, let them access dashboard
          console.log("AuthGuard - User has completed signup flow, allowing dashboard access");
          return; // Don't redirect, allow access to dashboard
        }
        
        // User hasn't completed signup flow, redirect to appropriate step
        console.log("AuthGuard - User hasn't completed signup flow, redirecting to onboarding flow");
        
        if (hasWorkspace) {
          // User has workspace, check if they have profile data
          if (hasProfile) {
            // User has profile and workspace, redirect to team-members step
            router.push('/team-members');
          } else {
            // User has workspace but no profile, redirect to profile creation
            router.push('/create-profile');
          }
        } else {
          // No workspace, start from profile creation
          router.push('/create-profile');
        }
        return;
      }
      
      // If user is onboarded and trying to access onboarding routes
      if (isOnboarded && isOnboardingRoute) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated and trying to access protected route
  if (!isAuthenticated && !publicRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  return children;
};

export default AuthGuard;
