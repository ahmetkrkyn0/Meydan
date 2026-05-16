import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
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

        {/* Top-left mission card — premium typographic hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="pointer-events-none absolute top-[14%] left-[3%] max-w-[38%] hidden md:block"
        >
          <div className="pointer-events-auto rounded-2xl border border-white/15 bg-black/45 p-7 backdrop-blur-md lg:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-violet">
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-violet align-middle" />
              Manifesto
            </p>
            <h2 className="font-display mt-5 text-[1.95rem] font-medium leading-[1.08] tracking-[-0.02em] text-white lg:text-[2.5rem] xl:text-[3rem]">
              Her sporun bir{" "}
              <span className="text-gradient-violet italic">meydanı</span> var.
            </h2>
            <div className="mt-6 h-px w-10 bg-gradient-to-r from-white/60 to-transparent" />
            <p className="mt-6 max-w-md text-[14px] leading-[1.72] text-white/75 lg:text-[15px]">
              Meydan; futbol dışı sporcuları taraftarla buluşturan dijital sahnedir.
              Hikâyeleri görünür kıl, doğrudan destekle, sahaya enerji ver.
            </p>
            <a
              href="#sunar"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold tracking-tight text-black transition-transform hover:scale-[1.03]"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Meydanı Keşfet
            </a>
          </div>
        </motion.div>

        {/* Bottom-right value props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="pointer-events-none absolute bottom-[4%] right-[3%] max-w-[28%] hidden lg:block"
        >
          <div className="pointer-events-auto rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.28em] text-violet">Amacımız</p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-white/85">
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
