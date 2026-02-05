// app/(protected)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Check your Redux auth state
  const { user, loading } = useSelector((state: any) => state.auth);
  const isAuthenticated = !!user; // user exists = logged in

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated - render the page
  return <>{children}</>;
}
