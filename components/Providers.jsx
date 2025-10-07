"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        {children}
      </AuthGuard>
    </QueryClientProvider>
  );
}
