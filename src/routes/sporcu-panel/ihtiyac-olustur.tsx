import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Camera,
  Check,
  CheckCircle2,
  Coins,
  Compass,
  Dumbbell,
  Flame,
  Globe,
  Heart,
  Languages,
  MapPin,
  Megaphone,
  Mic,
  Plane,
  Plus,
  Salad,
  ScissorsLineDashed,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  UserCog,
  Video,
  Wrench,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { ActiveAthletePicker } from "@/components/meydan/ActiveAthletePicker";
import { createNeed } from "@/lib/api";
import { useActiveAthlete } from "@/lib/active-athlete";

export const Route = createFileRoute("/sporcu-panel/ihtiyac-olustur")({
  component: CreateNeedPage,
  head: () => ({ meta: [{ title: "Yeni İhtiyaç Kartı — Meydan" }] }),
});

// ─────────────────────────────────────────────────────────────────────
// Motion
// ─────────────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

// ─────────────────────────────────────────────────────────────────────
// Preset şablonları — kullanıcı tek tıklamayla ihtiyaç oluşturur
// ─────────────────────────────────────────────────────────────────────

type MoneyTemplate = {
  id: string;
  icon: typeof Plane;
  title: string;
  description: string;
  category: string;
};

type TalentTemplate = {
  id: string;
  icon: typeof Video;
  title: string;
  description: string;
  category: string;
  talent: string;
};

const MONEY_TEMPLATES: MoneyTemplate[] = [
  {
    id: "yol",
    icon: Plane,
    category: "Yol",
    title: "Yurt dışı yarışma yol masrafı",
    description:
      "Uluslararası turnuva için uçak, konaklama ve transfer giderlerini karşılamaya destek arıyorum.",
  },
  {
    id: "ekipman",
    icon: Dumbbell,
    category: "Ekipman",
    title: "Yeni yarışma ekipmanı",
    description:
      "Sezon başında yenilenmesi gereken ekipmanlar için destek topluyorum. Profesyonel düzeyde ürünler.",
  },
  {
    id: "antrenor",
    icon: Trophy,
    category: "Antrenör",
    title: "Özel antrenör seansları",
    description:
      "Önemli bir hedef öncesi haftalık özel antrenör seansları için aylık destek arıyorum.",
  },
  {
    id: "beslenme",
    icon: Salad,
    category: "Beslenme",
    title: "Sezon boyu beslenme planı",
    description:
      "Yarış sezonuna hazırlık için profesyonel beslenme programı ve takip giderleri.",
  },
  {
    id: "kamp",
    icon: Flame,
    category: "Kamp katkısı",
    title: "Hazırlık kampı katkısı",
    description:
      "Sezon öncesi 3 haftalık hazırlık kampı için konaklama ve antrenman tesisi katkısı.",
  },
  {
    id: "saglik",
    icon: Heart,
    category: "Sağlık",
    title: "Fizyoterapi ve sağlık takibi",
    description:
      "Sakatlık önleme ve toparlanma için düzenli fizyoterapi seansları gerekiyor.",
  },
];

const TALENT_TEMPLATES: TalentTemplate[] = [
  {
    id: "editor",
    icon: Video,
    category: "İçerik",
    talent: "Video editör",
    title: "Maç ve antrenman videosu editörü",
    description:
      "Sosyal medya için kısa videolar ve maç highlight'ları hazırlayacak bir editör arıyorum.",
  },
  {
    id: "tasarim",
    icon: Camera,
    category: "Tasarım",
    talent: "Grafik tasarımcı",
    title: "Sosyal medya görselleri",
    description:
      "Maç afişleri, antrenman gönderileri ve hikaye şablonları için grafik tasarımcı.",
  },
  {
    id: "tercume",
    icon: Languages,
    category: "Tercüme",
    talent: "İngilizce tercüman",
    title: "Yabancı basın için tercüme",
    description:
      "Yurt dışı turnuvalarda röportaj ve antrenör iletişimi için tercüme desteği.",
  },
  {
    id: "egitmen",
    icon: ScissorsLineDashed,
    category: "Eğitmen",
    talent: "Dil eğitmeni",
    title: "Haftalık İngilizce dersleri",
    description:
      "Uluslararası ortamda iletişim için haftalık 2 saatlik İngilizce konuşma pratiği.",
  },
  {
    id: "mentor",
    icon: UserCog,
    category: "Mentor",
    talent: "Kariyer mentoru",
    title: "Kariyer planlama mentoru",
    description:
      "Sponsorluk, kontrat ve kariyer kararları için deneyimli bir mentor.",
  },
  {
    id: "beslenme-uzmani",
    icon: Stethoscope,
    category: "Beslenme",
    talent: "Beslenme uzmanı",
    title: "Beslenme uzmanı danışmanlığı",
    description:
      "Sezon boyu uzaktan takip yapacak ve menü hazırlayacak bir beslenme uzmanı.",
  },
  {
    id: "sosyal-medya",
    icon: Megaphone,
    category: "İçerik",
    talent: "Sosyal medya yöneticisi",
    title: "Sosyal medya yönetimi",
    description:
      "Haftalık içerik takvimi, paylaşım planı ve toplulukla iletişim için destek.",
  },
  {
    id: "fotograf",
    icon: Mic,
    category: "İçerik",
    talent: "Fotoğrafçı",
    title: "Antrenman ve maç fotoğrafçılığı",
    description:
      "Profesyonel sahnedeki anları belgelemek için ayda 1-2 gün fotoğrafçı.",
  },
];

