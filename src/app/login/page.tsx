import React, { Suspense } from "react";
import { Component } from "@/components/ui/animated-characters-login-page";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <Component />
    </Suspense>
  );
}
