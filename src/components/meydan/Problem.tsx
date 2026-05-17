import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FloatingAthlete } from "./FloatingAthlete";
import meteGazozImg from "@/assets/metegazoz.png";

const problems = [
  {
    num: "01",
    title: "Sporcu görünmez",
    desc: "Olimpik branşların yıldızları kendi şehrinde bile tanınmıyor. Hikâye yok, sahne yok, tribün yok.",
    stat: "%87",
    statLabel: "spor medyası futbol",
    color: "oklch(0.52 0.22 252)",
  },
  {
    num: "02",
    title: "Taraftar dağınık",
    desc: "Tribün boş değil — sadece bağlanacağı bir yer arıyor. Topluluk parçalı, enerji çevresiz.",
    stat: "7M",
    statLabel: "lisanslı sporcu",
    color: "oklch(0.68 0.17 220)",
  },
  {
    num: "03",
    title: "Destek ulaşmıyor",
    desc: "İyi niyet var, kanal yok. Küçük katkıların sporcuya direkt ulaşacağı bir köprü eksik.",
    stat: "₺0",
    statLabel: "bireysel sporcu maaşı",
    color: "oklch(0.60 0.20 16)",
  },
];

export function Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section id="problem" ref={ref} className="relative isolate overflow-hidden py-28 sm:py-36">
      <FloatingAthlete
        src={meteGazozImg}
        alt="Mete Gazoz"
        side="right"
        mirror
        scale={1.25}
        offsetX={-40}
      />
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-dots" />
      {/* Subtle color blooms */}
      <div className="pointer-events-none absolute -left-48 -top-48 -z-10 h-[500px] w-[500px] rounded-full bg-violet/8 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 -z-10 h-[400px] w-[400px] rounded-full bg-sky/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:pr-[30rem]">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/8 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-violet/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-violet">
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              Problem
            </span>
            <h2 className="font-display mt-5 text-5xl leading-[0.95] text-foreground sm:text-7xl lg:text-[5.5rem]">
              Tribün boş değil.
              <br />
              Sadece{" "}
              <em className="text-gradient-violet not-italic">dağınık.</em>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xs text-sm leading-relaxed text-muted-foreground"
          >
            Türkiye'de futbol dışı her branş aynı üç duvara çarpıyor. Önce problemi net koyalım; sonra meydanı kuralım.
          </motion.p>
        </div>

        {/* Animated sweep line */}
        <motion.div
          style={{ width: lineWidth }}
          className="h-[2px] rounded-full bg-gradient-to-r from-violet via-sky to-transparent"
        />

        {/* Rows */}
        <div className="mt-2 divide-y divide-foreground/6">
          {problems.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              className="group grid cursor-default grid-cols-12 items-center gap-4 rounded-2xl px-4 py-10 transition-colors hover:bg-foreground/[0.03] sm:gap-8"
            >
              <div className="col-span-2 sm:col-span-1">
                <span className="font-display text-3xl font-bold leading-none text-foreground/12 transition-colors duration-400 group-hover:text-foreground/25">
                  {p.num}
                </span>
              </div>

              <div className="col-span-10 sm:col-span-4 lg:col-span-3">
                <h3 className="font-display text-2xl text-foreground sm:text-3xl">
                  {p.title}
                </h3>
              </div>

              <div className="col-span-12 sm:col-span-4 lg:col-span-5">
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{p.desc}</p>
              </div>

              <div className="col-span-12 flex items-baseline gap-2 sm:col-span-3 lg:col-span-3 lg:justify-end">
                <motion.span
                  className="font-display text-4xl font-bold sm:text-5xl"
                  style={{ color: p.color }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  {p.stat}
                </motion.span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