// Preset tutar/süre seçenekleri
const AMOUNT_PRESETS = [
  { value: 5_000, label: "5K", description: "Küçük destek" },
  { value: 10_000, label: "10K", description: "Orta düzey" },
  { value: 25_000, label: "25K", description: "Önemli ihtiyaç" },
  { value: 50_000, label: "50K", description: "Büyük yatırım" },
  { value: 100_000, label: "100K", description: "Sezonluk hedef" },
];

const DEADLINE_PRESETS = [
  { id: "1w", label: "1 hafta", days: 7 },
  { id: "2w", label: "2 hafta", days: 14 },
  { id: "1m", label: "1 ay", days: 30 },
  { id: "3m", label: "3 ay", days: 90 },
  { id: "6m", label: "6 ay", days: 180 },
];

function dateFromDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────

function CreateNeedPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const activeAthlete = useActiveAthlete();
  const activeProfile = activeAthlete.profile;
  const me = activeAthlete.athlete;

  // Wizard step
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<"money" | "talent">("money");
  const [moneyTemplateId, setMoneyTemplateId] = useState<string>("yol");
  const [talentTemplateId, setTalentTemplateId] = useState<string>("editor");
  const [amountPreset, setAmountPreset] = useState<number>(25_000);
  const [deadlinePreset, setDeadlinePreset] = useState<string>("1m");
  const [availability, setAvailability] = useState<"local" | "online" | null>(null);
  const [urgent, setUrgent] = useState(false);

  // Hesaplananlar
  const selectedTemplate = useMemo(() => {
    if (type === "money") {
      return MONEY_TEMPLATES.find((t) => t.id === moneyTemplateId) ?? MONEY_TEMPLATES[0];
    }
    return TALENT_TEMPLATES.find((t) => t.id === talentTemplateId) ?? TALENT_TEMPLATES[0];
  }, [type, moneyTemplateId, talentTemplateId]);

  const deadlineDays =
    DEADLINE_PRESETS.find((d) => d.id === deadlinePreset)?.days ?? 30;
  const deadlineDateStr = dateFromDays(deadlineDays);

  const createNeedMutation = useMutation({
    mutationFn: () => {
      if (!activeProfile?.id) {
        throw new Error("Backend'de sporcu profili bulunamadı.");
      }
      if (type === "talent" && !availability) {
        throw new Error("Çalışma şeklini seç (yerel ya da online).");
      }
      return createNeed({
        athlete_id: activeProfile.id,
        title: selectedTemplate.title,
        description: selectedTemplate.description,
        need_type: type,
        category: selectedTemplate.category,
        is_urgent: urgent,
        ...(type === "money"
          ? { target_amount: amountPreset, deadline: deadlineDateStr }
          : {
              talent_needed: (selectedTemplate as TalentTemplate).talent,
              availability: availability ?? "online",
            }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["needs"] });
      setTimeout(() => {
        navigate({ to: "/sporcu-panel/ihtiyaclar" }).catch(() => undefined);
      }, 1200);
    },
  });

  const canPublish =
    Boolean(activeProfile?.id) &&
    !createNeedMutation.isPending &&
    (type === "money" || availability !== null);

  // ─── Empty state (no profile) ───
  if (!me) {
    return (
      <AppShell role="athlete">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 py-16">
          <ActiveAthletePicker state={activeAthlete} />
          <p className="text-sm text-[color:var(--app-ink-soft)]">
            Yeni ihtiyaç kartı yayınlamak için aktif bir sporcu profili gerekli.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="athlete" userName={me.name} userCity={me.city}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16"
      >
        <ActiveAthletePicker state={activeAthlete} />

        {/* ─── HERO + STEPPER ─── */}
        <motion.header
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem]"
        >
          <div className="absolute inset-0 bg-aurora-light opacity-90" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-coral/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 px-6 py-9 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/sporcu-panel/ihtiyaclar"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> İhtiyaçlarıma dön
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[color:var(--app-ink-soft)] backdrop-blur">
                <Zap className="h-3 w-3" /> Hazır şablonlardan seç
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-violet">
                Yeni İhtiyaç Kartı
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
                3 adımda{" "}
                <span className="italic text-violet">ihtiyacını paylaş</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-[color:var(--app-ink-soft)] sm:text-base">
                Yazmana gerek yok — hazır şablonlardan ve seçeneklerden tek tıkla
                ihtiyacını oluştur. Topluluk anında görür.
              </p>
            </div>

            {/* Stepper */}
            <div className="mt-3 flex items-center gap-2 sm:gap-3">
              {[
                { n: 1, label: "Tür" },
                { n: 2, label: "Şablon" },
                { n: 3, label: "Detay" },
              ].map((s, i) => {
                const active = step === s.n;
                const completed = step > s.n;
                return (
                  <div key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(s.n as 1 | 2 | 3)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-xs font-bold transition-all ${
                        active
                          ? "border-violet bg-violet text-white shadow-[0_6px_20px_-6px_oklch(0.60_0.22_252/0.50)]"
                          : completed
                            ? "border-violet/30 bg-violet/10 text-violet"
                            : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-mute)]"
                      }`}
                    >
                      {completed ? <Check className="h-4 w-4" strokeWidth={2.6} /> : s.n}
                    </button>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                        active
                          ? "text-[color:var(--app-ink)]"
                          : "text-[color:var(--app-ink-mute)]"
                      }`}
                    >
                      {s.label}
                    </span>
                    {i < 2 && (
                      <div
                        className={`hidden h-px flex-1 sm:block ${
                          completed ? "bg-violet/40" : "bg-[color:var(--app-line)]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.header>

        {/* ─── BODY: 2 column (form + preview) ─── */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* LEFT: Wizard */}
          <motion.section variants={fadeUp} className="flex flex-col gap-7">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex flex-col gap-5"
                >
                  <SectionTitle
                    step="01"
                    title="Ne tür bir ihtiyacın var?"
                    subtitle="Para mı, yetenek mi — sonra detayları seçeceğiz."
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TypeCard
                      icon={Banknote}
                      active={type === "money"}
                      tone="violet"
                      title="Para Desteği"
                      description="Yol, ekipman, antrenör, kamp, beslenme için maddi destek."
                      onClick={() => setType("money")}
                    />
                    <TypeCard
                      icon={Wrench}
                      active={type === "talent"}
                      tone="emerald"
                      title="Yetenek Desteği"
                      description="Editör, tasarımcı, mentor, beslenme uzmanı — uzmanlık desteği."
                      onClick={() => setType("talent")}
                    />
                  </div>
                  <StepNav
                    onNext={() => setStep(2)}
                    nextLabel="Şablon seç"
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex flex-col gap-5"
                >
                  <SectionTitle
                    step="02"
                    title="Bir şablon seç"
                    subtitle="Hazır metni kullan, daha sonra detayları ayarla."
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(type === "money" ? MONEY_TEMPLATES : TALENT_TEMPLATES).map((t) => (
                      <TemplateCard
                        key={t.id}
                        icon={t.icon}
                        title={t.title}
                        category={t.category}
                        description={t.description}
                        active={
                          (type === "money" ? moneyTemplateId : talentTemplateId) === t.id
                        }
                        tone={type === "money" ? "violet" : "emerald"}
                        onClick={() => {
                          if (type === "money") setMoneyTemplateId(t.id);
                          else setTalentTemplateId(t.id);
                        }}
                      />
                    ))}
                  </div>
                  <StepNav
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                    nextLabel="Detaylar"
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex flex-col gap-7"
                >
                  <SectionTitle
                    step="03"
                    title="Son detaylar"
                    subtitle="Tutar, süre, aciliyet — birkaç tıkla bitir."
                  />

                  {/* Money details */}
                  {type === "money" && (
                    <>
                      <FieldBlock
                        icon={Coins}
                        label="Hedef Tutar"
                        tone="violet"
                      >
                        <div className="grid grid-cols-5 gap-2">
                          {AMOUNT_PRESETS.map((a) => {
                            const active = amountPreset === a.value;
                            return (
                              <button
                                key={a.value}
                                type="button"
                                onClick={() => setAmountPreset(a.value)}
                                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition-all ${
                                  active
                                    ? "border-violet bg-violet/8 ring-2 ring-violet/30"
                                    : "border-[color:var(--app-line)] bg-white hover:border-violet/30"
                                }`}
                              >
                                <p
                                  className={`font-display text-lg font-bold leading-none ${
                                    active ? "text-violet" : "text-[color:var(--app-ink)]"
                                  }`}
                                >
                                  ₺{a.label}
                                </p>
                                <p className="text-[9px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                                  {a.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </FieldBlock>

                      <FieldBlock
                        icon={Target}
                        label="Son Tarih"
                        tone="violet"
                      >
                        <div className="grid grid-cols-5 gap-2">
                          {DEADLINE_PRESETS.map((d) => {
                            const active = deadlinePreset === d.id;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setDeadlinePreset(d.id)}
                                className={`flex flex-col items-center justify-center rounded-2xl border px-2 py-3 text-xs font-semibold transition-all ${
                                  active
                                    ? "border-violet bg-violet/8 text-violet ring-2 ring-violet/30"
                                    : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30"
                                }`}
                              >
                                {d.label}
                              </button>
                            );
                          })}
                        </div>
                      </FieldBlock>
                    </>
                  )}

                  {/* Talent details */}
                  {type === "talent" && (
                    <FieldBlock
                      icon={Globe}
                      label="Bu iş için fiziksel buluşma gerekiyor mu?"
                      tone="emerald"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setAvailability("local")}
                          className={`flex flex-col items-start gap-1.5 rounded-2xl border px-4 py-3.5 text-left transition-all ${
                            availability === "local"
                              ? "border-emerald-600/40 bg-emerald-500/10 ring-2 ring-emerald-500/30"
                              : "border-[color:var(--app-line)] bg-white hover:border-emerald-500/30"
                          }`}
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--app-ink)]">
                            <MapPin className="h-4 w-4 text-emerald-700" />
                            Evet, {me.city}'da olmalı
                          </span>
                          <span className="text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                            Terzi, fizyo, ulaşım, ekipman tamiri gibi yüz yüze işler.
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAvailability("online")}
                          className={`flex flex-col items-start gap-1.5 rounded-2xl border px-4 py-3.5 text-left transition-all ${
                            availability === "online"
                              ? "border-emerald-600/40 bg-emerald-500/10 ring-2 ring-emerald-500/30"
                              : "border-[color:var(--app-line)] bg-white hover:border-emerald-500/30"
                          }`}
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--app-ink)]">
                            <Globe className="h-4 w-4 text-emerald-700" />
                            Hayır, online olur
                          </span>
                          <span className="text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                            Video editör, tasarım, dil dersi, mentor gibi uzaktan işler.
                          </span>
                        </button>
                      </div>
                      {availability === null && (
                        <p className="mt-2 text-[11px] text-coral">
                          Yayınlamadan önce bir seçenek işaretle.
                        </p>
                      )}
                    </FieldBlock>
                  )}

                  {/* Urgency toggle */}
                  <FieldBlock
                    icon={Flame}
                    label="Aciliyet"
                    tone="coral"
                  >
                    <button
                      type="button"
                      onClick={() => setUrgent((v) => !v)}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                        urgent
                          ? "border-coral/40 bg-coral/8 ring-2 ring-coral/30"
                          : "border-[color:var(--app-line)] bg-white hover:border-coral/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            urgent ? "bg-coral text-white" : "bg-coral/12 text-coral"
                          }`}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[color:var(--app-ink)]">
                            Acil olarak işaretle
                          </p>
                          <p className="text-[11px] text-[color:var(--app-ink-soft)]">
                            Taraftar akışında üste çıkar, daha hızlı görünür.
                          </p>
                        </div>
                      </div>
                      <span
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          urgent ? "bg-coral" : "bg-[color:var(--app-line)]"
                        }`}
                      >
                        <motion.span
                          layout
                          className="absolute h-5 w-5 rounded-full bg-white shadow"
                          animate={{ left: urgent ? 22 : 2 }}
                          transition={{ type: "spring", duration: 0.35 }}
                        />
                      </span>
                    </button>
                  </FieldBlock>

                  {/* Publish */}
                  <div className="flex flex-col gap-3 border-t border-[color:var(--app-line-soft)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-ghost-light inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                    >
                      <ArrowLeft className="h-4 w-4" /> Geri
                    </button>

                    <div className="flex items-center gap-3">
                      <Link
                        to="/sporcu-panel"
                        className="text-xs font-semibold text-[color:var(--app-ink-mute)] underline-offset-4 hover:underline"
                      >
                        Vazgeç
                      </Link>
                      <button
                        type="button"
                        onClick={() => createNeedMutation.mutate()}
                        disabled={!canPublish}
                        className="btn-primary-light inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {createNeedMutation.isPending ? (
                          <>
                            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                            Yayınlanıyor...
                          </>
                        ) : createNeedMutation.isSuccess ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Yayınlandı
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Yayınla
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {(createNeedMutation.isError || createNeedMutation.isSuccess) && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl px-4 py-3 text-xs font-medium ${
                        createNeedMutation.isSuccess
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-coral/10 text-coral"
                      }`}
                    >
                      {createNeedMutation.isSuccess
                        ? "✓ İhtiyacın kaydedildi. Listeye yönlendiriliyorsun..."
                        : createNeedMutation.error instanceof Error
                          ? createNeedMutation.error.message
                          : "Yayınlanamadı."}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* RIGHT: Live preview */}
          <motion.aside variants={fadeUp}>
            <div className="sticky top-24 flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                Canlı önizleme — topluluk böyle görecek
              </p>
              <PreviewCard
                me={me}
                type={type}
                template={selectedTemplate}
                amount={amountPreset}
                deadlineDays={deadlineDays}
                availability={availability}
                urgent={urgent}
              />
              <div className="rounded-2xl border border-[color:var(--app-line-soft)] bg-white/60 p-4">
                <div className="flex items-center gap-2 text-violet">
                  <Compass className="h-3.5 w-3.5" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
                    İpucu
                  </p>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                  İhtiyaç oluştuktan sonra <span className="font-semibold text-[color:var(--app-ink)]">AI Eşleşme</span>{" "}
                  ile sana uygun taraftarları görebilirsin.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AppShell>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────

function SectionTitle({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">
        Adım {step}
      </p>
      <h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-3xl">
        {title}
      </h2>
      <p className="text-sm text-[color:var(--app-ink-soft)]">{subtitle}</p>
    </div>
  );
}

function TypeCard({
  icon: Icon,
  active,
  title,
  description,
  tone,
  onClick,
}: {
  icon: typeof Banknote;
  active: boolean;
  title: string;
  description: string;
  tone: "violet" | "emerald";
  onClick: () => void;
}) {
  const toneActive =
    tone === "violet"
      ? "border-violet bg-violet/8 ring-2 ring-violet/30"
      : "border-emerald-600/40 bg-emerald-500/8 ring-2 ring-emerald-500/30";
  const toneIcon =
    tone === "violet" ? "bg-violet/12 text-violet" : "bg-emerald-500/15 text-emerald-700";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`relative flex flex-col items-start gap-3 overflow-hidden rounded-3xl border bg-white p-6 text-left transition-all ${
        active ? toneActive : "border-[color:var(--app-line)] hover:border-[color:var(--app-line)]"
      }`}
    >
      {active && (
        <span className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-violet text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneIcon}`}>
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <div>
        <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">{title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
          {description}
        </p>
      </div>
    </motion.button>
  );
}

