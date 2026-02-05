"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { authSelector } from "@/redux/reducers";
import { Login, register } from "@/redux/actions/authAction";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useSelector(authSelector);

  useEffect(() => {
    console.log("USEE EFFECT RAN", !authLoading, user);
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await dispatch(Login({ email, password })).unwrap();
      } else {
        await dispatch(
          register({
            email,
            password,
            firstName: name,
            confirmPassword: password,
          }),
        ).unwrap();
      }

      router.push("/");
    } catch (err: any) {
      setError(
        err.message || (isLogin ? "Login failed" : "Registration failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-lg dark:shadow-slate-900/30 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/updated-logo.png"
              alt="Prediction Market Edge"
              width={160}
              height={52}
              className="h-auto w-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isLogin
              ? "Sign in to access your dashboard"
              : "Join Prediction Market Edge"}
          </p>

          {/* Login / Sign Up Toggle */}
          <div className="flex rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white px-4 py-3 text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              )}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Switch mode link */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
