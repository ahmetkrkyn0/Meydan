import { motion } from "framer-motion";
import { Compass, HandHeart, Flame } from "lucide-react";
import { FloatingAthlete } from "./FloatingAthlete";
import basketballImg from "@/assets/sport-basketball.png";

const pillars = [
  {
    icon: Compass,
    num: "I",
    title: "Keşfet",
    desc: "Okçuluktan güreşe, satranç turnuvalarından yüzme maçlarına — radar senin için çalışıyor. Yeni branşlar, yeni yıldızlar, yeni hikâyeler.",
    tag: "Keşif",
    accent: "oklch(0.52 0.22 252)",
    bg: "bg-[oklch(0.52_0.22_252/0.06)] hover:bg-[oklch(0.52_0.22_252/0.10)]",
    border: "border-[oklch(0.52_0.22_252/0.18)] hover:border-[oklch(0.52_0.22_252/0.32)]",
    iconBg: "bg-[oklch(0.52_0.22_252/0.12)]",
    iconText: "text-violet",
    barFrom: "from-violet",
    shadow: "hover:shadow-[0_8px_32px_-8px_oklch(0.52_0.22_252/0.22)]",
  },
  {
    icon: HandHeart,
    num: "II",
    title: "Destekle",
    desc: "Aylık 50₺ bir sporcunun ekipman masrafını karşılar. Toplu fon, doğrudan katkı — para nereye gittiğini hep görürsün.",
    tag: "Finansman",
    accent: "oklch(0.68 0.17 220)",
    bg: "bg-[oklch(0.68_0.17_220/0.06)] hover:bg-[oklch(0.68_0.17_220/0.10)]",
    border: "border-[oklch(0.68_0.17_220/0.18)] hover:border-[oklch(0.68_0.17_220/0.32)]",
    iconBg: "bg-[oklch(0.68_0.17_220/0.12)]",
    iconText: "text-sky",
    barFrom: "from-sky",
    shadow: "hover:shadow-[0_8px_32px_-8px_oklch(0.68_0.17_220/0.22)]",
  },
  {
    icon: Flame,
    num: "III",
    title: "Sahaya Çık",
    desc: "İzlemekten öte: yakınındaki antrenman kamplarını bul, deneme seanslarına kaydol, tribünden sahaya adım at.",
    tag: "Katılım",
    accent: "oklch(0.60 0.20 16)",
    bg: "bg-[oklch(0.60_0.20_16/0.05)] hover:bg-[oklch(0.60_0.20_16/0.08)]",
    border: "border-[oklch(0.60_0.20_16/0.16)] hover:border-[oklch(0.60_0.20_16/0.28)]",
    iconBg: "bg-[oklch(0.60_0.20_16/0.10)]",
    iconText: "text-coral",
    barFrom: "from-coral",
    shadow: "hover:shadow-[0_8px_32px_-8px_oklch(0.60_0.20_16/0.18)]",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Sunar() {
  return (
    <section id="sunar" className="relative isolate overflow-hidden py-28 sm:py-36">
      <FloatingAthlete src={basketballImg} alt="Basketbol sporcusu" side="left" />
      {/* Very gentle bloom */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/5 blur-[180px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:pl-80">
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
          className="mt-20 grid gap-5 md:grid-cols-3"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ${p.bg} ${p.border} ${p.shadow}`}
            >
              <div className="relative flex h-full flex-col p-8 lg:p-10">
                {/* Decorative numeral */}
                <span className="pointer-events-none absolute right-5 top-3 select-none font-display text-[5.5rem] font-bold leading-none opacity-[0.04]">
                  {p.num}
                </span>

                {/* Icon */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.iconBg} ring-1 ring-inset ring-foreground/5 transition-all duration-400 group-hover:scale-105`}>
                  <p.icon className={`h-5 w-5 ${p.iconText}`} strokeWidth={1.6} />
                </div>

                {/* Tag */}
                <span className="mt-6 inline-flex w-fit items-center rounded-full border border-foreground/10 bg-white/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.tag}
                </span>

                <h3 className="font-display mt-4 text-4xl text-foreground sm:text-5xl">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

                <div
                  className={`mt-8 h-[2px] w-10 rounded-full bg-gradient-to-r ${p.barFrom} to-transparent transition-all duration-500 group-hover:w-full`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
