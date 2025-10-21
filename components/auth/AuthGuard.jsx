"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/auth/authStore';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, isInitialized } = useAuthStore();
  const redirectExecuted = useRef(false); // Prevent multiple redirects
  const lastPathname = useRef(pathname); // Track pathname changes

  // Define route categories
  const publicRoutes = [
    '/login',
    '/signup', 
    '/forgot-password',
    '/otp',
    '/email-confirmation',
    '/auth/google/callback',
    '/google/callback',
  ];
  
  const authRoutes = ['/login', '/signup'];
  const onboardingRoutes = ['/create-profile', '/workspace', '/team-members', '/preferences'];

  // Reset redirect flag when pathname changes
  useEffect(() => {
    if (lastPathname.current !== pathname) {
      redirectExecuted.current = false;
      lastPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // Don't redirect if still loading, not initialized, or on public routes
    if (isLoading || !isInitialized || publicRoutes.some(route => pathname.startsWith(route))) {
      return;
    }

    // Prevent multiple redirects for the same route
    if (redirectExecuted.current) {
      return;
    }

    console.log("AuthGuard - Current path:", pathname);
    console.log("AuthGuard - isAuthenticated:", isAuthenticated);
    console.log("AuthGuard - user:", user);
    console.log("AuthGuard - isLoading:", isLoading);
    console.log("AuthGuard - isInitialized:", isInitialized);

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      console.log("AuthGuard - User not authenticated, redirecting to login");
      redirectExecuted.current = true;
      router.push('/login');
      return;
    }

    // If user is authenticated and trying to access auth routes, redirect to appropriate destination
    if (isAuthenticated && isAuthRoute) {
      console.log("AuthGuard - User authenticated, redirecting from auth route");
      redirectExecuted.current = true;
      
      // Simple logic: Check isOnboarded from API
      if (user && user.isOnboarded) {
        // User is onboarded - go to dashboard
        setTimeout(() => {
          router.push('/');
        }, 50);
      } else {
        // User is not onboarded - redirect to appropriate onboarding step
        const hasProfile = user.firstName && user.lastName && user.phone;
        const hasWorkspace = user.workspaces && user.workspaces.length > 0;
        
        setTimeout(() => {
          if (hasWorkspace && hasProfile) {
            router.push('/team-members');
          } else if (hasWorkspace) {
            router.push('/create-profile');
          } else {
            router.push('/create-profile');
          }
        }, 50);
      }
      return;
    }

    // Handle onboarding flow for authenticated users
    if (isAuthenticated && user) {
      const isOnboarded = user.isOnboarded;
      
      console.log("AuthGuard - User isOnboarded:", isOnboarded);
      console.log("AuthGuard - isOnboardingRoute:", isOnboardingRoute);
      
      // If user is not onboarded and trying to access main dashboard
      if (!isOnboarded && pathname === '/') {
        console.log("AuthGuard - User is not onboarded, checking if they completed signup flow");
        redirectExecuted.current = true;
        
        // Check if user completed the profile step
        const hasProfile = user.firstName && user.lastName && user.phone;
        
        console.log("AuthGuard - User data:", {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          workspaces: user.workspaces,
          hasProfile,
          fullUser: user
        });
        
        // If user has completed profile, let them through to welcome screen
        // This prevents the redirect loop after completing preferences
        if (hasProfile) {
          console.log("AuthGuard - User has profile, allowing access to dashboard for welcome screen");
          return; // Don't redirect, let them stay on dashboard
        }
        
        // Otherwise, redirect to appropriate onboarding step
        console.log("AuthGuard - User not completed signup flow, redirecting to onboarding");
        setTimeout(() => {
          router.push('/create-profile');
        }, 50);
        return;
      }
      
      // If user is onboarded, they should NOT be on onboarding routes
      if (isOnboarded && isOnboardingRoute) {
        console.log("AuthGuard - User is onboarded, redirecting from onboarding route to dashboard");
        redirectExecuted.current = true;
        setTimeout(() => {
          router.push('/');
        }, 50);
        return;
      }
      
    }
  }, [isAuthenticated, isLoading, isInitialized, pathname, router, user]);

  // Don't show loading screen for auth routes and onboarding routes - let them render immediately
  if (publicRoutes.some(route => pathname.startsWith(route)) || onboardingRoutes.some(route => pathname.startsWith(route))) {
    return children;
  }

  // Show minimal loading to prevent flash - only for protected routes
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Minimal loading - just a blank screen to prevent flash */}
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