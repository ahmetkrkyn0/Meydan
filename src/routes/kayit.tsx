import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowLeft, Mail, User, Trophy, Heart, ShieldCheck, Check } from "lucide-react";
import { useRegister } from "@/lib/session";
import { defaultRouteForRole } from "@/lib/session";

export const Route = createFileRoute("/kayit")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Kayıt Ol — Meydan" },
      { name: "description", content: "Meydan'a katıl: sporcu, taraftar veya marka olarak." },
    ],
  }),
});

type Role = "taraftar" | "sporcu" | "marka";

const roles: { id: Role; label: string; desc: string; icon: typeof Heart; iconBg: string; }[] = [
  { id: "taraftar", label: "Taraftar", desc: "Keşfet, destekle, sessiz tezahürat yap.",          icon: Heart,       iconBg: "bg-violet/12 text-violet" },
  { id: "sporcu",   label: "Sporcu",   desc: "Kartını oluştur, hikâyeni paylaş.",                icon: Trophy,      iconBg: "bg-coral/12 text-coral" },
  { id: "marka",    label: "Marka",    desc: "AI eşleştirmeyle değer uyumlu sporcu bul.",        icon: ShieldCheck, iconBg: "bg-sky/12 text-sky" },
];

function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("taraftar");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const register = useRegister();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim()) {
      setError("Ad ve email zorunlu");
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        email: email.trim(),
        full_name: fullName.trim(),
        role,
        city: city.trim() || undefined,
        branch: role === "sporcu" && branch.trim() ? branch.trim() : undefined,
      });
      navigate({ to: defaultRouteForRole(result.profile.role) }).catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-surface app-ambient relative min-h-screen w-full">
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
          to="/giris"
          className="text-sm font-medium text-[color:var(--app-ink-soft)] underline-offset-4 hover:text-[color:var(--app-ink)] hover:underline"
        >
          Zaten üye misin? <span className="font-semibold text-[color:var(--app-ink)]">Giriş yap</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col px-6 pb-20 pt-10 sm:pt-16">
        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center gap-3">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                  step >= n
                    ? "bg-[color:var(--app-ink)] text-white"
                    : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-mute)]"
                }`}
              >
                {step > n ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              {n === 1 && (
                <div className={`h-px w-10 transition-colors ${step >= 2 ? "bg-[color:var(--app-ink)]" : "bg-[color:var(--app-line)]"}`} />
              )}
            </div>
          ))}
          <span className="ml-3 text-xs text-[color:var(--app-ink-mute)]">
            Adım {step}/2 · {step === 1 ? "Rolünü seç" : "Bilgilerini gir"}
          </span>
        </div>

        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
                Meydan'da kim olarak yer almak istersin?
              </h1>
              <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
                Bir hesap, dört farklı meydan. Sonradan değiştirebilirsin.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {roles.map((r, i) => {
                const active = role === r.id;
                return (
                  <motion.button
                    key={r.id}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.06 }}
                    onClick={() => setRole(r.id)}
                    className={`group relative flex items-start gap-4 rounded-3xl border bg-white p-5 text-left transition-all ${
                      active
                        ? "border-[color:oklch(0.60_0.22_252/0.55)] shadow-[0_8px_30px_-12px_oklch(0.60_0.22_252/0.30)]"
                        : "border-[color:var(--app-line)] hover:border-[color:oklch(0.60_0.22_252/0.30)]"
                    }`}
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${r.iconBg}`}>
                      <r.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[color:var(--app-ink)]">{r.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[color:var(--app-ink-soft)]">{r.desc}</p>
                    </div>
                    {active && (
                      <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--violet)] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary-light mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.005]"
            >
              Devam Et
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="step2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
                Meydan'a katıl.
              </h1>
              <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
                <span className="font-semibold text-[color:var(--app-ink)]">{roles.find((r) => r.id === role)?.label}</span> olarak kayıt oluyorsun.
                {" "}
                <button onClick={() => setStep(1)} className="underline-offset-4 hover:underline">değiştir</button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md space-y-3">
              <Field
                icon={User}
                type="text"
                placeholder={role === "marka" ? "Marka adı" : "Ad Soyad"}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Field
                icon={Mail}
                type="email"
                placeholder="E-posta adresi"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                icon={User}
                type="text"
                placeholder="Şehir (opsiyonel)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {role === "sporcu" && (
                <Field
                  icon={Trophy}
                  type="text"
                  placeholder="Branş (örn. Okçuluk)"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              )}

              <p className="pt-2 text-[11px] leading-relaxed text-[color:var(--app-ink-mute)]">
                Demo: şifre yok. Email tek başına oturum açmaya yetiyor.
              </p>

              {error && (
                <p className="rounded-xl bg-coral/10 px-3 py-2 text-xs text-coral">{error}</p>
              )}

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" /> Geri
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-light inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.005] disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                      Hesabın hazırlanıyor…
                    </span>
                  ) : (
                    <>Hesabı Oluştur <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </form>
          </motion.section>
        )}
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
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</span>}
    </label>
  );
}
