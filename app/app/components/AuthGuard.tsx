"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token_manager";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      if (!token) {
        router.push('/account/sign-in');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#000] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}