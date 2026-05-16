import { motion } from "framer-motion";
import { IdCard, Radio, MapPin, Coins, Users, Compass } from "lucide-react";

const features = [
  { icon: IdCard, title: "Sporcu Kartı", desc: "Son maç, sıralama, yaklaşan etkinlik ve destekçi sayısı tek bakışta." },
  { icon: Radio, title: "Canlı Maç Akışı", desc: "Maç sırasında dijital tezahürat gönder, sporcu maçtan sonra desteğini görsün." },
  { icon: MapPin, title: "Şehrimde Ne Var?", desc: "Bu hafta yakınında hangi maçlar var, tek tıkla keşfet." },
  { icon: Coins, title: "Mikro-Sponsorluk", desc: "Aylık küçük katkılarla sporcuların sürdürülebilir gelir elde etmesini sağla." },
  { icon: Users, title: "Topluluk Fonu", desc: "Turnuva, ekipman ve yol masrafları için şeffaf destek havuzları." },
  { icon: Compass, title: "Keşfet Modu", desc: "Hiç izlemediğin bir sporu keşfet." },
];

export function Features() {
  return (
    <section id="ozellikler" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Platform</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-foreground sm:text-5xl">
              Sporcunun hikâyesini taşıyan
              <br />
              <span className="text-muted-foreground">altı sade araç.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Her özellik sporcunun görünür olmasına, taraftarın bağ kurmasına ve
            desteğin doğrudan ulaşmasına hizmet eder.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative bg-background p-8 transition-colors hover:bg-ink"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] transition-all group-hover:bg-crimson/15 group-hover:text-crimson">
                <f.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-display mt-6 text-xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <div className="mt-6 h-px w-8 bg-gradient-to-r from-gold to-transparent transition-all duration-500 group-hover:w-24" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
