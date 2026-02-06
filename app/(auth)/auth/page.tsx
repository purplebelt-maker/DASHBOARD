"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { authSelector } from "@/redux/reducers";
import { Login, register } from "@/redux/actions/authAction";
import Image from "next/image";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useSelector(authSelector);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await dispatch(Login({ email, password })).unwrap();
      } else {
        await dispatch(
          register({
            email,
            password,
            confirmPassword,
            firstName,
            lastName: lastName || undefined,
          }),
        ).unwrap();
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.message || (isLogin ? "Login failed" : "Registration failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:6900";
    window.location.href = `${backendUrl}/api/user/google`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Fixed Back Button - Shows on all screen sizes */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-50 group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/30 group-hover:scale-110 transition-all shadow-lg">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="hidden md:block text-sm font-medium group-hover:translate-x-0.5 transition-transform">
          Back to Home
        </span>
      </button>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 flex-1 flex items-center justify-center p-4 lg:p-8">
        {/* Left Side - Marketing Content (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <div className="max-w-lg">
            {/* END OF NEW BACK BUTTON */}

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">
                Be First. Trade Smart.
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Your Edge in
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Prediction Markets
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-6">
              Get instant alerts on new markets. Filter by category, volume, and
              time. No sports. No clutter.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Instant Alerts",
                "Smart Filters",
                "Real-time Data",
                "Zero Noise",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-300"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white mb-0.5">
                  1.2K+
                </div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-0.5">24/7</div>
                <div className="text-xs text-gray-400">Monitoring</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-0.5">
                  15min
                </div>
                <div className="text-xs text-gray-400">Alert Speed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl flex items-center">
          <div className="w-full relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 lg:p-8">
            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur-2xl opacity-20" />

            <div className="relative">
              {/* ADD THIS MOBILE BACK BUTTON */}

              {/* END OF MOBILE BACK BUTTON */}

              {/* Logo */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/updated-logo.png"
                  alt="Prediction Market Edge"
                  width={140}
                  height={45}
                  className="h-8 w-auto"
                />
              </div>

              {/* Title */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isLogin ? "Welcome back!" : "Join us today"}
                </h2>
                <p className="text-sm text-gray-300">
                  {isLogin
                    ? "Sign in to access your dashboard"
                    : "Start getting market alerts"}
                </p>
              </div>

              {/* Toggle Tabs */}
              <div className="flex gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-1 mb-5">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    isLogin
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    !isLogin
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="group relative w-full bg-white hover:bg-gray-50 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 mb-4 hover:scale-[1.02] hover:shadow-xl"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-gray-400 text-[11px]">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 backdrop-blur-sm animate-shake">
                  <p className="text-xs text-red-300 font-medium">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      />
                    </div>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full bg-white/5 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-600/50 disabled:to-blue-500/50 text-white rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-5 text-center">
                <p className="text-xs text-gray-400">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                    }}
                    className="text-blue-400 font-bold hover:text-blue-300 transition-colors hover:underline"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
