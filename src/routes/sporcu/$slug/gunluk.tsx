import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  Hand,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug, diaryEntries, type DiaryEntry } from "@/lib/mock-data";
import { listJournals, listProfiles } from "@/lib/api";
import {
  backendJournalsToDiary,
  findAthleteBySlug,
  findProfileBySlug,
} from "@/lib/api-mappers";

export const Route = createFileRoute("/sporcu/$slug/gunluk")({
  component: AthleteDiaryPage,
  head: ({ params }) => ({
    meta: [{ title: `${athleteBySlug(params.slug).name} — Günlük | Meydan` }],
  }),
});

type Filter = "all" | "audio" | "text";

const PLACEHOLDERS: Omit<DiaryEntry, "athleteSlug">[] = [
  {
    id: "p1",
    date: "12 May",
    mood: "💪",
    audio: false,
    content:
      "Antrenmandan sonra 20 dakika sessiz oturdum. Bazen kafayı boşaltmak da işin parçası. Yarın tekrar.",
  },
  {
    id: "p2",
    date: "08 May",
    mood: "🙏",
    audio: true,
    content:
      "Sabah 6'da salona girdim, ışıklar yanmıyordu. Sessizliği seviyorum — kalabalığa hazırlanmak böyle başlar.",
  },
];

function timeSince(d: string): string {
  const recent = ["şimdi", "1 sa önce", "3 sa önce", "dün"];
  return recent[Math.abs(d.charCodeAt(0)) % recent.length];
}

function AthleteDiaryPage() {
  const { slug } = Route.useParams();
  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });
  const profile = useMemo(
    () => findProfileBySlug(slug, profilesQuery.data?.profiles),
    [profilesQuery.data?.profiles, slug],
  );
  const a = useMemo(
    () => findAthleteBySlug(slug, profilesQuery.data?.profiles),
    [profilesQuery.data?.profiles, slug],
  );
  const journalsQuery = useQuery({
    queryKey: ["journals", profile?.id],
    queryFn: () => listJournals(profile!.id),
    enabled: Boolean(profile?.id),
    retry: 1,
  });
  const [filter, setFilter] = useState<Filter>("all");
  const [playing, setPlaying] = useState<string | null>(null);

  const hasBackendJournals = Boolean(journalsQuery.data);
  let entries: DiaryEntry[] = hasBackendJournals
    ? backendJournalsToDiary(journalsQuery.data?.journals).map((entry) => ({
        ...entry,
        athleteSlug: slug,
      }))
    : diaryEntries.filter((d) => d.athleteSlug === slug);
  const isPlaceholder = !hasBackendJournals && entries.length === 0;
  if (isPlaceholder) {
    entries = PLACEHOLDERS.map((p) => ({ ...p, athleteSlug: slug }));
  }

  const filtered = entries.filter((e) =>
    filter === "all" ? true : filter === "audio" ? e.audio : !e.audio,
  );

  const counts = {
    all: entries.length,
    audio: entries.filter((e) => e.audio).length,
    text: entries.filter((e) => !e.audio).length,
  };

  return (
    <AppShell role="fan">
      <div className="mx-auto max-w-2xl pb-24">
        <Link
          to="/sporcu/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-2 text-xs font-medium text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{a.name} kartına dön</span>
        </Link>

        {/* Heading */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 space-y-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">
            Günlük
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            {a.name} — günlük
          </h1>
          <p className="text-base text-[color:var(--app-ink-soft)]">
            Sahadan, içtenlikle.
          </p>
        </motion.header>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-8 flex items-center gap-1.5"
        >
          {([
            ["all", "Hepsi"],
            ["audio", "Sesli"],
            ["text", "Yazılı"],
          ] as const).map(([key, label]) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-[color:var(--app-ink)] text-white"
                    : "text-[color:var(--app-ink-soft)] hover:bg-white"
                }`}
              >
                {label}
                <span
                  className={`text-[10px] tabular-nums ${
                    active ? "text-white/70" : "text-[color:var(--app-ink-mute)]"
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Empty hint */}
        {isPlaceholder && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-md text-xs text-[color:var(--app-ink-mute)]"
          >
            Henüz paylaşılmış bir günlük yok. Aşağıdaki örnekler {a.name.split(" ")[0]}'ın
            antrenman temposundan derlendi.
          </motion.p>
        )}

        {/* Feed */}
        <div className="mt-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((e, i) => {
              const liked = 80 + ((e.id.charCodeAt(0) * 7) % 400);
              const replies = 4 + ((e.id.charCodeAt(0) * 3) % 24);
              return (
                <motion.article
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="soft-card-strong rounded-3xl p-5 sm:p-6"
                >
                  {/* head */}
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.img}
                        alt={a.name}
                        className="h-10 w-10 rounded-2xl object-cover object-top"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--app-ink)]">
                          {a.name}
                        </p>
                        <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                          {e.date} · {timeSince(e.date)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xl leading-none">{e.mood}</span>
                  </header>

                  {/* content */}
                  <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--app-ink)]">
                    {e.content}
                  </p>

                  {/* audio */}
                  {e.audio && (
                    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-violet/8 px-3 py-3">
                      <button
                        onClick={() => setPlaying(playing === e.id ? null : e.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-violet text-white transition-transform hover:scale-105 active:scale-95"
                      >
                        {playing === e.id ? (
                          <Pause className="h-3.5 w-3.5" fill="currentColor" />
                        ) : (
                          <Play className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" />
                        )}
                      </button>
                      <div className="flex flex-1 items-center gap-1">
                        {Array.from({ length: 28 }).map((_, k) => (
                          <span
                            key={k}
                            className={`w-[3px] rounded-full transition-colors ${
                              playing === e.id && k < 14 ? "bg-violet" : "bg-violet/30"
                            }`}
                            style={{ height: `${4 + Math.abs(Math.sin(k * 1.7)) * 16}px` }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium tabular-nums text-[color:var(--app-ink-soft)]">
                        0:48
                      </span>
                    </div>
                  )}

                  {/* reactions */}
                  <footer className="mt-5 flex items-center justify-between border-t border-[color:var(--app-line-soft)] pt-3">
                    <div className="flex items-center gap-1">
                      <button className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-[color:var(--app-ink-soft)] transition-colors hover:bg-coral/10 hover:text-coral">
                        <Heart className="h-3.5 w-3.5" strokeWidth={1.8} /> {liked}
                      </button>
                      <button className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-[color:var(--app-ink-soft)] transition-colors hover:bg-violet/10 hover:text-violet">
                        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} /> {replies}
                      </button>
                      <button className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-[color:var(--app-ink-soft)] transition-colors hover:bg-sky/10 hover:text-sky">
                        <Hand className="h-3.5 w-3.5" strokeWidth={1.8} /> Seninleyim
                      </button>
                    </div>
                    <button
                      aria-label="Paylaş"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--app-ink-mute)] transition-colors hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                    >
                      <Share2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  </footer>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-[color:var(--app-ink-mute)]">
              Bu filtre için kayıt yok.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
