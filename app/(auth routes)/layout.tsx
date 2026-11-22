"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useIsClient } from "@/lib/hooks/useIsClient";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    // refresh() re-runs the server side (including proxy) for the current
    // route, so a cached response is never reused after login or logout.
    router.refresh();
  }, [router]);

  return <>{isClient ? children : <div>Loading...</div>}</>;
};

export default AuthLayout;
