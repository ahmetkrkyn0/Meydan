import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
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
  CalendarDays,
  SunMoon,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listNeeds, listProfiles, updateProfile } from "@/lib/api";
import { backendNeedsToNeedsWithProfiles } from "@/lib/api-mappers";
import { CITY_OPTIONS } from "@/lib/form-options";
import { useSession } from "@/lib/session";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

export const Route = createFileRoute("/yetenek/")({
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

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Hafta İçi", "Hafta Sonu", "Esnek"];
const TIMES = ["Sabah", "Öğle", "Akşam", "Tüm Gün", "Esnek"];
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

  const initial = useMemo(
    () => parseOfferedTalent(session.profile?.offered_talent),
    [session.profile?.offered_talent],
  );

  const [picked, setPicked] = useState<Set<string>>(new Set(initial.talents));
  const [city, setCity] = useState<string>(initial.city || session.profile?.city || "İstanbul");
  
  const availParts = initial.availability ? initial.availability.split(", ") : [];
  const [day, setDay] = useState<string>(availParts[0] || "Esnek");
  const [time, setTime] = useState<string>(availParts[1] || "Esnek");
  
  const [note, setNote] = useState<string>(initial.note);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setPicked(new Set(initial.talents));
    setCity(initial.city || session.profile?.city || "İstanbul");
    const parts = initial.availability ? initial.availability.split(", ") : [];
    setDay(parts[0] || "Esnek");
    setTime(parts[1] || "Esnek");
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
        availability: `${day}, ${time}`,
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

  const steps = [
    { n: "01", t: "Yeteneğini söyle", d: "Hangi konuda destek olabilirsin?" },
    { n: "02", t: "AI ihtiyaçlarla eşler", d: "Sporcu ihtiyaç oluşturduğunda yakın yeteneklere ulaşır." },
    { n: "03", t: "Sporcunun ekibi yazar", d: "Mesaj kutusunda devam edersin." },
  ];

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        {/* ═══ SOL KOLON ═══ */}
        <div className="flex min-w-0 flex-col gap-10">
          {/* ─── HERO ─── */}
          <motion.header
            variants={fade}
            initial="hidden"
            animate="show"
            custom={0}
            className="flex flex-col gap-4"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Yetenek Bağışı
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-6xl lg:text-[4rem]">
              Para değil,{" "}
              <span className="bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent">beceri</span> bağışla.
            </h1>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-[color:var(--app-ink-soft)]">
              Türkiye'de sporcunun ihtiyacı her zaman para değil. Bazen{" "}
              <span className="font-bold text-[color:var(--app-ink)]">bir terzi</span>,
              bazen <span className="font-bold text-[color:var(--app-ink)]">bir şoför</span>,
              bazen <span className="font-bold text-[color:var(--app-ink)]">bir İngilizce öğretmeni</span>.
            </p>
          </motion.header>

        {/* ─── AUTH GATE banner ─── */}
        {(!isAuthenticated || !isFan) && (
          <motion.section variants={fade} initial="hidden" animate="show" custom={2}>
            <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-50/80 to-teal-50/40 p-5 shadow-sm backdrop-blur-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <Info className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-[color:var(--app-ink)]">
                  {!isAuthenticated
                    ? "Yeteneklerini kaydetmek için giriş yap"
                    : "Yetenek profili oluşturmak için taraftar hesabı gerekli"}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[color:var(--app-ink-soft)]">
                  {!isAuthenticated
                    ? "Bilgilerin sadece sporcu eşleşmesi için kullanılır."
                    : `Şu an ${session.role ?? "anonim"} rolündesin.`}
                </p>
              </div>
              {!isAuthenticated && (
                <Link
                  to="/giris"
                  className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm"
                >
                  <UserPlus className="h-4 w-4" /> Giriş yap
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
          className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--app-line)] bg-white/60 p-1 shadow-sm backdrop-blur-xl"
        >
          {/* Subtle background glow */}
          <div className="absolute -left-40 -top-40 -z-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-[80px]" />
          
          <div className="flex flex-col gap-8 rounded-[1.8rem] bg-white/80 p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--app-line-soft)] pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Wrench className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[color:var(--app-ink)]">
                    Yetenek Profilim
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-[color:var(--app-ink-soft)]">
                    AI eşleşmesi için uzmanlık alanlarını ve konumunu belirle.
                  </p>
                </div>
              </div>
            </div>

            {/* ─ Yetenek chip grid ─ */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Uzmanlık Alanların
                </p>
                <span className="rounded-full bg-[color:var(--app-line)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--app-ink-soft)]">
                  {picked.size > 0 ? `${picked.size} Seçili` : "Zorunlu"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {TALENTS.map((t) => {
                  const active = picked.has(t);
                  return (
                    <motion.button
                      key={t}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => togglePick(t)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                        active
                          ? "border-emerald-600/50 bg-emerald-500/10 text-emerald-800 ring-4 ring-emerald-500/10"
                          : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-emerald-600/30 hover:bg-emerald-50/50 hover:text-[color:var(--app-ink)]"
                      }`}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} />}
                      {t}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ─ DROPDOWNS (Bento style) ─ */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* City Dropdown */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--app-line-soft)] bg-[color:var(--app-bg-soft)] p-4">
                <div className="flex items-center gap-2 text-[color:var(--app-ink-mute)]">
                  <MapPin className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-wider">Şehir</p>
                </div>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-none bg-white px-4 font-bold shadow-sm focus:ring-emerald-500">
                    <SelectValue placeholder="Şehir Seçin" />
                  </SelectTrigger>
                  <SelectContent className="z-50 rounded-xl border-emerald-100 bg-white font-medium text-slate-900 shadow-xl">
                    <SelectGroup>
                      <SelectLabel className="text-xs font-bold text-slate-500">Popüler</SelectLabel>
                      {FEATURED_CITIES.map((c) => (
                        <SelectItem key={c} value={c} className="cursor-pointer rounded-lg text-slate-800 focus:bg-emerald-50 focus:text-emerald-900 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900">{c}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator className="bg-[color:var(--app-line-soft)]" />
                    <SelectGroup>
                      <SelectLabel className="text-xs font-bold text-slate-500">Tüm İller</SelectLabel>
                      {CITY_OPTIONS.filter((c) => !FEATURED_CITIES.includes(c)).map((c) => (
                        <SelectItem key={c} value={c} className="cursor-pointer rounded-lg text-slate-800 focus:bg-emerald-50 focus:text-emerald-900 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900">{c}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Day Dropdown */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--app-line-soft)] bg-[color:var(--app-bg-soft)] p-4">
                <div className="flex items-center gap-2 text-[color:var(--app-ink-mute)]">
                  <CalendarDays className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-wider">Müsait Gün</p>
                </div>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-none bg-white px-4 font-bold shadow-sm focus:ring-emerald-500">
                    <SelectValue placeholder="Gün Seçin" />
                  </SelectTrigger>
                  <SelectContent className="z-50 rounded-xl border-emerald-100 bg-white font-medium text-slate-900 shadow-xl">
                    {DAYS.map((d) => (
                      <SelectItem key={d} value={d} className="cursor-pointer rounded-lg text-slate-800 focus:bg-emerald-50 focus:text-emerald-900 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Dropdown */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--app-line-soft)] bg-[color:var(--app-bg-soft)] p-4">
                <div className="flex items-center gap-2 text-[color:var(--app-ink-mute)]">
                  <SunMoon className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-wider">Zaman Dilimi</p>
                </div>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-none bg-white px-4 font-bold shadow-sm focus:ring-emerald-500">
                    <SelectValue placeholder="Zaman Seçin" />
                  </SelectTrigger>
                  <SelectContent className="z-50 rounded-xl border-emerald-100 bg-white font-medium text-slate-900 shadow-xl">
                    {TIMES.map((t) => (
                      <SelectItem key={t} value={t} className="cursor-pointer rounded-lg text-slate-800 focus:bg-emerald-50 focus:text-emerald-900 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ─ Note ─ */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Ekstra Not (Opsiyonel)
              </p>
              <div className="relative mt-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 240))}
                  rows={3}
                  placeholder="Deneyimini, beklentini veya kısıtını birkaç cümleyle anlat. AI eşleşmesi için detaylar önemlidir..."
                  className="w-full resize-none rounded-2xl border border-[color:var(--app-line)] bg-[color:var(--app-bg-soft)] px-5 py-4 pb-8 text-sm font-medium leading-relaxed text-[color:var(--app-ink)] outline-none transition-all focus:border-emerald-500/40 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
                <p className="pointer-events-none absolute bottom-3 right-4 font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">
                  {note.length} / 240
                </p>
              </div>
            </div>

            {/* ─ Action row ─ */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--app-line-soft)] pt-6">
              <p className="text-xs font-bold text-[color:var(--app-ink-mute)]">
                {picked.size > 0
                  ? `${[...picked].slice(0, 3).join(" · ")}${picked.size > 3 ? ` +${picked.size - 3}` : ""}`
                  : "Önce en az bir yetenek seç"}
              </p>
              <div className="flex items-center gap-3">
                {saveMutation.isError && (
                  <p className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-600">
                    {saveMutation.error instanceof Error
                      ? saveMutation.error.message
                      : "Kaydedilemedi"}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={!canSave}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[color:var(--app-ink)] px-8 py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-500/25 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Kaydediliyor...
                    </>
                  ) : savedFlash ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" /> Kaydedildi
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Profili Güncelle
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Saved toast */}
            <AnimatePresence>
              {savedFlash && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50 px-5 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-[color:var(--app-ink)]">
                      Profilin başarıyla güncellendi! AI artık seni eşleşmelerde öne çıkaracak.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
        </div>

        {/* ═══ SAĞ KOLON · Dikey timeline ═══ */}
        <motion.aside
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1}
          aria-label="Nasıl çalışır"
          className="hidden lg:flex lg:pt-52"
        >
          <div className="sticky top-28 flex w-full flex-col gap-5">
            {steps.map((s, i) => (
              <div key={s.n} className="flex flex-col items-stretch">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[color:var(--app-line)] bg-white/70 p-6 shadow-sm backdrop-blur-md">
                  <div className="absolute -right-6 -top-6 text-[6rem] font-black leading-none text-emerald-500/5 selection:bg-transparent">
                    {s.n}
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <p className="font-mono text-sm font-black uppercase tracking-[0.25em] text-emerald-600">
                      Adım {s.n}
                    </p>
                    <p className="font-display text-xl font-extrabold leading-[1.15] tracking-tight text-[color:var(--app-ink)]">
                      {s.t}
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-[color:var(--app-ink-soft)]">
                      {s.d}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-2" aria-hidden>
                    <svg
                      className="h-10 w-16 text-emerald-500/40 drop-shadow-sm"
                      fill="none"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      {i % 2 === 0 ? (
                        <path d="M50 0 C80 30, 80 70, 50 90" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />
                      ) : (
                        <path d="M50 0 C20 30, 20 70, 50 90" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />
                      )}
                      <path d="M42 80 L50 95 L58 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.aside>
        </div>

        {/* ─── Aktif ihtiyaçlar (taraftarın görsel motivasyonu) ─── */}
        <motion.section variants={fade} initial="hidden" animate="show" custom={4} className="mt-4 border-t border-[color:var(--app-line-soft)] pt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[color:var(--app-ink)]">
                Açık Yetenek Çağrıları
              </h2>
              <p className="mt-1.5 text-sm font-medium text-[color:var(--app-ink-soft)]">
                Yeteneklerini kaydedenler, AI eşleşmesinde en üstte listelenir.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--app-line)] bg-white px-4 py-2 text-sm font-bold shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              {talentNeeds.length} Aktif Çağrı
            </div>
          </div>

          {talentNeeds.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-[color:var(--app-line)] bg-white/40 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--app-bg-soft)]">
                <Heart className="h-8 w-8 text-[color:var(--app-ink-mute)]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-base font-bold text-[color:var(--app-ink)]">Henüz açık bir çağrı yok</p>
                <p className="mt-1 text-sm font-medium text-[color:var(--app-ink-soft)]">Yakında sporculardan yeni talepler gelecektir.</p>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {talentNeeds.map((n) => (
                <article
                  key={n.id}
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-[1.5rem] border border-[color:var(--app-line)] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={n.athleteImg}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover object-top shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[color:var(--app-ink)]">
                          {n.athleteName}
                        </p>
                        <p className="flex items-center gap-1 truncate text-xs font-semibold text-[color:var(--app-ink-soft)]">
                          <MapPin className="h-3 w-3" /> {n.city}
                        </p>
                      </div>
                    </div>
                    {n.urgent && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600">
                        Acil
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-base font-bold leading-tight text-[color:var(--app-ink)]">{n.title}</p>
                    <p className="mt-2 line-clamp-2 text-xs font-medium leading-relaxed text-[color:var(--app-ink-soft)]">
                      {n.description}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    {n.talentNeeded && (
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700">
                        {n.talentNeeded}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--app-line)] bg-[color:var(--app-bg-soft)] px-2.5 py-1.5 text-[11px] font-bold text-[color:var(--app-ink-soft)]">
                      <Calendar className="h-3.5 w-3.5" /> {n.deadline}
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
