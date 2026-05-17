import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Calendar,
  Globe,
  MapPin,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu-panel/ihtiyac-olustur")({
  component: CreateNeedPage,
  head: () => ({ meta: [{ title: "Yeni İhtiyaç Kartı — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const MONEY_CATS = ["Yol", "Ekipman", "Antrenör", "Beslenme", "Kamp katkısı"];
const TALENT_CATS = ["İçerik", "Tasarım", "Tercüme", "Eğitmen", "Mentor", "Beslenme"];

function CreateNeedPage() {
  const me = athleteBySlug("mete-gazoz");
  const [type, setType] = useState<"money" | "talent">("money");
  const [category, setCategory] = useState("Yol");
  const [title, setTitle] = useState("Avrupa Şampiyonası yol masrafı");
  const [desc, setDesc] = useState(
    "Budapeşte finali için ulaşım ve konaklama gerekiyor. Antrenörümle gidiyorum."
  );
  const [amount, setAmount] = useState(14_000);
  const [deadline, setDeadline] = useState("2026-05-30");
  const [talentNeed, setTalentNeed] = useState("Video editör");
  const [availability, setAvailability] = useState<"local" | "online">("online");
  const [urgent, setUrgent] = useState(false);

  const cats = type === "money" ? MONEY_CATS : TALENT_CATS;

  return (
    <AppShell role="athlete" userName="Mete Gazoz" userCity="İstanbul">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Sporcu paneli · İhtiyaç
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)]">
            Yeni İhtiyaç Kartı
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Topluluğa neye ihtiyacın olduğunu söyle. Para ya da yetenek — Meydan dinliyor.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <motion.section variants={fadeUp} className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Ne tür bir ihtiyaç?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setType("money"); setCategory(MONEY_CATS[0]); }}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
                    type === "money"
                      ? "border-violet/40 bg-violet/8 ring-2 ring-violet/30"
                      : "border-[color:var(--app-line)] bg-white hover:border-violet/25"
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/12 text-violet">
                    <Banknote className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
                    Para
                  </p>
                  <p className="text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
                    Yol, ekipman, kamp ya da kurs için maddi destek.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => { setType("talent"); setCategory(TALENT_CATS[0]); }}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
                    type === "talent"
                      ? "border-coral/40 bg-coral/8 ring-2 ring-coral/30"
                      : "border-[color:var(--app-line)] bg-white hover:border-coral/25"
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/12 text-coral">
                    <Wrench className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
                    Yetenek
                  </p>
                  <p className="text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
                    Editör, tasarımcı, mentor, beslenme uzmanı...
                  </p>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {cats.map((c) => {
                  const on = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        on
                          ? "bg-violet/12 text-violet ring-2 ring-violet/40"
                          : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Başlık
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tek cümleyle özetle"
                className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-violet/40 focus:ring-2 focus:ring-violet/15"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Açıklama
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Bu desteğe niye ihtiyacın var? Detay ver."
                className="resize-none rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3 text-sm leading-relaxed text-[color:var(--app-ink)] outline-none transition-all focus:border-violet/40 focus:ring-2 focus:ring-violet/15"
              />
            </div>

            {type === "money" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                    Hedef tutar
                  </label>
                  <div className="flex items-baseline gap-2 rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5">
                    <span className="text-sm text-[color:var(--app-ink-mute)]">₺</span>
                    <input
                      type="number"
                      value={amount}
                      step={1_000}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-transparent font-display text-lg font-bold text-[color:var(--app-ink)] outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                    Son tarih
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5">
                    <Calendar className="h-4 w-4 text-[color:var(--app-ink-mute)]" strokeWidth={1.7} />
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-transparent text-sm text-[color:var(--app-ink)] outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                    Aranan yetenek
                  </label>
                  <input
                    value={talentNeed}
                    onChange={(e) => setTalentNeed(e.target.value)}
                    placeholder="Örn. Video editör"
                    className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-coral/40 focus:ring-2 focus:ring-coral/15"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                    Şehir uygunluğu
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAvailability("local")}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        availability === "local"
                          ? "bg-coral/12 text-coral ring-2 ring-coral/40"
                          : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)]"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" /> Yerel
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvailability("online")}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        availability === "online"
                          ? "bg-coral/12 text-coral ring-2 ring-coral/40"
                          : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)]"
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5" /> Online
                    </button>
                  </div>
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="h-4 w-4 accent-coral"
              />
              <span className="flex flex-1 items-center gap-2 text-sm text-[color:var(--app-ink)]">
                <AlertTriangle className="h-4 w-4 text-coral" strokeWidth={1.9} />
                Aciliyet — kart taraftar akışında üste çıkar
              </span>
            </label>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/sporcu-panel"
                className="btn-ghost-light inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                Vazgeç
              </Link>
              <button className="btn-primary-light inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold">
                Yayınla <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.section>

          <motion.aside variants={fadeUp}>
            <div className="soft-card-strong sticky top-24 flex flex-col gap-3 rounded-3xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Topluluk böyle görecek
              </p>

              <div className="rounded-2xl border border-[color:var(--app-line)] p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={me.img}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover object-top"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                      {me.name}
                    </p>
                    <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                      {me.sport} · {me.city}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className={`chip ${type === "money" ? "chip-violet" : "chip-coral"}`}>
                    {type === "money" ? "Para" : "Yetenek"}
                  </span>
                  <span className="chip">{category}</span>
                  {urgent && <span className="chip chip-coral">acil</span>}
                </div>

                <p className="mt-3 line-clamp-2 font-display text-base font-bold leading-snug text-[color:var(--app-ink)]">
                  {title || "Başlık bekleniyor"}
                </p>
                <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                  {desc || "Açıklama henüz yazılmadı."}
                </p>

                {type === "money" ? (
                  <div className="mt-3">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">
                        ₺ {amount.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                        hedef
                      </p>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-[color:var(--app-line-soft)]">
                      <div className="h-full w-[8%] rounded-full bg-violet" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl bg-[color:var(--app-line-soft)] p-3">
                    <p className="text-[11px] text-[color:var(--app-ink-mute)]">Aranan</p>
                    <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
                      {talentNeed}
                    </p>
                    <p className="mt-1 text-[10px] text-[color:var(--app-ink-mute)]">
                      {availability === "local" ? "Yerel · İstanbul" : "Online uygun"}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-center text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Canlı önizleme
              </p>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AppShell>
  );
}
