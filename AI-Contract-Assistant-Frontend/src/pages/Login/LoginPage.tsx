// AI-Contract-Assistant-Frontend/src/pages/Login/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileStack, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900">
            <FileStack className="h-5 w-5 text-white" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-ink-900">
            Welcome back
          </h1>

          <p className="mt-1.5 text-sm text-ink-500">
            Sign in to AI Contract Assistant
          </p>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-[0_1px_2px_rgba(10,10,11,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="brand"
              className="w-full"
              loading={loading}
            >
              Login
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />

            <span className="text-xs text-ink-400">or</span>

            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-ink-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Create account
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          Protected by JWT authentication
        </p>
      </div>
    </div>
  );
}
