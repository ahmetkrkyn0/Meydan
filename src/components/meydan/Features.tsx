import { motion } from "framer-motion";
import { IdCard, Radio, MapPin, Coins, Users, Compass } from "lucide-react";

const features = [
  { icon: IdCard, title: "Sporcu Kartı", desc: "Sıralama, son maç ve destekçiler tek bakışta." },
  { icon: Radio, title: "Canlı Maç Akışı", desc: "Maç anında tezahürat gönder, anında ulaşsın." },
  { icon: MapPin, title: "Şehrimde Ne Var?", desc: "Bu hafta yakınında hangi maçlar var, gör." },
  { icon: Coins, title: "Mikro Sponsorluk", desc: "Aylık küçük katkıyla sürdürülebilir destek ver." },
  { icon: Users, title: "Topluluk Fonu", desc: "Turnuva, ekipman ve yol için şeffaf havuzlar." },
  { icon: Compass, title: "Keşfet Modu", desc: "Hiç izlemediğin bir sporla bugün tanış." },
];

export function Features() {
  return (
    <section id="ozellikler" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] bg-gradient-to-b from-violet/10 to-transparent blur-2xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-sky">Özellikler</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] text-foreground sm:text-6xl">
            Sporcuyla taraftarı buluşturan{" "}
            <span className="text-gradient-violet italic">altı sade araç.</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative bg-background p-8 transition-colors hover:bg-ink"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet/30 to-indigo/10 transition-all group-hover:from-violet/50">
                <f.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-display mt-7 text-xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <div className="mt-6 h-px w-8 bg-gradient-to-r from-violet to-transparent transition-all duration-500 group-hover:w-24" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
