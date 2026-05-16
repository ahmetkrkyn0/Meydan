import { motion } from "framer-motion";
import { ArrowRight, Play, Trophy, Users, HeartHandshake } from "lucide-react";
// Responsive AVIF/WebP variants generated at build time by vite-imagetools
import heroAvifSet from "@/assets/meydan-hero.png?w=640;960;1280;1600;1920&format=avif&as=srcset";
import heroWebpSet from "@/assets/meydan-hero.png?w=640;960;1280;1600;1920&format=webp&as=srcset";
import heroFallback from "@/assets/meydan-hero.png?w=1280&format=webp";

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
      className="relative isolate w-full"
    >
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute left-1/2 top-24 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-violet/15 blur-[140px]" />
        <div className="absolute left-1/2 top-0 h-[260px] w-[900px] -translate-x-1/2 rounded-full bg-sky/10 blur-[120px]" />
      </div>

      {/* Hero photo — full artwork visible, no crop or zoom */}
      <motion.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
      >
        <motion.picture
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="block w-full"
        >
          <source type="image/avif" srcSet={heroAvifSet} sizes="100vw" />
          <source type="image/webp" srcSet={heroWebpSet} sizes="100vw" />
          <img
            src={heroFallback}
            alt="Meydan: farklı branşlardan Türk sporcular ve önderlik eden Atatürk figürü"
            loading="eager"
            decoding="async"
            // @ts-expect-error - valid HTML attribute, React types lag
            fetchpriority="high"
            sizes="100vw"
            className="block h-auto w-full object-contain object-center"
          />
        </motion.picture>

        {/* Informational overlays — kept on the sides/bottom so Atatürk (top-center) stays fully visible */}

        {/* Stadium stage lights — perfectly synced with card reveal (delay 1.0s, duration 1.1s) */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute top-[14%] left-[3%] hidden h-[55%] w-[38%] md:block"
        >
          {/* Light rays sweeping in — matches card scale-in window */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.6, rotate: -8 }}
            animate={{ opacity: 0.55, scaleY: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "20% 0%" }}
            className="absolute inset-0 light-rays blur-2xl"
          />
          {/* Track lines drawing across — staggered within the card's reveal window */}
          <svg
            viewBox="0 0 400 220"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-[60%] w-full"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.path
                key={i}
                d={`M -20 ${120 + i * 22} Q 200 ${100 + i * 22} 420 ${130 + i * 22}`}
                fill="none"
                stroke="url(#trackGradient)"
                strokeWidth="1"
                strokeDasharray="4 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.45 - i * 0.07 }}
                transition={{
                  duration: 1.0,
                  delay: 1.0 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
            <defs>
              <linearGradient id="trackGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(139,92,246,0)" />
                <stop offset="50%" stopColor="rgba(139,92,246,0.9)" />
                <stop offset="100%" stopColor="rgba(125,211,252,0)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Soft spotlight pulse behind the card — matches glow timing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.3, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/4 top-1/3 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[80px]"
          />
        </motion.div>

        {/* Top-left mission card — premium typographic hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute top-[14%] left-[3%] max-w-[42%] hidden md:block"
        >
          <motion.div
            className="pointer-events-auto rounded-2xl border border-white/15 bg-black/45 p-8 backdrop-blur-md lg:p-10"
            initial={{ boxShadow: "0 0 0px rgba(139,92,246,0)" }}
            animate={{ boxShadow: "0 0 60px -10px rgba(139,92,246,0.18), 0 0 120px -30px rgba(139,92,246,0.08)" }}
            transition={{ duration: 1.3, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-[2.2rem] font-medium leading-[1.08] tracking-[-0.02em] text-white lg:text-[2.9rem] xl:text-[3.5rem]">
              Her sporun bir{" "}
              <span className="text-gradient-violet italic">meydanı</span> var.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 lg:text-base">
              Futbol dışı sporcuları taraftarla buluşturan dijital sahne.
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom-right value props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="pointer-events-none absolute bottom-[4%] right-[3%] max-w-[28%] hidden lg:block"
        >
          <div className="pointer-events-auto rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.28em] text-violet">Amacımız</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/85">
              <li>• Görünmeyen sporcuyu sahneye çıkarmak</li>
              <li>• Taraftarı doğrudan destekçiye dönüştürmek</li>
              <li>• Her branşa kendi meydanını kurmak</li>
            </ul>
          </div>
        </motion.div>

        {/* Mobile-only compact info bar (under image edges, still over image bottom — avoids Atatürk) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pointer-events-none absolute inset-x-3 bottom-3 md:hidden"
        >
          <div className="pointer-events-auto rounded-xl border border-white/15 bg-black/55 p-3 backdrop-blur-md">
            <p className="font-display text-sm leading-tight text-white">
              Her sporun bir <span className="text-gradient-violet italic">meydanı</span> var.
            </p>
            <p className="mt-1 text-[11px] leading-snug text-white/80">
              Futbol dışı sporcuları taraftarla buluşturan dijital sahne.
            </p>
          </div>
        </motion.div>
      </motion.figure>

      {/* Premium stat chips — directly below hero image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 mt-8 px-4 sm:mt-10 sm:px-6 lg:mt-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Trophy, label: "Futbol dışı sporlar", value: "7+ branş" },
              { icon: Users, label: "Dijital tribün", value: "12K destekçi" },
              { icon: HeartHandshake, label: "Doğrudan destek", value: "₺840K+" },
            ].map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.12 }}
                className="glass-strong flex items-center gap-4 rounded-2xl px-5 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet/30 to-indigo/20">
                  <chip.icon className="h-5 w-5 text-violet" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{chip.label}</p>
                  <p className="text-xs text-muted-foreground">{chip.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
