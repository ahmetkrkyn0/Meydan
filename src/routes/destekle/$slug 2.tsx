import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug } from "@/lib/mock-data";
import { createDonation, listProfiles } from "@/lib/api";
import { findAthleteBySlug, findProfileBySlug } from "@/lib/api-mappers";
import { useActiveFan } from "@/lib/active-athlete";

export const Route = createFileRoute("/destekle/$slug 2")({
  component: SupportPage,
  head: ({ params }) => ({
    meta: [{ title: `${athleteBySlug(params.slug).name} destekle — Meydan` }],
  }),
});

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const PRESETS = [50, 100, 250, 500];

function SupportPage() {
  const { slug } = Route.useParams();
  const activeFan = useActiveFan();
  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });
  const a = useMemo(
    () => findAthleteBySlug(slug, profilesQuery.data?.profiles),
    [profilesQuery.data?.profiles, slug],
  );
  const athleteProfile = useMemo(
    () => findProfileBySlug(slug, profilesQuery.data?.profiles),
    [profilesQuery.data?.profiles, slug],
  );

  const [selected, setSelected] = useState<number>(250);
  const [custom, setCustom] = useState<string>("");
  const isCustom = selected === -1;
  const amount = isCustom ? Number(custom || 0) : selected;

  const donationMutation = useMutation({
    mutationFn: () => {
      if (!activeFan.profile?.id) {
        throw new Error("Bağış için backend'de bir taraftar profili gerekli.");
      }
      if (!athleteProfile?.id) {
        throw new Error("Bu sporcu backend'de bulunamadı.");
      }
      return createDonation({
        supporter_profile_id: activeFan.profile.id,
        athlete_profile_id: athleteProfile.id,
        amount,
        is_recurring: true,
      });
    },
  });

  const canDonate = Boolean(
    amount > 0 && activeFan.profile?.id && athleteProfile?.id && !donationMutation.isPending,
  );

  function handleDonate() {
    if (!canDonate) return;
    donationMutation.mutate();
  }


  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
          <Link
            to="/sporcu/$slug"
            params={{ slug: a.slug }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            ← Sporcu kartına dön
          </Link>
        </motion.div>

        <motion.article
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1}
          className="soft-card-strong flex items-center gap-5 rounded-3xl p-5 sm:p-6"
        >
          <img
            src={a.img}
            alt={a.name}
            className="h-20 w-20 shrink-0 rounded-2xl object-cover object-top sm:h-24 sm:w-24"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-violet">
              {a.sportEmoji} {a.sport}
            </p>
            <p className="mt-1 font-display text-2xl font-bold leading-tight text-[color:var(--app-ink)] sm:text-3xl">
              {a.name}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="chip chip-violet">TR #{a.rank.national}</span>
              <span className="chip">{a.city}</span>
              <span className="chip chip-emerald">Aktif sezon</span>
            </div>
          </div>
        </motion.article>

        <motion.header
          variants={fade}
          initial="hidden"
          animate="show"
          custom={2}
          className="flex flex-col gap-2"
        >
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Aylık <span className="italic text-violet">destekle</span> yanında ol.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Doğrudan {a.name}'a gider. İstediğin zaman iptal edebilirsin.
          </p>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <motion.section variants={fade} initial="hidden" animate="show" custom={3} className="flex flex-col gap-8">
            <div>
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                Aylık tutar
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {PRESETS.map((p) => {
                  const active = selected === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setSelected(p);
                        setCustom("");
                      }}
                      className={`relative rounded-2xl border bg-white px-4 py-5 text-left transition-all ${
                        active
                          ? "border-violet/40 ring-2 ring-violet/30"
                          : "border-[color:var(--app-line)] hover:border-violet/30"
                      }`}
                    >
                      <p className="font-display text-2xl font-bold text-[color:var(--app-ink)]">
                        ₺{p}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                        Aylık
                      </p>
                      {active && (
                        <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-violet" />
                      )}
                    </button>
                  );
                })}
                <div
                  className={`rounded-2xl border bg-white px-4 py-3 transition-all ${
                    isCustom
                      ? "border-violet/40 ring-2 ring-violet/30"
                      : "border-[color:var(--app-line)]"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    Özel tutar
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-xl font-bold text-[color:var(--app-ink-soft)]">₺</span>
                    <input
                      type="number"
                      value={custom}
                      onChange={(e) => {
                        setCustom(e.target.value);
                        setSelected(-1);
                      }}
                      placeholder="0"
                      className="w-full bg-transparent font-display text-2xl font-bold text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)]/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">
                Ne kazanırsın?
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Destekçi rozeti",
                    note: "Canlı maçta tribün listesinde görünür.",
                  },
                  {
                    icon: BookOpenIcon,
                    title: "Maç sonrası günlüğe erken erişim",
                    note: "Sesli ve yazılı notlar herkesten 24 saat önce.",
                  },
                  {
                    icon: Video,
                    title: "Aylık özel video mesaj",
                    note: "₺250 ve üzeri destekçilere kişisel kayıt.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--app-ink)]">{item.title}</p>
                      <p className="mt-0.5 text-xs text-[color:var(--app-ink-soft)]">{item.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          <motion.aside variants={fade} initial="hidden" animate="show" custom={4} className="flex flex-col gap-4">
            <div className="soft-card-strong relative overflow-hidden rounded-3xl p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/15 blur-3xl" />
              <div className="relative">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-violet">
                  Tribüne ekleme özeti
                </p>
                <p className="mt-3 font-display text-4xl font-bold leading-none text-[color:var(--app-ink)]">
                  ₺{amount || 0}
                  <span className="ml-1 align-baseline text-base font-medium text-[color:var(--app-ink-soft)]">
                    /ay
                  </span>
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[color:var(--app-ink-soft)]">
                  <Calendar className="h-3.5 w-3.5" />
                  Sonraki çekim 17 Haziran
                </p>

                <button
                  onClick={handleDonate}
                  disabled={!canDonate}
                  className="btn-primary-light mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Heart className="h-4 w-4 fill-white" />
                  {donationMutation.isPending
                    ? "Kaydediliyor..."
                    : donationMutation.isSuccess
                      ? "Destek kaydedildi"
                      : "Desteklemeye Başla"}
                </button>
                <p className="mt-3 text-center text-[10px] text-[color:var(--app-ink-mute)]">
                  Tek tıkla iptal. Hiçbir gizli ücret yok.
                </p>
                {(donationMutation.isError || donationMutation.isSuccess || !activeFan.profile) && (
                  <p className="mt-2 rounded-lg bg-violet/8 px-2 py-1.5 text-center text-[10px] text-violet">
                    {donationMutation.isSuccess
                      ? "Bağışın backend'e kaydedildi. (Ödeme entegrasyonu henüz yok — demo)"
                      : donationMutation.isError
                        ? donationMutation.error instanceof Error
                          ? donationMutation.error.message
                          : "Bağış kaydedilemedi."
                        : "Bağış için backend'de bir taraftar profili gerekli."}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--app-line-soft)] bg-white/60 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
                  Şeffaf akış
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
                <span className="font-bold text-[color:var(--app-ink)]">%92</span> doğrudan sporcuya,{" "}
                <span className="font-bold text-[color:var(--app-ink)]">%8</span> platform işletim gideri.
              </p>
              <Link
                to="/dashboard"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet hover:underline"
              >
                Detayları gör <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </AppShell>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
