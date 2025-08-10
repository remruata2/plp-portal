"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // This should be handled by middleware, but as a fallback
      router.push("/login");
      return;
    }

    if (session?.user) {
      // Redirect based on user role
      if (session.user.role === "facility") {
        router.push("/facility/dashboard");
      } else {
        router.push("/admin");
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-6">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          PLP Portal
        </h1>
        <p className="text-gray-600">
          Redirecting you to the appropriate dashboard...
        </p>
      </div>
    </div>
  );
}
