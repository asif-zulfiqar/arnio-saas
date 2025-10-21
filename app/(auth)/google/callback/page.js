"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/auth/authStore';
import Loader from '@/components/global/small/Loader';

const GoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          throw new Error('Authorization code not found');
        }

        const result = await handleGoogleCallback(code, state);

        if (result.success) {
          // Check user onboarding status and redirect directly to appropriate step
          const user = result.user;
          
          // Small delay to prevent page flash, then navigate
          setTimeout(() => {
            if (user && user.isOnboarded) {
              // User is onboarded - go to dashboard
              router.push('/');
            } else {
              // User needs to complete onboarding - redirect directly to appropriate step
              const hasProfile = user.firstName && user.lastName && user.phone;
              const hasWorkspace = user.workspaces && user.workspaces.length > 0;
              
              if (hasWorkspace && hasProfile) {
                router.push('/team-members');
              } else if (hasWorkspace) {
                router.push('/create-profile');
              } else {
                router.push('/create-profile');
              }
            }
          }, 100);
        } else {
          setError(result.error || 'Google authentication failed');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setError(error.message || 'Authentication failed');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Processing Google authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
