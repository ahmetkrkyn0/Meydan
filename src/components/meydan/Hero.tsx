import { motion } from "framer-motion";
import { ArrowRight, Play, Trophy, Users, HeartHandshake } from "lucide-react";
import heroAvifSet from "@/assets/meydan-hero.png?w=640;960;1280;1600;1920&format=avif&as=srcset";
import heroWebpSet from "@/assets/meydan-hero.png?w=640;960;1280;1600;1920&format=webp&as=srcset";
import heroFallback from "@/assets/meydan-hero.png?w=1280&format=webp";

const stats = [
  { icon: Trophy,        label: "Olimpik branş",   value: "7+"    },
  { icon: Users,         label: "Aktif tribün",     value: "12K"   },
  { icon: HeartHandshake,label: "Doğrudan destek",  value: "₺840K" },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-screen w-full overflow-hidden">
      <motion.picture
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-20 h-full w-full"
      >
        <source type="image/avif" srcSet={heroAvifSet} sizes="100vw" />
        <source type="image/webp" srcSet={heroWebpSet} sizes="100vw" />
        <img
          src={heroFallback}
          alt="Meydan: farklı branşlardan Türk sporcular ve önderlik eden Atatürk figürü"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
      </motion.picture>

      {/* Gradients — fade seamlessly into --background (deep navy) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[oklch(0.14_0.04_258)] via-[oklch(0.14_0.04_258/0.75)] to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[oklch(0.14_0.04_258/0.65)] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[oklch(0.11_0.035_258/0.50)] to-transparent" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1" />
        <div className="px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-8 lg:grid-cols-12">

              <div className="lg:col-span-7 xl:col-span-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
                  Türkiye'nin yeni sporcu hareketi
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display mt-5 text-[2.8rem] leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5rem]"
                >
                  Her sporun
                  <br />
                  bir{" "}
                  <span className="text-gradient-violet italic">meydanı</span>{" "}
                  var.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.75 }}
                  className="mt-5 max-w-md text-base leading-relaxed text-white/72 sm:text-lg"
                >
                  Meydan, futbol dışı sporcuları taraftarla buluşturan dijital
                  sahne. Hikâyeleri görünür kıl, doğrudan destekle.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  <a
                    href="#sunar"
                    className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6 text-sm font-semibold text-[oklch(0.22_0.055_240)] transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </span>
                    Meydanı Keşfet
                  </a>
                  <a
                    href="#problem"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
                  >
                    Problemi gör
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-wrap gap-3 lg:col-span-5 xl:col-span-6 lg:justify-end"
              >
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.05 + i * 0.1 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 backdrop-blur-md"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet/45 to-indigo/25">
                      <s.icon className="h-4 w-4 text-white" />
                    </span>
                    <div>
                      <p className="font-display text-lg leading-none text-white">{s.value}</p>
                      <p className="mt-0.5 text-[11px] text-white/58">{s.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
