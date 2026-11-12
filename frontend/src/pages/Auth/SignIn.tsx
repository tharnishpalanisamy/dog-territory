
import { Link, useNavigate } from "react-router-dom";
import React from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import AuthLayout from "./AuthLayout";

export default function SignIn() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const remember = formData.get("remember") === "on";

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = data.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : "Sign in failed. Check your details and try again."
        );
      }

      localStorage.setItem("access_token", data.access_token);

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      localStorage.setItem(
        "token_type",
        data.token_type ?? "bearer"
      );

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      localStorage.setItem("remember", JSON.stringify(remember));

      showToast("success", "Signed in successfully. Welcome back!");

      navigate("/dashboard");

    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    }
  }

  return (
    <AuthLayout mode="signin">
      <form onSubmit={handleSubmit} className="w-full">

        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.12)]" />
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

            <Link
              to="/forgot-password"
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            className="w-full min-h-12 mt-1"
            type="submit"
          >
            Sign In <span className="ml-2">→</span>
          </Button>

        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            Create one
          </Link>
        </p>

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>

      </form>
    </AuthLayout>
  );
}
