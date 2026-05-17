import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, MapPin, Send } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug } from "@/lib/mock-data";

export const Route = createFileRoute("/marka-panel/teklif/$slug")({
  component: BrandOfferPage,
  head: ({ params }) => ({
    meta: [{ title: `Teklif — ${athleteBySlug(params.slug).name} — Meydan` }],
  }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const DURATIONS = ["1 ay", "3 ay", "6 ay", "1 yıl"];
const CONTENTS = [
  "Reels", "Story", "IG Post", "TikTok",
  "Maç sonrası içerik", "Lansman etkinliği",
];

function formatTL(n: number) {
  return `₺ ${n.toLocaleString("tr-TR")}`;
}

function BrandOfferPage() {
  const { slug } = Route.useParams();
  const a = athleteBySlug(slug);

  const [amount, setAmount] = useState(75_000);
  const [duration, setDuration] = useState("3 ay");
  const [contents, setContents] = useState<string[]>(["Reels", "Story"]);
  const [message, setMessage] = useState(
    "Aile değerlerine yakın bir kampanya planlıyoruz. Türk evinin sıcaklığını sporcu sahnesiyle birleştirmek istiyoruz."
  );

  const toggleContent = (v: string) =>
    contents.includes(v)
      ? setContents(contents.filter((c) => c !== v))
      : setContents([...contents, v]);

  return (
    <AppShell role="brand" userName="Karaca" userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Marka paneli · Teklif
          </p>
          <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
            Teklif Gönder — <span className="italic text-sky">{a.name}</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            Sporcuya gönderilecek teklif sözleşmesinin taslağıdır. Gönderildikten sonra
            müzakereye açık kalır.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <motion.section variants={fadeUp} className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Teklif tutarı
              </label>
              <div className="flex items-baseline gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-5 py-4">
                <span className="font-display text-2xl font-bold text-[color:var(--app-ink-mute)]">₺</span>
                <input
                  type="number"
                  value={amount}
                  step={5_000}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-transparent font-display text-4xl font-bold tracking-tight text-[color:var(--app-ink)] outline-none"
                />
                <span className="text-xs text-[color:var(--app-ink-mute)]">TL</span>
              </div>
              <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                Sektör ortalaması: ₺ 60K – ₺ 110K
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Kampanya süresi
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => {
                  const on = duration === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        on
                          ? "bg-sky/14 text-sky ring-2 ring-sky/40"
                          : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Beklenen içerik
              </label>
              <div className="flex flex-wrap gap-2">
                {CONTENTS.map((c) => {
                  const on = contents.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleContent(c)}
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
                Marka mesajı
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3 text-sm leading-relaxed text-[color:var(--app-ink)] outline-none transition-all focus:border-sky/40 focus:ring-2 focus:ring-sky/15"
              />
              <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                Sporcuya nasıl yaklaştığın çok önemli. Samimi yaz.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
              <button className="btn-ghost-light rounded-2xl px-5 py-3 text-sm font-semibold">
                Taslak olarak sakla
              </button>
              <button className="btn-primary-light inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold">
                Önizle ve Gönder <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.section>

          <motion.aside variants={fadeUp} className="flex flex-col gap-4">
            <div className="soft-card-strong sticky top-24 flex flex-col gap-4 rounded-3xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Sporcuya nasıl görünecek
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-[color:var(--app-line-soft)] p-3">
                <img
                  src={a.img}
                  alt={a.name}
                  className="h-12 w-12 rounded-xl object-cover object-top"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                    {a.name}
                  </p>
                  <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                    {a.sport} · <MapPin className="inline h-2.5 w-2.5" /> {a.city}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-sky/25 bg-sky/8 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky text-white font-display text-sm font-bold">
                    K
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[color:var(--app-ink)]">Karaca</p>
                    <p className="text-[10px] text-[color:var(--app-ink-mute)]">Ev & Yaşam</p>
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-[color:var(--app-ink)]">
                  {formatTL(amount)}
                </p>
                <p className="text-[11px] text-[color:var(--app-ink-soft)]">{duration} kampanya</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {contents.length > 0 ? contents.map((c) => (
                    <span key={c} className="chip chip-sky">{c}</span>
                  )) : (
                    <span className="text-[11px] italic text-[color:var(--app-ink-mute)]">
                      İçerik seçilmedi
                    </span>
                  )}
                </div>

                <div className="mt-3 rounded-xl bg-white/70 p-3">
                  <p className="line-clamp-4 text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                    {message || "Mesaj yazılmadı."}
                  </p>
                </div>
              </div>

              <Link
                to="/marka-panel/eslesme"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-sky"
              >
                Eşleşmeye dön <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AppShell>
  );
}