function TemplateCard({
  icon: Icon,
  title,
  category,
  description,
  active,
  tone,
  onClick,
}: {
  icon: typeof Video;
  title: string;
  category: string;
  description: string;
  active: boolean;
  tone: "violet" | "emerald";
  onClick: () => void;
}) {
  const ring =
    tone === "violet"
      ? "border-violet bg-violet/6 ring-2 ring-violet/25"
      : "border-emerald-600/40 bg-emerald-500/6 ring-2 ring-emerald-500/25";
  const iconCls =
    tone === "violet" ? "bg-violet/12 text-violet" : "bg-emerald-500/15 text-emerald-700";
  const chipCls = tone === "violet" ? "chip chip-violet" : "chip chip-emerald";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`relative flex items-start gap-4 overflow-hidden rounded-3xl border bg-white p-5 text-left transition-all ${
        active ? ring : "border-[color:var(--app-line)]"
      }`}
    >
      {active && (
        <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-violet text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconCls}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={chipCls}>{category}</span>
        </div>
        <p className="mt-1.5 font-display text-sm font-bold leading-snug text-[color:var(--app-ink)]">
          {title}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
          {description}
        </p>
      </div>
    </motion.button>
  );
}

function FieldBlock({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: typeof Coins;
  label: string;
  tone: "violet" | "emerald" | "coral";
  children: React.ReactNode;
}) {
  const cls =
    tone === "violet"
      ? "bg-violet/12 text-violet"
      : tone === "emerald"
        ? "bg-emerald-500/15 text-emerald-700"
        : "bg-coral/12 text-coral";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${cls}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink)]">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Geri
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        className="btn-primary-light inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold"
      >
        {nextLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function PreviewCard({
  me,
  type,
  template,
  amount,
  deadlineDays,
  availability,
  urgent,
}: {
  me: { name: string; sport: string; city: string; img: string };
  type: "money" | "talent";
  template: MoneyTemplate | TalentTemplate;
  amount: number;
  deadlineDays: number;
  availability: "local" | "online" | null;
  urgent: boolean;
}) {
  return (
    <motion.div
      layout
      className="soft-card-strong relative overflow-hidden rounded-[1.5rem] p-5"
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${
          type === "money" ? "bg-violet/15" : "bg-emerald-500/15"
        }`}
      />

      <div className="relative flex flex-col gap-4">
        {/* athlete identity */}
        <div className="flex items-center gap-3">
          <img
            src={me.img}
            alt=""
            className="h-10 w-10 rounded-xl object-cover object-top"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{me.name}</p>
            <p className="text-[11px] text-[color:var(--app-ink-mute)]">
              {me.sport} · {me.city}
            </p>
          </div>
          {urgent && (
            <span className="chip chip-coral">
              <Flame className="h-3 w-3" /> Acil
            </span>
          )}
        </div>

        {/* chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ${type === "money" ? "chip-violet" : "chip-emerald"}`}>
            {type === "money" ? (
              <>
                <Coins className="h-3 w-3" /> Para
              </>
            ) : (
              <>
                <Wrench className="h-3 w-3" /> Yetenek
              </>
            )}
          </span>
          <span className="chip">{template.category}</span>
        </div>

        {/* title + description */}
        <div>
          <p className="font-display text-base font-bold leading-snug text-[color:var(--app-ink)]">
            {template.title}
          </p>
          <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
            {template.description}
          </p>
        </div>

        {/* metric */}
        {type === "money" ? (
          <div className="rounded-2xl bg-violet/8 p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-2xl font-bold text-violet">
                ₺{amount.toLocaleString("tr-TR")}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                hedef
              </p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
              <div className="h-full w-[6%] rounded-full bg-violet" />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Son {deadlineDays} gün
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-500/8 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Aranan
            </p>
            <p className="mt-1 font-display text-base font-bold text-[color:var(--app-ink)]">
              {(template as TalentTemplate).talent}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-emerald-700">
              {availability === "local" ? (
                <>
                  <MapPin className="h-3 w-3" /> Yerel · {me.city}
                </>
              ) : availability === "online" ? (
                <>
                  <Globe className="h-3 w-3" /> Online
                </>
              ) : (
                <span className="text-[color:var(--app-ink-mute)]">
                  Çalışma şekli seçilmedi
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[color:var(--app-line-soft)] pt-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700">
            <Sparkles className="h-3 w-3" /> AI Eşleşme hazır
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--app-ink)] text-white">
            <ShieldCheck className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
