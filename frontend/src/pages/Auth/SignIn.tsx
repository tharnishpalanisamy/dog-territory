import { Link, useNavigate } from "react-router-dom";
import React from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import AuthLayout from "./AuthLayout";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function SignIn() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const returnTo = ((window.history.state?.usr?.from as string | undefined) ?? "");

    try {
      const authenticatedUser = await login({ email, password });

      showToast("success", "Signed in successfully. Welcome back!");

      const roleBase = authenticatedUser?.role?.toLowerCase() === "user" ? "/user" : authenticatedUser?.role?.toLowerCase() === "admin" ? "/admin" : authenticatedUser?.role?.toLowerCase() === "volunteer" ? "/volunteer" : authenticatedUser?.role?.toLowerCase() === "veterinarian" ? "/veterinarian" : "";
      if (roleBase && (returnTo === roleBase || returnTo.startsWith(`${roleBase}/`))) {
        navigate(returnTo, { replace: true });
        return;
      }

      if (roleBase) navigate(roleBase, { replace: true });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "Sign in failed. Check your details and try again."
        : error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      showToast("error", message);
    }
  }

  // IMPORTANT: JSX belongs to the component, not handleSubmit.

  return (
    <AuthLayout mode="signin">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[10px] font-extrabold tracking-[1.5px] text-indigo-500">
            WELCOME BACK
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Sign in to your account
        </h2>

        <p className="mt-3 mb-8 text-sm leading-6 text-slate-500">
          Pick up where you left off. Your community is glad you're here.
        </p>

        <div className="flex flex-col gap-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                className="w-4 h-4 accent-indigo-600"
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="auth-theme-link font-bold">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full min-h-12 mt-1" type="submit">
            Sign In <span className="ml-2">→</span>
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-theme-link font-bold">
            Create one
          </Link>
        </p>

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
          By continuing, you agree to our{" "}
          <Link
            to="/terms-and-conditions"
            className="auth-theme-link font-bold underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy-policy"
            className="auth-theme-link font-bold underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
