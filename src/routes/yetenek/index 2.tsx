import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  Info,
  MapPin,
  Sparkles,
  UserPlus,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listNeeds, listProfiles, updateProfile } from "@/lib/api";
import { backendNeedsToNeedsWithProfiles } from "@/lib/api-mappers";
import { CITY_OPTIONS } from "@/lib/form-options";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/yetenek/index 2")({
  component: TalentPage,
  head: () => ({ meta: [{ title: "Yetenek Bağışı — Meydan" }] }),
});

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const TALENTS = [
  "Terzilik",
  "Ulaşım / Şoförlük",
  "Dil dersi",
  "Video editör",
  "Tasarım",
  "Fizyoterapi",
  "Beslenme",
  "Fotoğraf",
  "Sosyal medya",
  "Ekipman tamiri",
  "Tercüme",
  "Muhasebe",
  "Mentor",
  "Web / yazılım",
  "Eğitmen",
];

const AVAILABILITY = ["Hafta içi akşam", "Hafta sonu", "Esnek"];

const FEATURED_CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Eskişehir"];

function buildOfferedTalent(opts: {
  talents: string[];
  city: string;
  availability: string;
  note: string;
}) {
  const parts = [
    opts.talents.length ? `Yetenekler: ${opts.talents.join(", ")}` : null,
    opts.city ? `Şehir: ${opts.city}` : null,
    opts.availability ? `Müsaitlik: ${opts.availability}` : null,
    opts.note.trim() ? `Not: ${opts.note.trim()}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

function parseOfferedTalent(raw: string | null | undefined): {
  talents: string[];
  city: string;
  availability: string;
  note: string;
} {
  const result = { talents: [] as string[], city: "", availability: "", note: "" };
  if (!raw) return result;
  for (const segment of raw.split(" · ")) {
    const [k, ...rest] = segment.split(":");
    const value = rest.join(":").trim();
    if (!value) continue;
    if (k === "Yetenekler") result.talents = value.split(",").map((s) => s.trim()).filter(Boolean);
    else if (k === "Şehir") result.city = value;
    else if (k === "Müsaitlik") result.availability = value;
    else if (k === "Not") result.note = value;
  }
  return result;
}

function TalentPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const isFan = session.role === "taraftar";
  const isAuthenticated = session.isAuthenticated;

  // Mevcut offered_talent değerinden parse et — kullanıcı geri geldiğinde
  // önceki kayıtlı yetenekleri görmeli.
  const initial = useMemo(
    () => parseOfferedTalent(session.profile?.offered_talent),
    [session.profile?.offered_talent],
  );

  const [picked, setPicked] = useState<Set<string>>(new Set(initial.talents));
  const [city, setCity] = useState<string>(initial.city || session.profile?.city || "İstanbul");
  const [avail, setAvail] = useState<string>(initial.availability || "Hafta sonu");
  const [note, setNote] = useState<string>(initial.note);
  const [savedFlash, setSavedFlash] = useState(false);

  // Session değişince state'i resetle.
  useEffect(() => {
    setPicked(new Set(initial.talents));
    setCity(initial.city || session.profile?.city || "İstanbul");
    setAvail(initial.availability || "Hafta sonu");
    setNote(initial.note);
  }, [initial, session.profile?.city]);

  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });
  const needsQuery = useQuery({
    queryKey: ["needs"],
    queryFn: () => listNeeds(),
    retry: 1,
  });

  const togglePick = (t: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const needList = useMemo(
    () => backendNeedsToNeedsWithProfiles(needsQuery.data?.needs, profilesQuery.data?.profiles),
    [needsQuery.data?.needs, profilesQuery.data?.profiles],
  );
  const talentNeeds = useMemo(
    () => needList.filter((n) => n.type === "talent"),
    [needList],
  );

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!session.profile?.id) {
        throw new Error("Kaydetmek için giriş yapmalısın.");
      }
      const offered = buildOfferedTalent({
        talents: [...picked],
        city,
        availability: avail,
        note,
      });
      return updateProfile(session.profile.id, {
        offered_talent: offered || null,
        city,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", "me"] });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    },
  });

  const canSave =
    isAuthenticated && isFan && picked.size > 0 && !saveMutation.isPending;

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        {/* ─── HERO ─── */}
        <motion.header
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0}
          className="flex flex-col gap-3"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-700">
            Yetenek Bağışı · Yardımlaşma
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
            Para değil,{" "}
            <span className="italic text-emerald-700">beceri</span> bağışla.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Türkiye'de sporcunun ihtiyacı her zaman para değil. Bazen{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">bir terzi</span>,
            bazen <span className="font-semibold text-[color:var(--app-ink)]">bir şoför</span>,
            bazen <span className="font-semibold text-[color:var(--app-ink)]">bir İngilizce öğretmeni</span>.
          </p>
        </motion.header>

        {/* ─── HOW IT WORKS (3 step) ─── */}
        <motion.section variants={fade} initial="hidden" animate="show" custom={1}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { n: "01", t: "Yeteneğini söyle", d: "Hangi konuda destek olabilirsin?" },
              { n: "02", t: "AI ihtiyaçlarla eşler", d: "Sporcu ihtiyaç oluşturduğunda yakın yeteneklere ulaşır." },
              { n: "03", t: "Sporcunun ekibi yazar", d: "Mesaj kutusunda devam edersin." },
            ].map((s, i) => (
              <div
                key={s.n}
                className="relative flex flex-col gap-2 rounded-3xl bg-white/70 px-5 py-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700">
                  Adım {s.n}
                </p>
                <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">{s.t}</p>
                <p className="text-xs text-[color:var(--app-ink-soft)]">{s.d}</p>
                {i < 2 && (
                  <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)] sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── AUTH GATE banner ─── */}
        {(!isAuthenticated || !isFan) && (
          <motion.section variants={fade} initial="hidden" animate="show" custom={2}>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/60 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
                <Info className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[color:var(--app-ink)]">
                  {!isAuthenticated
                    ? "Yeteneklerini kaydetmek için giriş yap"
                    : "Yetenek profili oluşturmak için taraftar hesabı gerekli"}
                </p>
                <p className="text-[11px] text-[color:var(--app-ink-soft)]">
                  {!isAuthenticated
                    ? "Bilgilerin sadece sporcu eşleşmesi için kullanılır."
                    : `Şu an ${session.role ?? "anonim"} rolündesin.`}
                </p>
              </div>
              {!isAuthenticated && (
                <Link
                  to="/giris"
                  className="btn-primary-light inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Giriş yap
                </Link>
              )}
            </div>
          </motion.section>
        )}

        {/* ─── FORM ─── */}
        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          custom={3}
          className="soft-card-strong rounded-3xl p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-emerald-700" />
              <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">
                Yetenek profilim
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
              {picked.size > 0 ? `${picked.size} yetenek seçili` : "Henüz seçim yok"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
            Seçtiğin yetenekler ve şehir bilgisi AI'ın senin için doğru sporcu ihtiyacını
            bulmasında kullanılır.
          </p>

          {/* ─ Yetenek chip grid ─ */}
          <div className="mt-7">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
              Hangi konuda destek olabilirsin?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TALENTS.map((t) => {
                const active = picked.has(t);
                return (
                  <motion.button
                    key={t}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => togglePick(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-emerald-600/50 bg-emerald-500/12 text-emerald-700 ring-2 ring-emerald-500/20"
                        : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-emerald-600/30 hover:text-[color:var(--app-ink)]"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={2.6} />}
                    {t}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ─ City + Availability ─ */}
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
                Şehir
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[color:var(--app-line)] bg-white px-3 py-2.5">
                <MapPin className="h-4 w-4 text-[color:var(--app-ink-mute)]" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm font-semibold text-[color:var(--app-ink)] focus:outline-none"
                >
                  <optgroup label="Popüler">
                    {FEATURED_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Tüm iller">
                    {CITY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
                Müsait zaman
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {AVAILABILITY.map((opt) => {
                  const active = avail === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvail(opt)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "border-violet/40 bg-violet/10 text-violet"
                          : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30"
                      }`}
                    >
                      <Clock className="h-3 w-3" /> {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─ Note ─ */}
          <div className="mt-7">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
              Ekstra not (opsiyonel)
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 240))}
              rows={3}
              placeholder="Deneyimini, beklentini veya kısıtını birkaç cümleyle anlat. AI eşleşmesi için kullanılır."
              className="mt-3 w-full resize-none rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3 text-sm leading-relaxed text-[color:var(--app-ink)] outline-none transition-all focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15"
            />
            <p className="mt-1 text-right font-mono text-[10px] tabular-nums text-[color:var(--app-ink-mute)]">
              {note.length}/240
            </p>
          </div>

          {/* ─ Action row ─ */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--app-line-soft)] pt-5">
            <p className="text-[11px] text-[color:var(--app-ink-mute)]">
              {picked.size > 0
                ? `${[...picked].slice(0, 3).join(" · ")}${picked.size > 3 ? ` +${picked.size - 3}` : ""}`
                : "Önce en az bir yetenek seç"}
            </p>
            <div className="flex items-center gap-2">
              {saveMutation.isError && (
                <p className="rounded-full bg-coral/10 px-3 py-1 text-[11px] font-semibold text-coral">
                  {saveMutation.error instanceof Error
                    ? saveMutation.error.message
                    : "Kaydedilemedi"}
                </p>
              )}
              <button
                type="button"
                onClick={() => saveMutation.mutate()}
                disabled={!canSave}
                className="btn-primary-light inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    Kaydediliyor...
                  </>
                ) : savedFlash ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Kaydedildi
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Yeteneklerimi Kaydet
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Saved toast */}
          <AnimatePresence>
            {savedFlash && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50/60 px-4 py-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-xs leading-relaxed text-[color:var(--app-ink)]">
                  Profilin güncellendi. Sporcu bir ihtiyaç oluşturduğunda AI seni listesine alabilir.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Aktif ihtiyaçlar (taraftarın görsel motivasyonu) ─── */}
        <motion.section variants={fade} initial="hidden" animate="show" custom={4}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Şu an aktif yetenek ihtiyaçları
            </h2>
            <span className="text-xs text-[color:var(--app-ink-soft)]">
              {talentNeeds.length} açık çağrı
            </span>
          </div>
          <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
            Eşleşme tetikleyici sporcudur. Yetenekleri kayıtlı olan taraftarlar AI tarafından
            otomatik olarak listede üst sıralara çıkar.
          </p>

          {talentNeeds.length === 0 ? (
            <div className="mt-5 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white/50 px-6 py-12 text-center">
              <Heart className="h-5 w-5 text-[color:var(--app-ink-mute)]" />
              <p className="text-sm text-[color:var(--app-ink-soft)]">
                Şu an yetenek talebi yok. Yakında sporculardan yeni çağrılar gelecek.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {talentNeeds.map((n) => (
                <article
                  key={n.id}
                  className="soft-card flex flex-col gap-3 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={n.athleteImg}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover object-top"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">
                        {n.athleteName}
                      </p>
                      <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">
                        {n.city}
                      </p>
                    </div>
                    {n.urgent && <span className="chip chip-coral">Acil</span>}
                  </div>
                  <p className="text-sm font-semibold text-[color:var(--app-ink)]">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-[color:var(--app-ink-soft)]">
                    {n.description}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {n.talentNeeded && (
                      <span className="chip chip-emerald">{n.talentNeeded}</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--app-ink-mute)]">
                      <Calendar className="h-3 w-3" /> {n.deadline}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </AppShell>
  );
}
