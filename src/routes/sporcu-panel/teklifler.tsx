import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  Inbox,
  Mail,
  X,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { brandOffers, type BrandOffer } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu-panel/teklifler")({
  component: AthleteOffersPage,
  head: () => ({ meta: [{ title: "Marka Teklifleri — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

type Status = "new" | "accepted" | "rejected";
const TABS: { id: "all" | Status; label: string }[] = [
  { id: "all",      label: "Tümü" },
  { id: "new",      label: "Yeni" },
  { id: "accepted", label: "Kabul" },
  { id: "rejected", label: "Reddet" },
];

const extra: BrandOffer = {
  id: "of3",
  brandName: "Tofaş",
  brandSector: "Otomotiv",
  amount: 95_000,
  duration: "3 ay",
  expectedContent: "1 Reels + maç sonrası içerik",
  message: "Disiplin değeriniz markamızla örtüşüyor. Lansman süreci için sizinleyiz.",
  fitScore: 78,
  date: "06 May",
};

const BRAND_TONES: Record<string, string> = {
  Karaca:  "bg-coral/14 text-coral",
  Pegasus: "bg-violet/14 text-violet",
  Tofaş:   "bg-sky/14 text-sky",
};

function AthleteOffersPage() {
  const all: (BrandOffer & { status: Status })[] = [
    { ...brandOffers[0], status: "new" },
    { ...brandOffers[1], status: "new" },
    { ...extra, status: "accepted" },
  ];

  const [tab, setTab] = useState<"all" | Status>("all");
  const [openId, setOpenId] = useState<string>("");

  const filtered = tab === "all" ? all : all.filter((o) => o.status === tab);
  const counts: Record<"all" | Status, number> = {
    all: all.length,
    new: all.filter((o) => o.status === "new").length,
    accepted: all.filter((o) => o.status === "accepted").length,
    rejected: all.filter((o) => o.status === "rejected").length,
  };

  return (
    <AppShell role="athlete" userName="Nisan Çelik" userCity="İstanbul">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-8"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Sporcu paneli · Gelen kutusu
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)]">
            Marka Teklifleri
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            Sana gelen teklifler. AI uyum skorunu her zaman yanında görürsün.
          </p>
        </motion.header>

        <motion.nav variants={fadeUp} className="soft-card flex gap-1 rounded-2xl p-1.5">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  on
                    ? "bg-violet/12 text-violet"
                    : "text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 text-[10px] ${
                  on ? "bg-violet/20" : "bg-[color:var(--app-line)]"
                }`}>
                  {counts[t.id]}
                </span>
              </button>
            );
          })}
        </motion.nav>

        {filtered.length === 0 ? (
          <motion.div variants={fadeUp} className="soft-card flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
            <Inbox className="h-9 w-9 text-[color:var(--app-ink-mute)]" strokeWidth={1.4} />
            <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
              Bu kategoride teklif yok.
            </p>
            <p className="max-w-md text-sm text-[color:var(--app-ink-soft)]">
              Profilini güncel tut ve değer haritanı doldur; markalar seni daha kolay bulur.
            </p>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2">
            {filtered.map((o) => {
              const open = openId === o.id;
              const tone = BRAND_TONES[o.brandName] ?? "bg-violet/14 text-violet";
              return (
                <article
                  key={o.id}
                  className="soft-card flex flex-col overflow-hidden rounded-2xl"
                >
                  <div className="flex flex-col gap-4 p-5">
                    {/* Brand header */}
                    <div className="flex items-center gap-3">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${tone}`}>
                        {o.brandName.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                            {o.brandName}
                          </p>
                          {o.status === "new" && (
                            <span className="chip chip-coral">yeni</span>
                          )}
                          {o.status === "accepted" && (
                            <span className="chip chip-emerald">kabul</span>
                          )}
                          {o.status === "rejected" && (
                            <span className="chip">reddedildi</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                          {o.brandSector} · {o.date}
                        </p>
                      </div>
                    </div>

                    {/* Amount + fit score row */}
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-display text-2xl font-bold leading-none tracking-tight text-[color:var(--app-ink)]">
                          ₺ {o.amount.toLocaleString("tr-TR")}
                        </p>
                        <p className="mt-1 text-[11px] text-[color:var(--app-ink-soft)]">
                          {o.duration} kampanya
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl font-bold leading-none text-violet">
                          {o.fitScore}%
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                          uyum
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content chips footer */}
                  <div className="flex flex-wrap items-center gap-1.5 border-t border-[color:var(--app-line-soft)] px-5 py-3">
                    {o.expectedContent.split(/[+,·]/).map((c, i) => (
                      <span key={i} className="chip">{c.trim()}</span>
                    ))}
                  </div>

                  {/* Action: Görüntüle */}
                  <div className="mt-auto border-t border-[color:var(--app-line-soft)] p-3">
                    <button
                      onClick={() => setOpenId(open ? "" : o.id)}
                      className="btn-ghost-light flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      Görüntüle
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-[color:var(--app-line-soft)] p-5"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                        Marka mesajı
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                        "{o.message}"
                      </p>

                      <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row">
                        <button className="btn-ghost-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                          <X className="h-3.5 w-3.5" /> Reddet
                        </button>
                        <button className="btn-ghost-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                          <Mail className="h-3.5 w-3.5" /> Müzakere
                        </button>
                        <button className="btn-primary-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                          <Check className="h-3.5 w-3.5" /> Kabul
                        </button>
                      </div>
                    </motion.div>
                  )}
                </article>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
}
