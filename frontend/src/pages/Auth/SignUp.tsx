
import { Link, useNavigate } from "react-router-dom";
import React from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import AuthLayout from "./AuthLayout";

export default function SignUp() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      showToast(
        "warning",
        "Passwords do not match. Please check them and try again."
      );
      return;
    }

    const user = {
      email,
      username,
      password,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = data.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : "Sign up failed. Please try again."
        );
      }

      showToast(
        "success",
        "Your account has been created. You can now sign in."
      );

      navigate("/signin");

    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    }
  }

  return (
    <AuthLayout mode="signup">
      <form onSubmit={handleSubmit} className="w-full">

        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.12)]" />
          <span className="text-[10px] font-extrabold tracking-[1.5px] text-indigo-500">
            JOIN THE COMMUNITY
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h2>

        <p className="mt-3 mb-7 text-sm leading-6 text-slate-500">
          Start helping your neighborhood's street dogs today.
        </p>

        <div className="flex flex-col gap-4">

          <Input
            label="Full name"
            name="fullName"
            placeholder="Your name"
            autoComplete="name"
            required
          />

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Enter your password again"
            autoComplete="new-password"
            required
          />

          <label className="flex items-start gap-2 text-xs leading-5 text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              required
              className="w-4 h-4 mt-0.5 accent-indigo-600 shrink-0"
            />

            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-indigo-600 font-bold">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-indigo-600 font-bold">
                Privacy Policy
              </Link>.
            </span>
          </label>

          <Button
            className="w-full min-h-12 mt-1"
            type="submit"
          >
            Create Account <span className="ml-2">→</span>
          </Button>

        </div>

        <p className="mt-7 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-5 text-center text-[10px] text-slate-400">
          Your details help us keep the Dog Territory community safe.
        </p>

      </form>
    </AuthLayout>
  );
}
