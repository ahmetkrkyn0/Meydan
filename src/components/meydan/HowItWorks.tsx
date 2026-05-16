import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Keşfet", desc: "Şehrindeki sporcuları, maçları ve branşları gör." },
  { n: "02", title: "Bağ Kur", desc: "Sporcunun hikâyesini, yolculuğunu ve hedeflerini takip et." },
  { n: "03", title: "Destek Ol", desc: "Tezahürat gönder, mikro sponsor ol veya topluluk fonuna katkı sağla." },
];

export function HowItWorks() {
  return (
    <section id="nasil" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Yolculuk</p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-foreground sm:text-6xl">
            3 adımda <span className="italic text-gradient-gold">Meydan</span>
          </h2>
        </motion.div>

        <div className="relative mt-20">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-foreground/15 to-transparent md:block" />

          <div className="space-y-10 md:space-y-20">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative grid items-center gap-6 md:grid-cols-2 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:text-right md:pr-16" : "md:pl-16"}>
                  <p className="font-display text-sm text-gold/70">{s.n}</p>
                  <h3 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:inline-block">
                    {s.desc}
                  </p>
                </div>

                {/* Center node */}
                <div className="relative hidden items-center justify-center md:flex">
                  <div className="absolute h-16 w-16 rounded-full bg-crimson/20 blur-xl" />
                  <div className="glass-strong relative flex h-14 w-14 items-center justify-center rounded-full">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-br from-gold to-crimson" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
