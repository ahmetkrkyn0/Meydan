import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroImg from "@/assets/meydan-hero.png";

export function Hero() {
  return (
    <section id="top" className="relative isolate w-full overflow-hidden">
      {/* Hero artwork — full, uncropped */}
      <motion.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
      >
        <motion.img
          src={heroImg}
          alt="Meydan: farklı branşlardan Türk sporcular ve önderlik eden Atatürk figürü"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="block h-auto w-full object-contain object-center"
        />

        {/* Soft readability gradient — only over the upper-left sky area */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 22% 32%, color-mix(in oklab, var(--ink) 55%, transparent) 0%, color-mix(in oklab, var(--ink) 20%, transparent) 40%, transparent 70%)",
          }}
        />

        {/* Text overlay — upper-left sky area */}
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto h-full max-w-7xl px-6 sm:px-10">
            <div className="flex h-full items-start pt-[14vw] sm:pt-[12vw] lg:pt-[9vw]">
              <div className="pointer-events-auto max-w-[44%] min-w-[280px]">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/30 px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-foreground/85 backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
                  İzle · Destekle · Sahaya Çık
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.55 }}
                  className="font-display mt-5 text-[clamp(2rem,4.6vw,5rem)] leading-[0.95] tracking-tight text-foreground"
                  style={{ textShadow: "0 2px 30px rgba(10, 8, 30, 0.55)" }}
                >
                  Her sporun
                  <br />
                  bir <span className="text-gradient-violet italic">meydanı</span> var.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.75 }}
                  className="mt-5 max-w-md text-[clamp(0.95rem,1.15vw,1.125rem)] leading-relaxed text-foreground/85"
                  style={{ textShadow: "0 1px 18px rgba(10, 8, 30, 0.5)" }}
                >
                  Türkiye'nin görünmeyen sporcularını keşfet, destekle ve sahaya çık.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.95 }}
                  className="mt-7 flex flex-wrap items-center gap-3"
                >
                  <a
                    href="#sunar"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo text-foreground">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                    Meydanı Keşfet
                  </a>
                  <a
                    href="#ozellikler"
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-background/20 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:border-foreground/50 hover:bg-foreground/10"
                  >
                    Sporcuları İncele
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.figure>
    </section>
  );
}
