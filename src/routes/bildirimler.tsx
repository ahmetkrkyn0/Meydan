import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  BellOff,
  Calendar,
  Heart,
  Mic,
  Radio,
  Sparkles,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { notifications, type Notification } from "@/lib/mock-data";

export const Route = createFileRoute("/bildirimler")({
  component: BildirimlerPage,
  head: () => ({ meta: [{ title: "Bildirimler — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

type TabKey = "all" | "support" | "event" | "brand" | "match" | "diary";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "support", label: "Destek" },
  { key: "event", label: "Etkinlik" },
  { key: "brand", label: "Teklif" },
  { key: "match", label: "Maç" },
  { key: "diary", label: "Günlük" },
];

type Bucket = "Bu hafta" | "Bu ay" | "Daha önce";

const BUCKET_MAP: Record<string, Bucket> = {
  "12 dk": "Bu hafta",
  "1 sa": "Bu hafta",
  "3 sa": "Bu hafta",
  Dün: "Bu hafta",
  "2 gün": "Bu hafta",
};

function bucketFor(time: string): Bucket {
  return BUCKET_MAP[time] ?? "Bu ay";
}

function typeMeta(t: Notification["type"]) {
  switch (t) {
    case "support":
      return { icon: Heart, chip: "chip-coral", iconBg: "bg-coral/12", iconColor: "text-coral", label: "Destek" };
    case "event":
      return { icon: Calendar, chip: "chip-sky", iconBg: "bg-sky/12", iconColor: "text-sky", label: "Etkinlik" };
    case "brand":
      return { icon: Sparkles, chip: "chip-violet", iconBg: "bg-violet/12", iconColor: "text-violet", label: "Teklif" };
    case "match":
      return { icon: Radio, chip: "chip-violet", iconBg: "bg-violet/12", iconColor: "text-violet", label: "Maç" };
    case "diary":
      return { icon: Mic, chip: "chip-sky", iconBg: "bg-sky/12", iconColor: "text-sky", label: "Günlük" };
    case "match-talent":
      return { icon: Wrench, chip: "chip-emerald", iconBg: "bg-emerald-500/12", iconColor: "text-emerald-600", label: "Yetenek" };
  }
}

function matchesTab(n: Notification, tab: TabKey): boolean {
  if (tab === "all") return true;
  if (tab === "brand") return n.type === "brand" || n.type === "match-talent";
  return n.type === tab;
}

function BildirimlerPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [allRead, setAllRead] = useState(false);

  const filtered = useMemo(() => notifications.filter((n) => matchesTab(n, tab)), [tab]);

  const grouped = useMemo(() => {
    const map = new Map<Bucket, Notification[]>();
    for (const n of filtered) {
      const b = bucketFor(n.time);
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(n);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const unreadCount = useMemo(
    () => (allRead ? 0 : notifications.filter((n) => !n.read).length),
    [allRead],
  );

  return (
    <AppShell role="fan">
      <div className="mx-auto w-full max-w-3xl">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-6 flex items-end justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Meydan'dan haber</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
              Bildirimler
            </h1>
            <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
              Sahaya, sporcuya ve şehre dair son hareketler.
            </p>
          </div>
          <button
            onClick={() => setAllRead(true)}
            className="text-xs font-semibold text-violet hover:underline"
          >
            Tümünü okundu işaretle
          </button>
        </motion.header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-5 flex flex-wrap items-center gap-2"
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-[color:var(--app-ink)] text-white"
                    : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
          <span className="ml-auto chip chip-violet">{unreadCount} okunmamış</span>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="soft-card flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--app-line-soft)] text-[color:var(--app-ink-mute)]">
              <BellOff className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <p className="font-display text-lg font-semibold text-[color:var(--app-ink)]">
              Bu sekmede şimdilik sessizlik var.
            </p>
            <p className="max-w-sm text-sm text-[color:var(--app-ink-soft)]">
              Yeni hareketler olduğunda burada görürsün. Şehrindeki etkinlikleri takip etmeyi unutma.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            {grouped.map(([bucket, items]) => (
              <section key={bucket}>
                <header className="mb-3 flex items-center gap-3">
                  <h2 className="font-display text-xs uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    {bucket}
                  </h2>
                  <span className="h-px flex-1 bg-[color:var(--app-line-soft)]" />
                  <span className="text-[10px] text-[color:var(--app-ink-mute)]">{items.length}</span>
                </header>

                <ul className="space-y-2">
                  {items.map((n) => {
                    const meta = typeMeta(n.type);
                    const Icon = meta.icon;
                    const isUnread = !n.read && !allRead;
                    return (
                      <motion.li
                        key={n.id}
                        variants={fadeUp}
                        className={`flex items-start gap-3.5 rounded-2xl px-4 py-3.5 transition-colors ${
                          isUnread
                            ? "border border-[color:oklch(0.60_0.22_252/0.14)] bg-[color:oklch(0.60_0.22_252/0.05)]"
                            : "border border-[color:var(--app-line-soft)] bg-white"
                        }`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg} ${meta.iconColor}`}>
                          <Icon className="h-4 w-4" strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[color:var(--app-ink)]">{n.title}</p>
                            {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-violet" />}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
                            {n.message}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className={`chip ${meta.chip}`}>{meta.label}</span>
                            <span className="text-[10px] text-[color:var(--app-ink-mute)]">{n.time}</span>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
