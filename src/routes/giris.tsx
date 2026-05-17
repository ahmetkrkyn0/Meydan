import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin, defaultRouteForRole } from "@/lib/session";

export const Route = createFileRoute("/giris")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Giriş — Meydan" },
      { name: "description", content: "Meydan'a giriş yap." },
    ],
  }),
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();

  const emailError = emailTouched && !email.trim() ? "E-posta adresi zorunlu." : null;
  const passwordError = passwordTouched && !password ? "Şifre zorunlu." : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    setError(null);
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      navigate({ to: defaultRouteForRole(result.profile.role) }).catch(() => undefined);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? `E-posta veya şifre hatalı. Şifreni unuttuysan → `
          : "Giriş başarısız. Lütfen tekrar dene."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-surface app-ambient relative min-h-screen w-full">
      {/* warm patches */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-dots-warm opacity-60" />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-indigo to-sky" />
            <span className="relative font-display text-base font-bold text-white">M</span>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-[color:var(--app-ink)]">Meydan</span>
        </Link>
        <Link
          to="/kayit"
          className="text-sm font-medium text-[color:var(--app-ink-soft)] underline-offset-4 hover:text-[color:var(--app-ink)] hover:underline"
        >
          Henüz üye değil misin? <span className="font-semibold text-[color:var(--app-ink)]">Kayıt ol</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col items-center px-6 pb-20 pt-10 sm:pt-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
            Tekrar hoş geldin.
          </h1>
          <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
            Sporcunu, kulübünü, markanı kaldığın yerden takip et.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-8 w-full space-y-3"
        >
          <div>
            <Field
              icon={Mail}
              type="email"
              placeholder="E-posta adresin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              aria-invalid={!!emailError}
            />
            {emailError && <p className="mt-1 px-1 text-xs text-coral">{emailError}</p>}
          </div>
          <div>
            <Field
              icon={Lock}
              type={showPw ? "text" : "password"}
              placeholder="Şifren"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              aria-invalid={!!passwordError}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-[color:var(--app-ink-mute)] hover:text-[color:var(--app-ink)]"
                  aria-label={showPw ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            {passwordError && <p className="mt-1 px-1 text-xs text-coral">{passwordError}</p>}
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-coral/10 px-3 py-2 text-xs text-coral">
              {error}
              {error.includes("hatalı") && (
                <Link to="/kayit" className="ml-1 font-semibold underline underline-offset-2">
                  Şifreni sıfırla
                </Link>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-light mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Yönlendiriliyor…
              </span>
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.form>

        <p className="mt-10 text-center text-[11px] text-[color:var(--app-ink-mute)]">
          Yeni misin?{" "}
          <Link to="/kayit" className="font-semibold text-[color:var(--app-ink)] underline-offset-4 hover:underline">
            Kayıt ol
          </Link>
        </p>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: typeof Mail; suffix?: React.ReactNode }) {
  return (
    <label className="group relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)] transition-colors group-focus-within:text-[color:var(--violet)]" />
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-[color:var(--app-line)] bg-white pl-11 pr-12 text-sm text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] transition-colors focus:border-[color:var(--violet)] focus:outline-none focus:ring-2 focus:ring-[color:oklch(0.60_0.22_252/0.20)]"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</span>
      )}
    </label>
  );
}
