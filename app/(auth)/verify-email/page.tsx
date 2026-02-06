// app/(auth)/verify-email/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { verifyEmail } from "@/redux/actions/authAction";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const result = await dispatch(verifyEmail(token)).unwrap();
        setStatus(result ? "success" : "error");

        if (result) {
          setTimeout(() => router.push("/auth"), 3000);
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl" />

          {/* Logo */}
          <div className="relative flex justify-center mb-8">
            <Image
              src="/updated-logo.png"
              alt="Prediction Market Edge"
              width={140}
              height={45}
              className="h-auto w-auto"
            />
          </div>

          <div className="text-center">
            {status === "loading" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Verifying your email
                </h1>
                <p className="text-sm text-gray-300">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6 animate-scale-in">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Email verified!
                </h1>
                <p className="text-sm text-gray-300 mb-6">
                  Your email has been successfully verified. Redirecting to
                  login...
                </p>
                <div className="flex justify-center">
                  <div className="inline-block h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-progress" />
                  </div>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Verification failed
                </h1>
                <p className="text-sm text-gray-300 mb-6">
                  The verification link is invalid or has expired.
                </p>
                <button
                  onClick={() => router.push("/auth")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
