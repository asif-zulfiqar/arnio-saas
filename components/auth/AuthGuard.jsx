"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/auth/authStore';
import Loader from '../global/small/Loader';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initializeAuth, checkAuth } = useAuthStore();
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

  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        // Initialize auth state by checking with backend
        await initializeAuth();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
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

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

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
  }, [isAuthenticated, isLoading, pathname, router]);

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
