import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles, Trophy, ShieldCheck, Heart } from "lucide-react";

export const Route = createFileRoute("/giris")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Giriş — Meydan" },
      { name: "description", content: "Meydan'a giriş yap." },
    ],
  }),
});

const quickDemos = [
  { role: "fan",     label: "Taraftar",  desc: "Keşfet & destekle",   icon: Heart,        to: "/dashboard",     iconBg: "bg-violet/12 text-violet" },
  { role: "athlete", label: "Sporcu",    desc: "Kartın & teklifler",  icon: Trophy,       to: "/sporcu-panel",  iconBg: "bg-coral/12 text-coral"   },
  { role: "brand",   label: "Marka",     desc: "AI eşleştirme",       icon: ShieldCheck,  to: "/marka-panel",   iconBg: "bg-sky/12 text-sky"       },
] as const;

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 700);
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
          <Field icon={Mail} type="email" placeholder="E-posta adresin" required />
          <Field
            icon={Lock}
            type={showPw ? "text" : "password"}
            placeholder="Şifren"
            required
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

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="inline-flex items-center gap-2 text-[color:var(--app-ink-soft)]">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[color:var(--app-line)] accent-[color:var(--violet)]" />
              Beni hatırla
            </label>
            <button type="button" className="text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]">
              Şifremi unuttum
            </button>
          </div>

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

        {/* Social */}
        <div className="my-6 flex w-full items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
          <span className="h-px flex-1 bg-[color:var(--app-line)]" />
          veya
          <span className="h-px flex-1 bg-[color:var(--app-line)]" />
        </div>
        <button
          type="button"
          className="btn-ghost-light inline-flex w-full items-center justify-center gap-2.5 rounded-full px-4 py-3 text-sm font-medium transition-colors"
        >
          <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[var(--sky)] via-[var(--violet)] to-[var(--coral)]" />
          Google ile devam et
        </button>

        {/* ── QUICK DEMO ACCESS ── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 w-full"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
            <Sparkles className="h-3 w-3 text-[color:var(--violet)]" />
            Quick Demo Access
            <span className="h-px flex-1 bg-[color:var(--app-line)]" />
          </div>
          <p className="mt-2 text-xs text-[color:var(--app-ink-soft)]">
            Şifre yok — bir rol seç, Meydan'ı keşfet.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {quickDemos.map((d, i) => (
              <motion.div
                key={d.role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
              >
                <Link
                  to={d.to}
                  className="group relative flex flex-col items-start gap-2 rounded-2xl border border-[color:var(--app-line)] bg-white p-3.5 transition-all hover:border-[color:oklch(0.60_0.22_252/0.35)] hover:bg-[color:oklch(0.60_0.22_252/0.04)]"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${d.iconBg}`}>
                    <d.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--app-ink)]">{d.label}</p>
                    <p className="mt-0.5 text-[11px] text-[color:var(--app-ink-mute)]">{d.desc}</p>
                  </div>
                  <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-[color:var(--app-ink-mute)] transition-all group-hover:right-2.5 group-hover:text-[color:var(--violet)]" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <p className="mt-10 text-center text-[11px] text-[color:var(--app-ink-mute)]">
          Devam ederek Meydan{" "}
          <a className="underline-offset-4 hover:underline" href="#">Kullanım Şartları</a>{" "}
          ve{" "}
          <a className="underline-offset-4 hover:underline" href="#">Gizlilik Politikası</a>'nı kabul etmiş olursun.
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
