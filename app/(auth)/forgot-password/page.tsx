// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { forgotPassword } from "@/redux/actions/authAction";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      if (result) {
        setSuccess(true);
      }
    } catch (error) {
      // Error is handled by the alert system
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl" />

          {/* Back button */}
          <button
            onClick={() => router.push("/auth")}
            className="relative flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to login
          </button>

          {/* Logo */}
          <div className="relative flex justify-center mb-6">
            <Image
              src="/updated-logo.png"
              alt="Prediction Market Edge"
              width={140}
              height={45}
              className="h-auto w-auto"
            />
          </div>

          {!success ? (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Forgot password?
                </h1>
                <p className="text-sm text-gray-300">
                  {`Enter your email and we'll send you a reset link`}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-600/50 disabled:to-blue-500/50 text-white rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                  )}
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                <Send className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Check your email
              </h1>
              <p className="text-sm text-gray-300 mb-6">
                {`We've sent a password reset link to`}{" "}
                <span className="text-white font-semibold">{email}</span>
              </p>
              <button
                onClick={() => router.push("/auth")}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200"
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
