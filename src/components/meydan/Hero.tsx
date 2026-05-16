import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroAtaturk from "@/assets/hero-ataturk.jpg";
import { HeroMockup } from "./HeroMockup";

const chips = ["Futbol dışı sporlar", "Dijital tribün", "Doğrudan destek"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background layers */}
      <div className="absolute inset-0 -z-30 bg-cinematic" />
      <div
        className="absolute inset-0 -z-20 opacity-[0.22] mix-blend-screen"
        style={{
          backgroundImage: `url(${heroAtaturk})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-[80%] stadium-beams opacity-40" />
      <div className="absolute inset-0 -z-10 grid-lines opacity-30" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson" />
              Türkiye'nin sporcu hareketi · Beta
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display mt-6 text-5xl leading-[1.02] text-foreground sm:text-6xl lg:text-[5.25rem]"
            >
              Futbolun gölgesinde kalan{" "}
              <span className="text-gradient-gold italic">kahramanlar</span>
              <br className="hidden sm:block" /> artık Meydan'da.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl"
            >
              Türkiye'nin görünmeyen sporcularını keşfet, destekle ve yeni sporlarla tanış.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-5 flex items-center gap-3 text-sm font-medium tracking-wide text-foreground/70"
            >
              <span>İzle.</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>Destekle.</span>
              <span className="h-1 w-1 rounded-full bg-crimson" />
              <span className="text-foreground">Sen de Oyna.</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#cozum"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                Meydanı Keşfet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#hikaye"
                className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.04] px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.08]"
              >
                <Play className="h-4 w-4 fill-current text-crimson" />
                Sporcunu Destekle
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-10 flex flex-wrap gap-2.5"
            >
              {chips.map((c) => (
                <span
                  key={c}
                  className="glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-12 max-w-md border-l-2 border-crimson/60 pl-4 text-xs italic leading-relaxed text-muted-foreground"
            >
              "19 Mayıs ruhuyla: gençleri, sporu ve görünmeyen kahramanları
              Meydan'a çıkarıyoruz."
            </motion.p>
          </div>

          {/* Right: mockup */}
          <div className="lg:col-span-5">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
