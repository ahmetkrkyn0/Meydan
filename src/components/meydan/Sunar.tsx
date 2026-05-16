import { motion } from "framer-motion";
import { Compass, HandHeart, Flame } from "lucide-react";

const pillars = [
  {
    icon: Compass,
    num: "I",
    title: "Keşfet",
    desc: "Okçuluktan güreşe, satranç turnuvalarından yüzme maçlarına — radar senin için çalışıyor. Yeni branşlar, yeni yıldızlar, yeni hikâyeler.",
    accent: "from-sky/20 via-indigo/10 to-transparent",
    border: "border-sky/20",
    glow: "group-hover:shadow-[0_0_60px_-10px_oklch(0.78_0.13_235/0.35)]",
    tag: "Keşif",
  },
  {
    icon: HandHeart,
    num: "II",
    title: "Destekle",
    desc: "Aylık 50₺ bir sporcunun ekipman masrafını karşılar. Toplu fon, doğrudan katkı — para nereye gittiğini hep görürsün.",
    accent: "from-violet/25 via-indigo/10 to-transparent",
    border: "border-violet/20",
    glow: "group-hover:shadow-[0_0_60px_-10px_oklch(0.65_0.24_300/0.4)]",
    tag: "Finansman",
  },
  {
    icon: Flame,
    num: "III",
    title: "Sahaya Çık",
    desc: "İzlemekten öte: yakınındaki antrenman kamplarını bul, deneme seanslarına kaydol, tribünden sahaya adım at.",
    accent: "from-coral/15 via-violet/10 to-transparent",
    border: "border-coral/20",
    glow: "group-hover:shadow-[0_0_60px_-10px_oklch(0.7_0.21_25/0.3)]",
    tag: "Katılım",
  },
];

export function Sunar() {
  return (
    <section id="sunar" className="relative overflow-hidden py-28 sm:py-36">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/8 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex items-center gap-5"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet">Platform</p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
        </motion.div>

        {/* Big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-display mx-auto max-w-4xl text-center text-5xl leading-[0.95] text-foreground sm:text-7xl lg:text-[5.5rem]"
        >
          Meydan ne{" "}
          <em className="text-gradient-violet not-italic">sunar?</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-lg text-center text-base leading-relaxed text-muted-foreground"
        >
          Üç adım. Sporcuyu görünür kılan, taraftarı sahaya bağlayan, herkesi harekete davet eden bir akış.
        </motion.p>

        {/* Cards */}
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.14 }}
              className={`group relative overflow-hidden rounded-3xl border ${p.border} bg-gradient-to-br ${p.accent} transition-all duration-500 ${p.glow}`}
            >
              {/* Inner glass */}
              <div className="glass-strong relative flex h-full flex-col rounded-3xl p-8 lg:p-10">
                {/* Roman numeral — decorative background */}
                <span className="pointer-events-none absolute right-6 top-4 font-display text-[5rem] font-semibold leading-none text-foreground/5 select-none">
                  {p.num}
                </span>

                {/* Icon */}
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 backdrop-blur transition-all duration-500 group-hover:bg-foreground/15">
                  <p.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                </div>

                {/* Tag pill */}
                <span className="mt-6 inline-flex w-fit items-center rounded-full border border-foreground/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.tag}
                </span>

                {/* Title */}
                <h3 className="font-display mt-4 text-4xl text-foreground sm:text-5xl">{p.title}</h3>

                {/* Desc */}
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

                {/* Animated bottom bar */}
                <div className="mt-8 h-px w-10 bg-gradient-to-r from-foreground/40 to-transparent transition-all duration-500 group-hover:w-full group-hover:from-violet group-hover:via-sky group-hover:to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
