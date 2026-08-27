import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v2.99h3.87c2.27-2.09 3.57-5.17 3.57-8.63Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-2.99c-1.07.72-2.45 1.14-4.08 1.14-3.13 0-5.79-2.12-6.73-4.96H1.27v3.08A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.29V6.63H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.37l4-3.08Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.27 6.63l4 3.08C6.21 6.89 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

const StudioLoginLogo = () => {
  const { theme } = useTheme();
  return (
    <Logo
      variant={theme === "dark" ? "light" : "dark"}
      size="large"
      className="mx-auto"
    />
  );
};

export const StudioLogin: React.FC<{
  onLoginSuccess: () => void;
  onBack: () => void;
  /** Carried over from the landing hero so the visitor does not retype it. */
  initialEmail?: string;
}> = ({ onLoginSuccess, onBack, initialEmail = "" }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetState = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!supabase) {
      setLoading(false);
      setErrorMessage(
        "Autentikasi belum dikonfigurasi. Hubungi admin untuk mengatur Supabase.",
      );
      return;
    }

    if (isResetMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      setLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          "Email reset password telah dikirim. Silakan cek inbox Anda.",
        );
        setEmail("");
      }
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          "Pendaftaran berhasil. Silakan cek inbox email Anda untuk verifikasi akun.",
        );
        setEmail("");
        setPassword("");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
        onLoginSuccess();
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!supabase) {
      setLoading(false);
      setErrorMessage(
        "Autentikasi belum dikonfigurasi. Hubungi admin untuk mengatur Supabase.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-sky-500/8 blur-[100px] dark:bg-sky-500/5" />
        <div className="absolute bottom-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/8 blur-[100px] dark:bg-cyan-500/5" />
      </div>

      <button
        onClick={onBack}
        className="absolute left-8 top-8 z-20 rounded-full border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ArrowRight className="rotate-180" size={24} />
      </button>

      <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl duration-500 dark:border-slate-800 dark:bg-slate-900/80 md:p-12">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-24">
              <StudioLoginLogo />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isResetMode
              ? "Reset Password"
              : isSignUp
                ? "Create Account"
                : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isResetMode
              ? "Masukkan email Anda untuk menerima tautan reset password."
              : isSignUp
                ? "Daftar untuk membuat campaign baru Anda."
                : "Masuk untuk melanjutkan campaign Anda."}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-600 dark:border-rose-800/30 dark:bg-rose-950/20 dark:text-rose-400">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-600 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-400">
              {successMessage}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {!isResetMode && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          )}

          {!isSignUp && !isResetMode && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 bg-white text-sky-500 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />{" "}
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  resetState();
                }}
                className="font-bold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Lupa Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isResetMode ? (
              "Kirim Email Reset"
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {!isResetMode && (
          <>
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                ATAU
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
              >
                <GoogleIcon />
                Masuk dengan Google
              </button>
            </div>
          </>
        )}

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          {isResetMode ? (
            <button
              onClick={() => {
                setIsResetMode(false);
                resetState();
              }}
              className="font-bold text-sky-600 hover:underline dark:text-sky-400"
            >
              &lt;- Kembali ke Login
            </button>
          ) : isSignUp ? (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  resetState();
                }}
                className="font-bold text-sky-600 hover:underline dark:text-sky-400"
              >
                Masuk Sekarang
              </button>
            </>
          ) : (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  resetState();
                }}
                className="font-bold text-sky-600 hover:underline dark:text-sky-400"
              >
                Daftar Sekarang
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
