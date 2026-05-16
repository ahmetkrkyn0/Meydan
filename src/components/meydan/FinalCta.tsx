import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import ataturkLine from "@/assets/ataturk-line.png";

export function FinalCta() {
  return (
    <section id="cta" className="relative isolate overflow-hidden py-32 sm:py-44">
      {/* Layered background */}
      <div className="absolute inset-0 -z-30 bg-aurora" />
      <div className="absolute inset-x-0 top-0 -z-20 h-full light-rays opacity-40" />

      {/* Noise grain overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Vignette edges */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Ataturk silhouette — decorative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="pointer-events-none absolute bottom-0 right-0 hidden h-[90%] w-auto opacity-[0.07] lg:block"
        >
          <img src={ataturkLine} alt="" className="h-full w-auto object-contain object-bottom" />
        </motion.div>

        <div className="relative text-center">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-violet"
          >
            Meydan zamanı
          </motion.p>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mx-auto mt-6 max-w-3xl text-5xl leading-[0.93] text-foreground sm:text-7xl lg:text-[5.5rem]"
          >
            Türkiye'nin görünmeyen sporcuları için{" "}
            <em className="text-gradient-violet not-italic">yeni bir meydan.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            Spora yalnızca bakma. Onun bir parçası ol.
          </motion.p>

          {/* CTA group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <a
              href="#top"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-7 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] active:scale-95"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo">
                <ArrowRight className="h-4 w-4 text-white" />
              </span>
              Hemen Keşfet
            </a>
            <a
              href="mailto:info@meydan.tr"
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-all hover:border-foreground/40 hover:bg-foreground/5 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Bize Ulaş
            </a>
          </motion.div>

          {/* Trust chips */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-muted-foreground"
          >
            {["Ücretsiz katıl", "Doğrudan destek", "Şeffaf fon akışı"].map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-foreground/20" />}
                <span className="font-mono">{t}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
