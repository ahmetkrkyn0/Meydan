import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroAtaturk from "@/assets/hero-ataturk.jpg";

export function FinalCta() {
  return (
    <section id="katil" className="relative overflow-hidden py-32 sm:py-44">
      <div className="absolute inset-0 -z-30 bg-cinematic" />
      <div
        className="absolute inset-0 -z-20 opacity-[0.15] mix-blend-screen"
        style={{
          backgroundImage: `url(${heroAtaturk})`,
          backgroundPosition: "center 30%",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-full stadium-beams opacity-50" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/80 via-transparent to-background" />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-gold"
        >
          Meydan zamanı
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display mt-6 text-5xl leading-[1.02] text-foreground sm:text-7xl lg:text-[5.5rem]"
        >
          Türkiye'nin görünmeyen sporcuları için{" "}
          <span className="text-gradient-gold italic">meydan zamanı.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Her sporun taraftarı, her sporcunun hikâyesi, her gencin sahaya çıkma hakkı var.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-4 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            Meydan'a Katıl
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
