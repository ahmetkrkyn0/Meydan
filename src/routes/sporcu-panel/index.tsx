import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  Eye,
  Heart,
  Mail,
  Mic,
  Plus,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { brandOffers } from "@/lib/mock-data";
import { useSession } from "@/lib/session";
import { listNeeds } from "@/lib/api";
import archeryFieldImg from "@/assets/okçulukalan.png";

export const Route = createFileRoute("/sporcu-panel/")({
  component: AthletePanelHome,
  head: () => ({ meta: [{ title: "Sporcu Paneli — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function AthletePanelHome() {
  const session = useSession();
  const profile = session.profile;
  const firstName = profile?.full_name ? profile.full_name.split(" ")[0] : "Sporcu";
  const city = profile?.city || "Şehir Belirtilmedi";
  
  const { data: needsData } = useQuery({
    queryKey: ["needs", profile?.id],
    queryFn: () => listNeeds(profile?.id),
    enabled: !!profile?.id,
  });
  const myNeeds = needsData?.needs || [];
  
  const offers = brandOffers.slice(0, 2);

  const stats = [
    {
      label: "Profil görüntülenmesi",
      value: "4.2K",
      delta: "+18% bu hafta",
      icon: Eye,
      tone: "violet",
    },
    {
      label: "Takipçi",
      value: "12.4K",
      delta: "+124 bu hafta",
      icon: Users,
      tone: "indigo",
    },
    {
      label: "Aktif destekçi",
      value: "89",
      delta: "8 yeni",
      icon: Heart,
      tone: "coral",
    },
    {
      label: "Bekleyen marka teklifi",
      value: offers.length.toString(),
      delta: "1 yeni bugün",
      icon: Mail,
      tone: "sky",
    },
  ];

  const matchRecaps = [
    {
      id: "m1",
      title: "Avrupa Şampiyonası — Yarı Final",
      city: "Budapeşte",
      date: "12 May",
      score: "6-2",
      cheers: 1240,
    },
    {
      id: "m2",
      title: "Dünya Kupası 2. Tur",
      city: "Antalya",
      date: "06 May",
      score: "7-3",
      cheers: 870,
    },
  ];

  return (
    <AppShell role="athlete" userName={profile?.full_name || "Sporcu"} userCity={city}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-12"
      >
        <motion.header
          variants={fadeUp}
          className="relative isolate overflow-hidden rounded-[32px] bg-white border border-slate-200/60 shadow-sm"
        >
          {/* Subtle background gradient instead of harsh image slice */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-sky/5 pointer-events-none" />
          
          <div className="relative flex flex-col gap-4 px-8 py-16 sm:px-12 sm:py-20">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Sporcu Paneli · {city}
              </p>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Hoş geldin <span className="text-violet">{firstName}</span>.
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-slate-600">
              Bugün <strong className="text-slate-900 font-semibold">312 yeni mesajın</strong> var. <strong className="text-slate-900 font-semibold">{offers.length} yeni marka teklifi</strong> bekliyor — biri uzun süreli kampanya olabilir.
            </p>
          </div>
        </motion.header>

        <motion.section
          variants={fadeUp}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {stats.map((s) => {
            const toneClasses: Record<string, string> = {
              violet: "bg-violet/10 text-violet",
              indigo: "bg-indigo/10 text-indigo",
              coral: "bg-coral/10 text-coral",
              sky: "bg-sky/10 text-sky",
            };
            return (
            <div key={s.label} className="flex flex-col gap-1 rounded-2xl bg-white border border-slate-200/60 p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="mb-2 flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[s.tone] || "bg-slate-100 text-slate-500"}`}>
                  <s.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  {s.label}
                </p>
              </div>
              <p className="font-display text-3xl font-bold tracking-tight text-slate-900">
                {s.value}
              </p>
              <p className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                {s.delta}
              </p>
            </div>
            );
          })}
        </motion.section>

        {/* ─── NEEDS (İhtiyaç Kartların) ─── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet/10 text-violet">
                <Wrench className="h-4 w-4" strokeWidth={2} />
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
                İhtiyaç Kartların
              </h2>
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                {myNeeds.length} Aktif
              </span>
            </div>
            <Link
              to="/sporcu-panel/ihtiyaclar"
              className="group flex items-center gap-1 text-[13px] font-semibold text-violet transition-colors hover:text-indigo-600"
            >
              Tümünü gör <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myNeeds.slice(0, 3).map((n) => {
              const pct = n.target_amount && n.collected_amount
                ? Math.round((n.collected_amount / n.target_amount) * 100)
                : 0;
              return (
                <div key={n.id} className="group relative flex flex-col gap-3 rounded-[24px] bg-white border border-slate-200/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet/30 hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex rounded-lg bg-violet/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet">
                      {n.category}
                    </span>
                    {n.is_urgent && (
                      <span className="flex h-2 w-2 rounded-full bg-coral shadow-[0_0_8px_rgba(244,63,94,0.6)]" title="Acil" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900">
                    {n.title}
                  </p>
                  <div className="mt-auto pt-2">
                    {n.need_type === "money" && n.target_amount ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                          <span>{pct}% tamamlandı</span>
                          <span>{n.deadline}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet to-indigo-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <Users className="h-3.5 w-3.5 text-indigo-400" /> Yetenek desteği · {n.deadline}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {myNeeds.length < 3 && (
              <Link
                to="/sporcu-panel/ihtiyac-olustur"
                className="group flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition-all hover:border-violet/40 hover:bg-violet/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-violet group-hover:text-white">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[14px] font-bold text-slate-700 group-hover:text-violet">Yeni İhtiyaç Ekle</p>
                  <p className="text-[11px] text-slate-500">Topluluğa sesini duyur</p>
                </div>
              </Link>
            )}
          </div>
        </motion.section>

        {/* ─── BENTO GRID: Teklifler & Taraftar Sesi ─── */}
        <motion.section variants={fadeUp} className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          
          {/* Sol: Marka Teklifleri */}
          <div className="flex flex-col gap-4 rounded-[32px] bg-white border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Bell className="h-4 w-4" strokeWidth={2} />
                </span>
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
                  Marka Teklifleri
                </h2>
              </div>
              <Link to="/sporcu-panel/teklifler" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {brandOffers.slice(0, 3).map((o) => (
                <div key={o.id} className="group relative flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-sky-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-xs font-bold text-white shadow-sm">
                        {o.brandName.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{o.brandName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">{o.brandSector}</span>
                      </div>
                    </div>
                    <span className="inline-flex rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                      % {o.fitScore} Uyum
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between pl-12">
                    <span className="font-display text-lg font-bold text-slate-900">₺{o.amount.toLocaleString("tr-TR")}</span>
                    <span className="text-[11px] font-medium text-slate-500">{o.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: Taraftar Sesi & Son Maçlar */}
          <div className="flex flex-col rounded-[32px] bg-white border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Mic className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  Taraftarın Sesi
                </h2>
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-[36px] sm:text-[42px] font-bold leading-tight tracking-tight text-slate-900">
                  Sahnede <span className="text-violet-600 italic">yalnız değilsin</span>.
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-500">
                  Bu haftaki mesajlarda <span className="font-bold text-slate-900">sabır</span>, <span className="font-bold text-slate-900">aile</span> ve <span className="font-bold text-slate-900">Türkiye</span> kelimeleri öne çıktı. 24 kişi sana özel bir not bıraktı.
                </p>
              </div>

              {/* Son Maçların Kartı */}
              <div className="mt-2 flex flex-col rounded-[24px] bg-slate-50 border border-slate-100 p-5 sm:p-6">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Son Maçların</p>
                <ul className="flex flex-col gap-3">
                  {matchRecaps.map((m) => (
                    <li key={m.id}>
                      <Link
                        to="/tezahurat/$matchId/ozet"
                        params={{ matchId: m.id }}
                        className="group flex items-center justify-between rounded-[20px] bg-white border border-slate-100 px-5 py-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <span className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl bg-violet-100 px-2.5 text-[14px] font-bold text-violet-700">
                            {m.score}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[15px] font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{m.title}</span>
                            <span className="text-[13px] text-slate-500">{m.date} · {m.city}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <span className="text-[15px] font-bold tracking-wide">{m.cheers.toLocaleString("tr-TR")}</span>
                          <Heart className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </motion.section>
      </motion.div>
    </AppShell>
  );
}
