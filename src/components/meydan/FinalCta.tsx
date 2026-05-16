import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section id="cta" className="relative isolate overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 -z-30 bg-aurora" />
      <div className="absolute inset-x-0 top-0 -z-20 h-full light-rays opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-transparent to-background" />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-violet"
        >
          Meydan zamanı
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display mx-auto mt-6 max-w-3xl text-4xl leading-[1.02] text-foreground sm:text-6xl lg:text-7xl"
        >
          Türkiye'nin görünmeyen sporcuları için{" "}
          <span className="text-gradient-violet italic">yeni bir meydan.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-7 max-w-xl text-lg text-muted-foreground"
        >
          Spora yalnızca bakma. Onun bir parçası ol.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <a
            href="#top"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo text-foreground">
              <ArrowRight className="h-4 w-4" />
            </span>
            Hemen Keşfet
          </a>
        </motion.div>
      </div>
    </section>
  );
}
