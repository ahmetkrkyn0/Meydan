import { motion } from "framer-motion";
import { IdCard, Radio, MapPin, Coins, Users, Compass } from "lucide-react";
import { FloatingAthlete } from "./FloatingAthlete";
import cemKaanImg from "@/assets/cem-kaan-gokerkan.png";

const features = [
  { icon: IdCard,  title: "Sporcu Kartı",     desc: "Sıralama, son maç ve destekçiler tek bakışta. Her sporcunun kendi dijital kimliği.", hue: "violet" },
  { icon: Radio,   title: "Canlı Maç Akışı",  desc: "Maç anında tezahürat gönder, anında ulaşsın. Stadyum atmosferi ekranda.",           hue: "sky"    },
  { icon: MapPin,  title: "Şehrimde Ne Var?", desc: "Bu hafta yakınında hangi maçlar var, gör. Konum bazlı sport radar.",                 hue: "violet" },
  { icon: Coins,   title: "Mikro Sponsorluk", desc: "Aylık küçük katkıyla sürdürülebilir destek ver. Tamamen şeffaf akış.",               hue: "sky"    },
  { icon: Users,   title: "Topluluk Fonu",    desc: "Turnuva, ekipman ve yol için şeffaf havuzlar. Topluca güçlü.",                       hue: "coral"  },
  { icon: Compass, title: "Keşfet Modu",      desc: "Hiç izlemediğin bir sporla bugün tanış. Algoritma değil, serüven.",                  hue: "violet" },
];

const hueStyles = {
  violet: { icon: "text-violet", bg: "bg-violet/10 group-hover:bg-violet/16", glow: "oklch(0.52 0.22 252)", bar: "oklch(0.52 0.22 252)" },
  sky:    { icon: "text-sky",    bg: "bg-sky/10 group-hover:bg-sky/16",       glow: "oklch(0.68 0.17 220)", bar: "oklch(0.68 0.17 220)" },
  coral:  { icon: "text-coral",  bg: "bg-coral/10 group-hover:bg-coral/16",   glow: "oklch(0.60 0.20 16)",  bar: "oklch(0.60 0.20 16)"  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: (i % 3) * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Features() {
  return (
    <section id="ozellikler" className="relative isolate overflow-hidden py-28 sm:py-36">
      <FloatingAthlete src={cemKaanImg} alt="Cem Kaan Gökerkan" side="right" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-violet/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:pr-[30rem]">
        {/* Header */}
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky/25 bg-sky/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-sky">
              <span className="h-1.5 w-1.5 rounded-full bg-sky" />
              Özellikler
            </span>
            <h2 className="font-display mt-5 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
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
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const s = hueStyles[f.hue as keyof typeof hueStyles];
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.04] p-7 transition-all duration-300 hover:bg-foreground/[0.07] hover:border-foreground/14"
              >
                {/* Corner glow */}
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `color-mix(in oklab, ${s.glow} 22%, transparent)` }}
                />

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${s.bg}`}>
                  <f.icon className={`h-5 w-5 ${s.icon}`} strokeWidth={1.6} />
                </div>

                <h3 className="font-display mt-6 text-xl text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>

                <div
                  className="mt-6 h-[2px] w-8 rounded-full transition-all duration-500 group-hover:w-20"
                  style={{ background: `linear-gradient(to right, ${s.bar}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Stat band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 grid grid-cols-3 divide-x divide-foreground/8 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.04]"
        >
          {[
            { val: "320+",  label: "Sporcu profili" },
            { val: "20+",   label: "Olimpik branş"  },
            { val: "₺186K", label: "Doğrudan destek" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="flex flex-col items-center py-8"
            >
              <span className="font-display text-3xl text-foreground sm:text-4xl">{s.val}</span>
              <span className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
