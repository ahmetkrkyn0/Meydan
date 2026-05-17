import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listNeeds, listProfiles } from "@/lib/api";
import { backendNeedsToNeedsWithProfiles } from "@/lib/api-mappers";

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
];

const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Eskişehir", "İzmit", "Adana"];
const AVAILABILITY = ["Hafta içi akşam", "Hafta sonu", "Esnek"];

function TalentPage() {
  const [picked, setPicked] = useState<Set<string>>(new Set(["Dil dersi"]));
  const [city, setCity] = useState<string>("İstanbul");
  const [avail, setAvail] = useState<string>("Hafta sonu");
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
      if (next.has(t)) next.delete(t); else next.add(t);
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

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <motion.header variants={fade} initial="hidden" animate="show" custom={0} className="flex flex-col gap-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-700">
            Yetenek Bağışı · Yardımlaşma
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
            Para değil, <span className="italic text-emerald-700">beceri</span> bağışla.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--app-ink-soft)]">
            Türkiye'de sporcunun ihtiyacı her zaman para değil. Bazen{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">bir terzi</span>, bazen{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">bir şoför</span>, bazen{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">bir İngilizce öğretmeni</span>.
          </p>
        </motion.header>

        <motion.section variants={fade} initial="hidden" animate="show" custom={1}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { n: "01", t: "Yeteneğini söyle",   d: "Hangi konuda destek olabilirsin?" },
              { n: "02", t: "AI eşler",            d: "Sana uygun sporcu ve ihtiyaç bulunur." },
              { n: "03", t: "İletişime geç",       d: "Doğrudan konuş, yardımı başlat." },
            ].map((s, i) => (
              <div key={s.n} className="relative flex flex-col gap-2 rounded-3xl bg-white/70 px-5 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700">Adım {s.n}</p>
                <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">{s.t}</p>
                <p className="text-xs text-[color:var(--app-ink-soft)]">{s.d}</p>
                {i < 2 && (
                  <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)] sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fade} initial="hidden" animate="show" custom={2} className="soft-card-strong rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-emerald-700" />
            <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">Ne yapabilirsin?</h2>
          </div>
          <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
            Birden fazla seçebilirsin. Anonim kalmak istersen isim paylaşılmaz.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
                Yetenek türü
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TALENTS.map((t) => {
                  const active = picked.has(t);
                  return (
                    <button
                      key={t}
                      onClick={() => togglePick(t)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "border-emerald-600/40 bg-emerald-500/12 text-emerald-700 ring-2 ring-emerald-500/20"
                          : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-emerald-600/30 hover:text-[color:var(--app-ink)]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">Şehir</p>
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[color:var(--app-line)] bg-white px-3 py-2.5">
                  <MapPin className="h-4 w-4 text-[color:var(--app-ink-mute)]" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[color:var(--app-ink)] focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
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
          </div>
        </motion.section>

        <motion.section variants={fade} initial="hidden" animate="show" custom={3}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Şu an aktif ihtiyaçlar
            </h2>
            <span className="text-xs text-[color:var(--app-ink-soft)]">
              {talentNeeds.length} açık çağrı
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {talentNeeds.map((n) => (
              <article key={n.id} className="soft-card flex flex-col gap-3 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <img src={n.athleteImg} alt="" className="h-12 w-12 rounded-xl object-cover object-top" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{n.athleteName}</p>
                    <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">{n.city}</p>
                  </div>
                  {n.urgent && (
                    <span className="chip chip-coral">Acil</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-[color:var(--app-ink)]">{n.title}</p>
                <p className="text-xs text-[color:var(--app-ink-soft)]">{n.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="chip chip-emerald">{n.talentNeeded}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--app-ink-mute)]">
                    <Calendar className="h-3 w-3" /> {n.deadline}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fade} initial="hidden" animate="show" custom={4} className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-500/8 via-violet/8 to-transparent px-6 py-10 text-center">
          <Sparkles className="h-5 w-5 text-emerald-700" />
          <p className="max-w-md text-sm text-[color:var(--app-ink-soft)]">
            Hazır mısın? AI seçimlerine bakarak en yakın 3 sporcuyu bulur.
          </p>
          <Link
            to="/yetenek/eslesme"
            className="btn-primary-light inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
          >
            Eşleşme bul
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-[10px] text-[color:var(--app-ink-mute)]">
            Seçtiğin: {[...picked].slice(0, 3).join(" · ") || "—"}{picked.size > 3 ? ` +${picked.size - 3}` : ""} · {city} · {avail}
          </p>
        </motion.section>
      </div>
    </AppShell>
  );
}
