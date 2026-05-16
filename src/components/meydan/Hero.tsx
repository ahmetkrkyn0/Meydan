import { motion } from "framer-motion";
import { Play } from "lucide-react";
import heroImg from "@/assets/meydan-hero.png";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden"
    >
      {/* Full-bleed hero photo as the entire first screen */}
      <motion.img
        src={heroImg}
        alt="Meydan: farklı branşlardan Türk sporcular ve önderlik eden Atatürk figürü"
        initial={{ opacity: 0, scale: 1.05, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />

      {/* Bottom gradient — so headline at bottom-left is readable, Atatürk (upper area) stays clean */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[55%] bg-gradient-to-t from-background via-background/70 to-transparent" />
      {/* Subtle top gradient under navbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-24 bg-gradient-to-b from-background/60 to-transparent" />

      {/* Content lives at the bottom-left, never on top of Atatürk */}
      <div className="relative z-10 mt-auto px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/40 px-3 py-1 text-xs text-foreground/85 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
            Türkiye'nin yeni sporcu hareketi
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="font-display mt-5 max-w-3xl text-[3rem] leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            Her sporun
            <br />
            bir <span className="text-gradient-violet italic">meydanı</span> var.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-5 max-w-md text-base text-foreground/85 sm:text-lg"
          >
            Keşfet, destekle, sahaya çık.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-8 flex flex-wrap items-center gap-4"
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
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#sunar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-xs text-foreground/75"
      >
        <span className="glass flex h-9 w-6 items-start justify-center rounded-full pt-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-foreground"
          />
        </span>
        Aşağı Kaydır
      </motion.a>
    </section>
  );
}
