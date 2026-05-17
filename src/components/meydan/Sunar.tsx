import { motion } from "framer-motion";
import { Compass, HandHeart, Flame } from "lucide-react";
import { FloatingAthlete } from "./FloatingAthlete";
import busenazImg from "@/assets/busenaz.png";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

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
          className="mt-20 grid gap-4 md:grid-cols-6 md:grid-rows-2 md:auto-rows-fr"
        >
          {/* Keşfet — büyük, sol-tam-yükseklik */}
          <motion.div
            variants={item}
            className="group relative isolate overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-br from-violet/12 via-violet/4 to-transparent backdrop-blur-sm transition-all duration-500 hover:border-violet/30 md:col-span-3 md:row-span-2"
          >
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-violet/20 blur-[100px] transition-all duration-700 group-hover:bg-violet/30" />
            <div className="relative flex h-full flex-col justify-between p-10 lg:p-12">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet">01 · Keşif</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-violet/40 to-transparent" />
                </div>
                <h3 className="font-display mt-8 text-6xl leading-[0.95] text-foreground sm:text-7xl lg:text-[5rem]">
                  Keşfet
                </h3>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                  Okçuluktan güreşe, satranç turnuvalarından yüzme maçlarına — radar senin için çalışıyor. Yeni branşlar, yeni yıldızlar, yeni hikâyeler.
                </p>
              </div>
              <div className="mt-12 flex items-center justify-between">
                <Compass className="h-7 w-7 text-violet" strokeWidth={1.4} />
                <span className="text-xs uppercase tracking-widest text-muted-foreground transition-transform duration-500 group-hover:translate-x-1">
                  keşfet →
                </span>
              </div>
            </div>
          </motion.div>

          {/* Destekle — sağ üst */}
          <motion.div
            variants={item}
            className="group relative isolate overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-br from-sky/12 via-sky/4 to-transparent backdrop-blur-sm transition-all duration-500 hover:border-sky/30 md:col-span-3 md:row-span-1"
          >
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-sky/20 blur-[80px] transition-all duration-700 group-hover:bg-sky/30" />
            <div className="relative flex h-full items-start gap-6 p-8 lg:p-10">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-sky/20 bg-sky/10">
                <HandHeart className="h-6 w-6 text-sky" strokeWidth={1.4} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-sky">02 · Finansman</span>
                </div>
                <h3 className="font-display mt-3 text-4xl leading-[0.95] text-foreground sm:text-5xl">
                  Destekle
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Aylık 50₺ bir sporcunun ekipman masrafını karşılar. Para nereye gittiğini hep görürsün.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sahaya Çık — sağ alt */}
          <motion.div
            variants={item}
            className="group relative isolate overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-br from-coral/10 via-coral/3 to-transparent backdrop-blur-sm transition-all duration-500 hover:border-coral/30 md:col-span-3 md:row-span-1"
          >
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-coral/20 blur-[80px] transition-all duration-700 group-hover:bg-coral/30" />
            <div className="relative flex h-full items-start gap-6 p-8 lg:p-10">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-coral/20 bg-coral/10">
                <Flame className="h-6 w-6 text-coral" strokeWidth={1.4} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-coral">03 · Katılım</span>
                </div>
                <h3 className="font-display mt-3 text-4xl leading-[0.95] text-foreground sm:text-5xl">
                  Sahaya Çık
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  İzlemekten öte: yakınındaki antrenman kamplarını bul, deneme seanslarına kaydol.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
