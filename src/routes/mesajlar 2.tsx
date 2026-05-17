import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Paperclip, Search, Send, Smile, Phone, Video, MoreHorizontal } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import okculukImg from "@/assets/athlete-okculuk-kadin.png";
import tenisImg from "@/assets/athlete-tenis-kadin.png";
import bilardoImg from "@/assets/athlete-bilardo-erkek.png";
import boksImg from "@/assets/athlete-boks-kadin.png";
import atletizmImg from "@/assets/athlete-atletizm-erkek.png";

export const Route = createFileRoute("/mesajlar 2")({
  component: MesajlarPage,
  head: () => ({ meta: [{ title: "Mesajlar — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

type Bubble = {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: "online" | "offline";
  statusLabel: string;
  accent: "violet" | "sky" | "coral";
  messages: Bubble[];
};

const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Nisan Çelik",
    subtitle: "Okçuluk · İstanbul",
    avatar: okculukImg,
    lastMessage: "Budapeşte yolu için sesli not bırakacağım.",
    lastTime: "şimdi",
    unread: 2,
    status: "online",
    statusLabel: "Çevrimiçi",
    accent: "violet",
    messages: [
      { id: "m1", from: "other", text: "Merhaba, dünkü desteğin için teşekkürler.", time: "10:14" },
      { id: "m2", from: "me", text: "Rica ederim. Finalden önce sakin günler diliyorum.", time: "10:16" },
      { id: "m3", from: "other", text: "Antrenman çok sessiz geçti bu sabah, odak güzeldi.", time: "10:18" },
      { id: "m4", from: "me", text: "Sesli not bırakırsan dinlerim, merak ediyorum.", time: "10:20" },
      { id: "m5", from: "other", text: "Budapeşte yolu için sesli not bırakacağım.", time: "10:22" },
    ],
  },
  {
    id: "c2",
    name: "Defne Arslan",
    subtitle: "Tenis · Ankara",
    avatar: tenisImg,
    lastMessage: "Grip değişimi hafta sonu gelirse harika olur.",
    lastTime: "12 dk",
    unread: 1,
    status: "online",
    statusLabel: "Çevrimiçi",
    accent: "sky",
    messages: [
      { id: "m1", from: "other", text: "Roland Garros eleme öncesi malzeme yenileniyor.", time: "09:40" },
      { id: "m2", from: "me", text: "Hangi grip kullanıyorsun şu an?", time: "09:42" },
      { id: "m3", from: "other", text: "Yumuşak, ama toprakta kayıyor. Yenisine geçiyoruz.", time: "09:45" },
      { id: "m4", from: "other", text: "Grip değişimi hafta sonu gelirse harika olur.", time: "09:46" },
    ],
  },
  {
    id: "c3",
    name: "Karaca",
    subtitle: "Marka · Ev & Yaşam",
    avatar: boksImg,
    lastMessage: "Reels çekim takvimini paylaşır mısın?",
    lastTime: "1 sa",
    unread: 0,
    status: "offline",
    statusLabel: "5 dk önce",
    accent: "coral",
    messages: [
      { id: "m1", from: "other", text: "Merhaba, aile temalı kampanya için görüşmek isteriz.", time: "Dün" },
      { id: "m2", from: "me", text: "Memnuniyetle. Bütçe ve süre detayını paylaşabilir misiniz?", time: "Dün" },
      { id: "m3", from: "other", text: "3 ay, 2 Reels + 1 Story serisi düşünüyoruz.", time: "Dün" },
      { id: "m4", from: "other", text: "Reels çekim takvimini paylaşır mısın?", time: "08:55" },
    ],
  },
  {
    id: "c4",
    name: "Tayfun Keskin",
    subtitle: "Bilardo · İzmir",
    avatar: bilardoImg,
    lastMessage: "Antalya yolu için planı yarın yazıyorum.",
    lastTime: "3 sa",
    unread: 0,
    status: "offline",
    statusLabel: "2 saat önce",
    accent: "coral",
    messages: [
      { id: "m1", from: "other", text: "Salonda 5 saatti bugün. Üç bant açıları oturdu.", time: "Dün" },
      { id: "m2", from: "me", text: "Antalya hazırlığı nasıl gidiyor?", time: "Dün" },
      { id: "m3", from: "other", text: "Antalya yolu için planı yarın yazıyorum.", time: "Dün" },
    ],
  },
  {
    id: "c5",
    name: "Dr. Elif Aksoy",
    subtitle: "Yetenek eşleşmesi · Beslenme",
    avatar: atletizmImg,
    lastMessage: "Alp ile ilk görüşme için cuma uygun mu?",
    lastTime: "Dün",
    unread: 0,
    status: "offline",
    statusLabel: "Dün",
    accent: "violet",
    messages: [
      { id: "m1", from: "other", text: "Eşleşme için detayları gönderdiğin için teşekkürler.", time: "Pzt" },
      { id: "m2", from: "me", text: "Alp 3 ay haftalık takip istiyor, müsait misiniz?", time: "Pzt" },
      { id: "m3", from: "other", text: "Eskişehir'de olduğum için sahaya da gelebilirim.", time: "Sal" },
      { id: "m4", from: "other", text: "Alp ile ilk görüşme için cuma uygun mu?", time: "Sal" },
    ],
  },
];

function accentRing(a: "violet" | "sky" | "coral") {
  if (a === "sky") return "ring-sky/30";
  if (a === "coral") return "ring-coral/30";
  return "ring-violet/30";
}

function MesajlarPage() {
  const [activeId, setActiveId] = useState<string>(conversations[0].id);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [activeId],
  );

  return (
    <AppShell role="fan" hideSearch>
      <div className="mx-auto w-full max-w-6xl">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-5 flex items-end justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Mesajlar</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
              Sohbetler
            </h1>
            <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
              Sporcular, markalar ve yetenek eşleşmelerin tek yerde.
            </p>
          </div>
          <span className="chip chip-violet">{conversations.reduce((n, c) => n + c.unread, 0)} okunmamış</span>
        </motion.header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="soft-card-strong grid h-[640px] grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)]"
        >
          <aside className="flex flex-col border-r border-[color:var(--app-line)]">
            <div className="border-b border-[color:var(--app-line-soft)] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)]" strokeWidth={1.7} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sohbet ara"
                  className="w-full rounded-xl border border-[color:var(--app-line)] bg-white py-2 pl-9 pr-3 text-sm text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/15"
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto py-2">
              {filteredList.map((c) => {
                const isActive = c.id === active.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive
                          ? "bg-[color:oklch(0.60_0.22_252/0.08)]"
                          : "hover:bg-[color:var(--app-line-soft)]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={c.avatar}
                          alt=""
                          className={`h-11 w-11 rounded-2xl object-cover object-top ring-2 ${accentRing(c.accent)}`}
                        />
                        {c.status === "online" && (
                          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">{c.name}</p>
                          <span className="shrink-0 text-[10px] text-[color:var(--app-ink-mute)]">{c.lastTime}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate text-xs ${c.unread > 0 ? "font-medium text-[color:var(--app-ink-soft)]" : "text-[color:var(--app-ink-mute)]"}`}>
                            {c.lastMessage}
                          </p>
                          {c.unread > 0 && (
                            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-bold text-white">
                              {c.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="flex min-w-0 flex-col">
            <header className="flex items-center justify-between gap-3 border-b border-[color:var(--app-line-soft)] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <img src={active.avatar} alt="" className="h-10 w-10 rounded-2xl object-cover object-top" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">{active.name}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-[color:var(--app-ink-soft)]">
                    {active.status === "online" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                    {active.statusLabel} · {active.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)]">
                  <Phone className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)]">
                  <Video className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)]">
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              <div className="flex justify-center">
                <span className="chip">Bugün</span>
              </div>
              {active.messages.map((m, i) => {
                const mine = m.from === "me";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={
                        mine
                          ? "max-w-[78%] rounded-2xl rounded-br-md bg-[color:oklch(0.60_0.22_252/0.14)] px-4 py-2.5 text-sm text-[color:oklch(0.30_0.18_258)]"
                          : "max-w-[78%] rounded-2xl rounded-bl-md border border-[color:var(--app-line)] bg-white px-4 py-2.5 text-sm text-[color:var(--app-ink)]"
                      }
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <p className={`mt-1 text-[10px] ${mine ? "text-[color:oklch(0.45_0.18_258)]" : "text-[color:var(--app-ink-mute)]"}`}>
                        {m.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <footer className="border-t border-[color:var(--app-line-soft)] px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDraft("");
                }}
                className="flex items-center gap-2 rounded-2xl border border-[color:var(--app-line)] bg-white px-2 py-1.5"
              >
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--app-ink-mute)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]">
                  <Paperclip className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--app-ink-mute)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]">
                  <Smile className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`${active.name}'a mesaj yaz…`}
                  className="flex-1 bg-transparent px-2 py-2 text-sm text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="btn-primary-light flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={2} />
                  Gönder
                </button>
              </form>
            </footer>
          </section>
        </motion.div>
      </div>
    </AppShell>
  );
}
