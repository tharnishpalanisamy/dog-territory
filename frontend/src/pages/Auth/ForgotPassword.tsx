import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import AuthLayout from "../../pages/Auth/AuthLayout";
import api from "../../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    try {
      // TODO: Connect your forgot-password API here.
      // await authService.forgotPassword({ email });
    //   sendOtp = await api.get('/auth/')
      setSubmitted(true);
    } catch (error) {
      console.error("Password recovery failed:", error);
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

            {/* Form */}
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
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
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
          /* Success state */
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mb-7">
              <ShieldCheck size={32} strokeWidth={1.7} />
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-bold tracking-[0.15em] text-indigo-600 uppercase">
                Check your inbox
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
              Check your email
            </h1>

            <p className="text-slate-500 leading-relaxed mb-6">
              If an account exists for{" "}
              <span className="font-semibold text-slate-800">{email}</span>,
              you'll receive a verification code shortly.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-8"
            >
              Try another email
            </button>

            <Link
              to="/signin"
              className="group flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
