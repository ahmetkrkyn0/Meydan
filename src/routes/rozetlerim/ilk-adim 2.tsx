import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { events } from "@/lib/mock-data";

export const Route = createFileRoute("/rozetlerim/ilk-adim 2")({
  component: IlkAdimPage,
  head: () => ({ meta: [{ title: "İlk Adım Rozeti — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

type Task = {
  id: string;
  label: string;
  done: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: "t1", label: "Eskrim hakkında 1 dakika video izle", done: true },
  { id: "t2", label: "Bir eskrim sporcusunu takip et", done: true },
  { id: "t3", label: "Yakındaki bir etkinliğe katılacağını işaretle", done: false },
  { id: "t4", label: "İlk eskrim maçını izle", done: false },
  { id: "t5", label: "İlk yorumunu yap", done: false },
];

function IlkAdimPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const eskrimEvent = useMemo(
    () => events.find((e) => e.sport === "Eskrim") ?? events[0],
    [],
  );

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          <Link
            to="/rozetlerim"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Rozetlerim
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Bu haftanın rozeti</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
            İlk Adım Rozeti
          </h1>
          <p className="text-sm text-[color:var(--app-ink-soft)]">
            Hiç denemediğin bir spor seninle tanışıyor.
          </p>
        </motion.header>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="soft-card-strong relative overflow-hidden rounded-3xl p-7"
        >
          <div className="pointer-events-none absolute -right-12 -top-16 h-60 w-60 rounded-full bg-violet/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-sky/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet/15 to-sky/10 ring-1 ring-violet/25">
              <span className="text-6xl">🤺</span>
            </div>

            <div className="min-w-0 flex-1">
              <span className="chip chip-violet">Bu hafta</span>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
                Eskrim
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                Bilek refleksi, zarafet ve sessiz bir kararlılık. Bir hamlede kazanan ya da kaybeden bir spor —
                Türkiye'de yalnızca 9 aktif sporcusu var, sahnesi büyümeyi bekliyor.
              </p>

              <div className="mt-5 inline-flex w-full max-w-md items-center gap-3 rounded-2xl border border-[color:var(--app-line-soft)] bg-white/70 p-3 sm:w-auto">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky/12 text-sky">
                  <Calendar className="h-4 w-4" strokeWidth={1.9} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    Yakındaki etkinlik
                  </p>
                  <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                    {eskrimEvent.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[color:var(--app-ink-soft)]">
                    <MapPin className="h-3 w-3" strokeWidth={1.8} />
                    {eskrimEvent.city} · {eskrimEvent.day} {eskrimEvent.month} · {eskrimEvent.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          <header className="flex items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-[color:var(--app-ink)]">
                Görev listesi
              </h3>
              <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
                5 küçük adımda eskrime ilk dokunuşunu yap.
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-[color:var(--app-ink)]">
                {doneCount}<span className="text-base text-[color:var(--app-ink-mute)]">/{totalCount}</span>
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">tamamlandı</p>
            </div>
          </header>

          <div className="h-2 overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
            />
          </div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="show"
            className="soft-card-strong divide-y divide-[color:var(--app-line-soft)] overflow-hidden rounded-3xl"
          >
            {tasks.map((t) => (
              <motion.li key={t.id} variants={fadeUp}>
                <button
                  onClick={() => toggle(t.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[color:var(--app-line-soft)]"
                >
                  {t.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-violet" strokeWidth={2} />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-[color:var(--app-ink-mute)]" strokeWidth={1.8} />
                  )}
                  <span
                    className={`text-sm ${
                      t.done
                        ? "text-[color:var(--app-ink-mute)] line-through"
                        : "font-medium text-[color:var(--app-ink)]"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center gap-2.5 rounded-2xl border border-[color:var(--app-line-soft)] bg-white/60 px-4 py-3 text-sm text-[color:var(--app-ink-soft)]"
        >
          <Clock className="h-4 w-4 shrink-0 text-[color:var(--app-ink-mute)]" strokeWidth={1.8} />
          Bir sonraki sporu görmek için bekle:{" "}
          <span className="font-semibold text-[color:var(--app-ink)]">3 gün</span>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <button className="btn-primary-light flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold sm:text-base">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Bu sporu denemek istiyorum
          </button>
        </motion.div>
      </div>
    </AppShell>
  );
}
