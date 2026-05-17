import { motion } from "framer-motion";
import { ArrowRight, Mail, Zap } from "lucide-react";
import { FloatingAthlete } from "./FloatingAthlete";
import tennisImg from "@/assets/sport-tennis-nobg.png";

export function FinalCta() {
  return (
    <section id="cta" className="relative isolate overflow-hidden py-32 sm:py-44">
      <FloatingAthlete src={tennisImg} alt="Tenis sporcusu" side="left" />
      {/* Light aurora background */}
      <div className="absolute inset-0 -z-30 bg-aurora" />
      <div className="absolute inset-x-0 top-0 -z-20 h-full light-rays opacity-50" />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-dots opacity-50" />

      {/* Top & bottom soft bleed */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Floating blobs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-violet/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 -z-10 h-[380px] w-[380px] rounded-full bg-sky/12 blur-[110px]" />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:pl-[30rem]">
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/22 bg-white/80 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-violet shadow-sm backdrop-blur-sm">
              <Zap className="h-3 w-3 fill-violet" />
              Meydan zamanı
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mx-auto mt-7 max-w-3xl text-5xl leading-[0.93] text-foreground sm:text-7xl lg:text-[5.5rem]"
          >
            Türkiye'nin görünmeyen sporcuları için{" "}
            <em className="text-gradient-violet not-italic">yeni bir meydan.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            Spora yalnızca bakma. Onun bir parçası ol.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-violet py-2.5 pl-2.5 pr-7 text-sm font-semibold text-white shadow-lg shadow-violet/30 transition-shadow hover:shadow-xl hover:shadow-violet/35"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="h-4 w-4" />
              </span>
              Hemen Keşfet
            </motion.a>

            <motion.a
              href="mailto:info@meydan.tr"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/8 px-6 py-3 text-sm font-medium text-foreground/75 backdrop-blur-sm transition-all hover:border-violet/40 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Bize Ulaş
            </motion.a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {["Ücretsiz katıl", "Doğrudan destek", "Şeffaf fon akışı"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-foreground/15 bg-foreground/8 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
