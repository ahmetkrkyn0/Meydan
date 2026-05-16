import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    num: "01",
    title: "Sporcu görünmez",
    desc: "Olimpik branşların yıldızları kendi şehrinde bile tanınmıyor. Hikâye yok, sahne yok, tribün yok.",
    stat: "94%",
    statLabel: "medyada futbol",
  },
  {
    num: "02",
    title: "Taraftar dağınık",
    desc: "Tribün boş değil — sadece bağlanacağı bir yer arıyor. Topluluk parçalı, enerji çevresiz.",
    stat: "12M",
    statLabel: "potansiyel taraftar",
  },
  {
    num: "03",
    title: "Destek ulaşmıyor",
    desc: "İyi niyet var, kanal yok. Küçük katkıların sporcuya direkt ulaşacağı bir köprü eksik.",
    stat: "₺0",
    statLabel: "ortalama sporcu geliri",
  },
];

export function Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section id="problem" ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-dots opacity-[0.035]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-sky/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/10 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet">— Problem</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.95] text-foreground sm:text-7xl lg:text-[5.5rem]">
              Tribün boş değil.
              <br />
              Sadece{" "}
              <em className="text-gradient-violet not-italic">dağınık.</em>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xs text-sm leading-relaxed text-muted-foreground"
          >
            Türkiye'de futbol dışı her branş aynı üç duvara çarpıyor. Önce problemi net koyalım; sonra meydanı kuralım.
          </motion.p>
        </div>

        {/* Animated rule */}
        <motion.div style={{ width: lineWidth }} className="h-px bg-gradient-to-r from-violet via-sky to-transparent" />

        {/* Problem cards — editorial numbered list */}
        <div className="mt-16 space-y-0 divide-y divide-foreground/8">
          {problems.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group grid cursor-default grid-cols-12 items-center gap-4 py-10 transition-colors hover:bg-foreground/[0.02] sm:gap-8"
            >
              {/* Number */}
              <div className="col-span-2 sm:col-span-1">
                <span className="font-display text-[2rem] font-medium leading-none text-foreground/15 transition-colors duration-500 group-hover:text-violet/60 sm:text-[2.5rem]">
                  {p.num}
                </span>
              </div>

              {/* Title */}
              <div className="col-span-10 sm:col-span-4 lg:col-span-3">
                <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-white sm:text-3xl">
                  {p.title}
                </h3>
              </div>

              {/* Desc */}
              <div className="col-span-12 sm:col-span-4 lg:col-span-5">
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{p.desc}</p>
              </div>

              {/* Stat — right rail */}
              <div className="col-span-12 flex items-baseline gap-3 sm:col-span-3 lg:col-span-3 lg:justify-end">
                <span className="font-display text-4xl font-medium text-foreground/90 transition-all duration-500 group-hover:text-violet sm:text-5xl">
                  {p.stat}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
