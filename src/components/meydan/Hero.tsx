import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroImg from "@/assets/meydan-hero.png";

const stats = [
  { value: "7+", label: "Olimpik branş" },
  { value: "240+", label: "Sporcu profili" },
  { value: "12K", label: "Aktif tribün" },
  { value: "₺840K", label: "Doğrudan destek" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden pt-24 sm:pt-28"
    >
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute left-1/2 top-24 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-violet/15 blur-[140px]" />
        <div className="absolute left-1/2 top-0 h-[260px] w-[900px] -translate-x-1/2 rounded-full bg-sky/10 blur-[120px]" />
      </div>

      {/* Hero photo — never covered by text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[1600px] px-4 sm:px-6"
      >
        <div className="relative overflow-hidden rounded-[28px] ring-1 ring-foreground/10">
          <motion.img
            src={heroImg}
            alt="Meydan: farklı branşlardan Türk sporcular ve önderlik eden Atatürk figürü"
            initial={{ scale: 1.04, filter: "blur(12px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="block h-auto w-full object-contain"
          />
          {/* Soft vignette to blend with page */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </motion.div>

      {/* Text block — clearly below the image */}
      <div className="relative z-10 px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/40 px-3 py-1 text-xs text-foreground/85 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
                Türkiye'nin yeni sporcu hareketi
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                className="font-display mt-6 text-[3rem] leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
              >
                Her sporun
                <br />
                bir{" "}
                <span className="text-gradient-violet italic">meydanı</span>{" "}
                var.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Meydan, futbol dışı sporcuları taraftarla buluşturan dijital
                sahne. Hikâyeleri görünür kıl, doğrudan destekle ve sahaya
                tekrar enerji ver.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.85 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <a
                  href="#sunar"
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo text-foreground">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                  Meydanı Keşfet
                </a>
                <a
                  href="#problem"
                  className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-foreground/40 hover:bg-foreground/5"
                >
                  Problemi gör
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            </div>

            {/* KPI rail */}
            <motion.dl
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="grid grid-cols-2 gap-3 lg:col-span-4 lg:grid-cols-2"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-2xl px-4 py-4"
                >
                  <dt className="font-display text-2xl text-foreground sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>
    </section>
  );
}
