import { motion } from "framer-motion";
import { IdCard, Radio, MapPin, Coins, Users, Compass } from "lucide-react";

const features = [
  {
    icon: IdCard,
    title: "Sporcu Kartı",
    desc: "Sıralama, son maç ve destekçiler tek bakışta. Her sporcunun kendi dijital kimliği.",
    accent: "sky",
  },
  {
    icon: Radio,
    title: "Canlı Maç Akışı",
    desc: "Maç anında tezahürat gönder, anında ulaşsın. Stadyum atmosferi ekranda.",
    accent: "violet",
  },
  {
    icon: MapPin,
    title: "Şehrimde Ne Var?",
    desc: "Bu hafta yakınında hangi maçlar var, gör. Konum bazlı sport radar.",
    accent: "coral",
  },
  {
    icon: Coins,
    title: "Mikro Sponsorluk",
    desc: "Aylık küçük katkıyla sürdürülebilir destek ver. Tamamen şeffaf akış.",
    accent: "sky",
  },
  {
    icon: Users,
    title: "Topluluk Fonu",
    desc: "Turnuva, ekipman ve yol için şeffaf havuzlar. Topluca güçlü.",
    accent: "violet",
  },
  {
    icon: Compass,
    title: "Keşfet Modu",
    desc: "Hiç izlemediğin bir sporla bugün tanış. Algoritma değil, serüven.",
    accent: "coral",
  },
];

const accentMap: Record<string, string> = {
  sky: "text-sky group-hover:bg-sky/15",
  violet: "text-violet group-hover:bg-violet/15",
  coral: "text-coral group-hover:bg-coral/15",
};

const glowMap: Record<string, string> = {
  sky: "oklch(0.78 0.13 235)",
  violet: "oklch(0.65 0.24 300)",
  coral: "oklch(0.7 0.21 25)",
};

export function Features() {
  return (
    <section id="ozellikler" className="relative py-28 sm:py-36">
      {/* Top gradient bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px] bg-gradient-to-b from-violet/8 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-sky">— Özellikler</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              Altı sade{" "}
              <em className="text-gradient-violet not-italic">araç.</em>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-sm text-base leading-relaxed text-muted-foreground lg:text-right"
          >
            Sporcuyla taraftarı buluşturan araçlar. Sade, hızlı, doğrudan — tribün arası fazladan hiçbir katman yok.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-7 transition-all duration-300 hover:border-foreground/15 hover:bg-foreground/[0.06]"
              style={{
                ["--glow-color" as string]: glowMap[f.accent],
              }}
            >
              {/* Hover glow corner */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `color-mix(in oklab, ${glowMap[f.accent]} 25%, transparent)` }}
              />

              {/* Icon */}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/8 transition-all duration-300 ${accentMap[f.accent]}`}
              >
                <f.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-display mt-6 text-xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>

              {/* Bottom accent line */}
              <div
                className="mt-6 h-px w-8 transition-all duration-500 group-hover:w-20"
                style={{
                  background: `linear-gradient(to right, ${glowMap[f.accent]}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom stat band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 divide-x divide-foreground/10 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02]"
        >
          {[
            { val: "240+", label: "Sporcu profili" },
            { val: "7+", label: "Olimpik branş" },
            { val: "₺840K", label: "Doğrudan destek" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-8">
              <span className="font-display text-3xl text-foreground sm:text-4xl">{s.val}</span>
              <span className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
