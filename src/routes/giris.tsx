import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, Lock, User, Sparkles, ShieldCheck, Trophy } from "lucide-react";
import { Navbar } from "@/components/meydan/Navbar";
import { Logo } from "@/components/meydan/Logo";

export const Route = createFileRoute("/giris")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Giriş & Kayıt — Meydan" },
      {
        name: "description",
        content:
          "Meydan'a katıl: sporcuları keşfet, sessiz tezahüratla destekle, yeteneklerini bağışla. Futbol dışı sporun yeni meydanı.",
      },
      { property: "og:title", content: "Giriş & Kayıt — Meydan" },
      {
        property: "og:description",
        content: "Sporcuyu, taraftarı ve markayı buluşturan ekosisteme adım at.",
      },
    ],
  }),
});

type Mode = "login" | "signup";
type Role = "fan" | "athlete" | "brand";

const roles: { id: Role; label: string; desc: string; icon: typeof Trophy }[] = [
  { id: "fan", label: "Taraftar", desc: "Keşfet, destekle, sessiz tezahürat yap.", icon: Sparkles },
  { id: "athlete", label: "Sporcu", desc: "Kartını oluştur, hikâyeni paylaş.", icon: Trophy },
  { id: "brand", label: "Marka", desc: "AI eşleştirmeyle sporcu bul.", icon: ShieldCheck },
];

function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("fan");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock UI — gerçek auth sonradan bağlanacak
    setTimeout(() => {
      setLoading(false);
      navigate({ to: role === "athlete" ? "/sporcu" : "/" });
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-aurora">
      <Navbar />

      {/* Atmosfer */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[60%] light-rays opacity-50" />
        <div className="absolute inset-0 grid-dots opacity-[0.08]" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pb-16 pt-28 sm:px-6">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Sol — manifesto */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden flex-col justify-center lg:flex"
          >
            <Link to="/" className="mb-10 inline-flex">
              <Logo />
            </Link>
            <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
              Her sporun bir meydanı
            </p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl xl:text-6xl">
              <span className="text-gradient">Sporcuyu görünür kıl.</span>
              <br />
              <span className="text-gradient-violet">Sessizce alkışla.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Meydan; futbol dışı sporcuları taraftarla, markayla ve yetenekle buluşturan
              sürdürülebilir destek ekosistemidir.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                { k: "01", t: "Sporcu Kartı", d: "AI destekli dijital kimlik." },
                { k: "02", t: "Sessiz Tezahürat", d: "Maç anında yazılı destek." },
                { k: "03", t: "Marka Eşleştirme", d: "Değer uyumuna göre öneri." },
              ].map((row, i) => (
                <motion.li
                  key={row.k}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <span className="font-display text-xs text-[var(--violet)]">{row.k}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{row.t}</p>
                    <p className="text-sm text-muted-foreground">{row.d}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Sağ — form */}
          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-strong ring-glow relative overflow-hidden rounded-3xl p-6 sm:p-8">
              {/* iç parıltı */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full opacity-50 blur-3xl"
                style={{ background: "radial-gradient(circle, var(--violet), transparent 70%)" }}
              />

              {/* Mode switch */}
              <div className="relative mb-6 flex w-full rounded-full border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] p-1 text-sm">
                {(["login", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className="relative z-10 flex-1 rounded-full px-4 py-2 font-medium text-muted-foreground transition-colors data-[active=true]:text-[var(--primary-foreground)]"
                    data-active={mode === m}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="auth-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-foreground"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {m === "login" ? "Giriş Yap" : "Kayıt Ol"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h2 className="font-display text-2xl sm:text-3xl">
                    {mode === "login" ? "Tekrar hoş geldin." : "Meydan'a katıl."}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mode === "login"
                      ? "Sporcunu, kulübünü, markanı kaldığın yerden takip et."
                      : "Bir hesap, üç farklı meydan. Önce rolünü seç."}
                  </p>

                  {mode === "signup" && (
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const active = role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={`group relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all ${
                              active
                                ? "border-[var(--violet)] bg-[color-mix(in_oklab,var(--violet)_14%,transparent)]"
                                : "border-border hover:border-foreground/30 hover:bg-foreground/5"
                            }`}
                          >
                            <Icon className="h-4 w-4 text-[var(--violet)]" />
                            <span className="text-xs font-semibold">{r.label}</span>
                            <span className="text-[10px] leading-tight text-muted-foreground">
                              {r.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    {mode === "signup" && (
                      <Field icon={User} type="text" placeholder="Ad Soyad" required />
                    )}
                    <Field icon={Mail} type="email" placeholder="E-posta" required />
                    <Field icon={Lock} type="password" placeholder="Şifre" required />

                    {mode === "login" && (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <label className="inline-flex items-center gap-2 text-muted-foreground">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-border bg-transparent accent-[var(--violet)]"
                          />
                          Beni hatırla
                        </label>
                        <button type="button" className="text-muted-foreground hover:text-foreground">
                          Şifremi unuttum
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--violet)_60%,transparent)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--violet)]" />
                          Yönlendiriliyor…
                        </span>
                      ) : (
                        <>
                          {mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="h-px flex-1 bg-border" />
                    veya
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <SocialButton label="Google" />
                    <SocialButton label="Apple" />
                  </div>

                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    {mode === "login" ? "Henüz hesabın yok mu? " : "Zaten üye misin? "}
                    <button
                      type="button"
                      onClick={() => setMode(mode === "login" ? "signup" : "login")}
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {mode === "login" ? "Kayıt ol" : "Giriş yap"}
                    </button>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Devam ederek Meydan{" "}
              <a className="underline-offset-4 hover:underline" href="#">
                Kullanım Şartları
              </a>{" "}
              ve{" "}
              <a className="underline-offset-4 hover:underline" href="#">
                Gizlilik Politikası
              </a>
              nı kabul etmiş olursun.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: typeof Mail }) {
  return (
    <label className="group relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[var(--violet)]" />
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-[var(--violet)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--violet)_30%,transparent)]"
      />
    </label>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
    >
      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[var(--sky)] via-[var(--violet)] to-[var(--coral)]" />
      {label}
    </button>
  );
}
