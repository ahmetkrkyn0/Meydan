import { motion } from "framer-motion";
import { Compass, HandHeart, Flame, ArrowUpRight } from "lucide-react";
import { FloatingAthlete } from "./FloatingAthlete";
import busenazImg from "@/assets/busenaz.png";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const pillars = [
  {
    num: "01",
    kicker: "Keşif",
    title: "Keşfet",
    icon: Compass,
    hue: "violet",
    desc: "Okçuluktan güreşe, satrançtan yüzmeye — radar senin için çalışıyor. Yeni branşlar, yeni yıldızlar, yeni hikâyeler.",
    stats: [
      { value: "32", label: "branş" },
      { value: "320+", label: "sporcu" },
    ],
    rows: [
      "Sporcu kartları & canlı sıralamalar",
      "Şehrinde bu hafta hangi maç var",
      "Algoritma değil, serüven",
    ],
    cta: "Sporcuları gör",
  },
  {
    num: "02",
    kicker: "Finansman",
    title: "Destekle",
    icon: HandHeart,
    hue: "sky",
    desc: "Aylık 50₺ bir sporcunun ekipman masrafını karşılar. Paranın nereye gittiğini hep görürsün.",
    stats: [
      { value: "50₺", label: "aylık" },
      { value: "%100", label: "şeffaf" },
    ],
    rows: [
      "Tek sporcu veya topluluk havuzu",
      "Ekipman, yol, turnuva harcaması",
      "Aylık etki raporu doğrudan sana",
    ],
    cta: "Destek ol",
  },
  {
    num: "03",
    kicker: "Katılım",
    title: "Sahaya Çık",
    icon: Flame,
    hue: "coral",
    desc: "İzlemekten öte: yakınındaki antrenman kamplarını bul, deneme seanslarına kaydol, kulübe gel.",
    stats: [
      { value: "85+", label: "kulüp" },
      { value: "14 / 81", label: "il" },
    ],
    rows: [
      "Açık antrenman & deneme dersleri",
      "Yaş ve seviyeye göre filtreleme",
      "Tek tıkla kayıt, hatırlatma SMS",
    ],
    cta: "Yakınımdakini bul",
  },
] as const;

const hueClass = {
  violet: {
    border: "hover:border-violet/40",
    bg: "from-violet/12 via-violet/4 to-transparent",
    glow: "bg-violet/20 group-hover:bg-violet/30",
    text: "text-violet",
    chipBorder: "border-violet/20",
    chipBg: "bg-violet/10",
    line: "from-violet/40",
    statBorder: "border-violet/15",
  },
  sky: {
    border: "hover:border-sky/40",
    bg: "from-sky/12 via-sky/4 to-transparent",
    glow: "bg-sky/20 group-hover:bg-sky/30",
    text: "text-sky",
    chipBorder: "border-sky/20",
    chipBg: "bg-sky/10",
    line: "from-sky/40",
    statBorder: "border-sky/15",
  },
  coral: {
    border: "hover:border-coral/40",
    bg: "from-coral/10 via-coral/3 to-transparent",
    glow: "bg-coral/20 group-hover:bg-coral/30",
    text: "text-coral",
    chipBorder: "border-coral/20",
    chipBg: "bg-coral/10",
    line: "from-coral/40",
    statBorder: "border-coral/15",
  },
} as const;

export function Sunar() {
  return (
    <section id="sunar" className="relative isolate overflow-hidden py-28 sm:py-36">
      <FloatingAthlete
        src={busenazImg}
        alt="Busenaz"
        side="left"
        mirror
        scale={2.5}
        offsetY={180}
      />
      {/* Very gentle bloom */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/5 blur-[180px]" />

      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:pl-[22rem] lg:pr-10 xl:pl-[26rem]">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/12 to-transparent" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-violet/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            Platform
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/12 to-transparent" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mx-auto max-w-4xl text-center text-5xl leading-[0.95] text-foreground sm:text-7xl lg:text-[5.5rem]"
        >
          Meydan ne{" "}
          <em className="text-gradient-violet not-italic">sunar?</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mx-auto mt-5 max-w-lg text-center text-base leading-relaxed text-muted-foreground"
        >
          Üç adım. Sporcuyu görünür kılan, taraftarı sahaya bağlayan, herkesi harekete davet eden bir akış.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-20 grid gap-5 md:grid-cols-3 md:gap-6"
        >
          {pillars.map((p) => {
            const c = hueClass[p.hue];
            const Icon = p.icon;
            return (
              <motion.div
                key={p.num}
                variants={item}
                className={`group relative isolate flex flex-col overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-br ${c.bg} backdrop-blur-sm transition-all duration-500 ${c.border}`}
              >
                <div className={`absolute -top-32 -right-32 h-72 w-72 rounded-full ${c.glow} blur-[110px] transition-all duration-700`} />

                <div className="relative flex h-full flex-col p-7 lg:p-8">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${c.text}`}>
                      {p.num} · {p.kicker}
                    </span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${c.chipBorder} ${c.chipBg}`}>
                      <Icon className={`h-5 w-5 ${c.text}`} strokeWidth={1.4} />
                    </div>
                  </div>

                  <div className={`mt-6 h-px w-full bg-gradient-to-r ${c.line} to-transparent`} />

                  {/* Title */}
                  <h3 className="font-display mt-7 text-[2.75rem] leading-[0.95] text-foreground lg:text-5xl xl:text-[3.25rem]">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>

                  {/* Mini stats */}
                  <div className="mt-7 grid grid-cols-2 gap-2.5">
                    {p.stats.map((s) => (
                      <div
                        key={s.label}
                        className={`rounded-xl border ${c.statBorder} bg-foreground/[0.02] px-3 py-2.5`}
                      >
                        <div className={`font-display text-xl leading-none ${c.text}`}>
                          {s.value}
                        </div>
                        <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rows / mini list */}
                  <ul className="mt-7 space-y-2.5">
                    {p.rows.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2.5 text-sm text-foreground/75"
                      >
                        <span className={`mt-[7px] h-1 w-1 flex-none rounded-full ${c.text} bg-current`} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto pt-9">
                    <div className="flex items-center justify-between border-t border-foreground/8 pt-5">
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground transition-transform duration-500 group-hover:translate-x-0.5">
                        {p.cta}
                      </span>
                      <ArrowUpRight
                        className={`h-4 w-4 ${c.text} transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
                        strokeWidth={1.6}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
