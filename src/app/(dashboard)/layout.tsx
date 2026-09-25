"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAppSelector((state) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for client-side redux-persist rehydration
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !token) {
      toast.error("Please login to access your customer dashboard", {
        id: "auth-guard-redirect",
      });
      const loginUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
      router.replace(loginUrl);
    }
  }, [isHydrated, token, router, pathname]);

  // While checking rehydrated auth state on initial mount
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏡</span>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-[#064E3B]" />
          <p className="text-xs font-bold text-gray-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, prevent showing dashboard content while redirecting
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-lg text-center max-w-sm w-full space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={26} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-gray-900">Authentication Required</h3>
            <p className="text-xs text-gray-500 mt-1">
              You must be logged in to view this page. Redirecting to login...
            </p>
          </div>
          <div className="pt-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#064E3B] mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
