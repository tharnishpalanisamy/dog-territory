import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import AuthLayout from "../../pages/Auth/AuthLayout";
import api from "../../lib/api";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Request OTP
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setSuccessMessage(
        response.data.message || "OTP sent successfully to your email.",
      );

      setSubmitted(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "Unable to process your request. Please try again."
        : "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/verify-reset-otp", {
        email: email.trim().toLowerCase(),
        otp,
      });

      // TODO: Handle reset token and navigate to reset password page.
      console.log("OTP verified:", response.data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "Invalid or expired verification code."
        : "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="signin">
      <div className="w-full max-w-md mx-auto">
        {!submitted ? (
          <>
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-7">
              <Mail size={26} strokeWidth={1.8} />
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-bold tracking-[0.15em] text-indigo-600 uppercase">
                  Account Recovery
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
                Forgot your password?
              </h1>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                No worries! It happens. Enter the email address associated with
                your account and we'll send you a verification code to reset
                your password.
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                    setErrorMessage("");
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                {errorMessage && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-12 rounded-xl bg-[#5555f4] hover:bg-[#4545e5] text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send verification code"}
              </button>
            </form>

            {/* Back to Sign In */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          /* OTP Verification Screen */
          <div className="py-4">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mb-7">
              <ShieldCheck size={32} strokeWidth={1.7} />
            </div>

            {/* Heading */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-bold tracking-[0.15em] text-indigo-600 uppercase">
                  Email Verification
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
                Verify your email
              </h1>

              <p className="text-sm text-slate-500 leading-relaxed">
                Enter the verification code sent to{" "}
                <span className="font-semibold text-slate-800">{email}</span>.
              </p>
            </div>

            {/* Green Success Message */}
            {successMessage && (
              <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <ShieldCheck
                  size={18}
                  className="text-green-600 shrink-0 mt-0.5"
                />
                <p className="text-sm font-medium text-green-700">
                  {successMessage}
                </p>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setErrorMessage("");
                  }}
                  placeholder="000000"
                  required
                  className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-center text-2xl font-bold tracking-[0.5em] placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                {errorMessage && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full min-h-12 rounded-xl bg-[#5555f4] hover:bg-[#4545e5] text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            {/* Change Email */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setOtp("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Change email address
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
