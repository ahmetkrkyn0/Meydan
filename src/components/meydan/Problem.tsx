import { motion } from "framer-motion";
import { EyeOff, Radio, Coins } from "lucide-react";

const cards = [
  { icon: EyeOff, title: "Sporcu görünmez", desc: "Yayın yok, sahne yok, sahne ışığı sönük." },
  { icon: Radio, title: "Taraftar ulaşamaz", desc: "Maçlar dağınık, kanallar bölük pörçük." },
  { icon: Coins, title: "Destek dağınık kalır", desc: "Niyet var, yol yok. Para sporcuya varmaz." },
];

export function Problem() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Mesele</p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-foreground sm:text-5xl">
            Tribün boş değil.
            <br />
            <span className="text-muted-foreground">Sadece dağınık.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Binlerce sporcu her gün antrenman yapıyor, yarışıyor, ülkesini temsil ediyor.
            Ama taraftar onları nerede izleyeceğini, nasıl destekleyeceğini bilmiyor.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-3xl p-7"
            >
              <c.icon className="h-5 w-5 text-crimson" strokeWidth={1.5} />
              <h3 className="font-display mt-6 text-2xl text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
