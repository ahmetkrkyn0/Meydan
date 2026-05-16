import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import arena from "@/assets/arena-particles.jpg";

export function Story() {
  return (
    <section id="hikaye" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10">
          <img
            src={arena}
            alt="Boş tribünden parıltıya dönüşen dijital destek"
            loading="lazy"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/85 to-ink-deep/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="relative grid gap-10 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-crimson">Hikâye</p>
              <h2 className="font-display mt-5 text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
                Bir sporcu maddi sebeplerle
                <br />
                <span className="text-gradient-gold italic">bırakmak</span> zorunda kalmamalı.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="flex flex-col justify-end"
            >
              <p className="text-lg leading-relaxed text-muted-foreground">
                Destek doğru yere ulaşmadığında yetenek kaybolur. Meydan, taraftarın
                ilgisini doğrudan sporcunun yolculuğuna bağlar.
              </p>
              <a
                href="#katil"
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-crimson px-6 py-3.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
              >
                Bir sporcunun yolculuğuna ortak ol
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
