import { motion } from "framer-motion";
import { Eye, HandHeart, Flame } from "lucide-react";

const pillars = [
  {
    n: "01",
    icon: Eye,
    title: "İzle",
    desc: "Şehrindeki maçları, turnuvaları ve sporcuları tek ekranda keşfet.",
    accent: "from-gold/30 to-transparent",
  },
  {
    n: "02",
    icon: HandHeart,
    title: "Destekle",
    desc: "Mikro sponsorluk, dijital tezahürat ve topluluk fonlarıyla sporcuna doğrudan katkı ver.",
    accent: "from-crimson/30 to-transparent",
  },
  {
    n: "03",
    icon: Flame,
    title: "Sen de Oyna",
    desc: "Yeni sporları dene, ilk adım rozetlerini kazan, sahaya çık.",
    accent: "from-gold/30 to-crimson/20",
  },
];

export function Solution() {
  return (
    <section id="cozum" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Çözüm</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] text-foreground sm:text-6xl">
            Meydan, sporcuyla taraftarı
            <br />
            buluşturan{" "}
            <span className="text-gradient-gold italic">dijital köprü.</span>
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 transition-opacity group-hover:opacity-100`} />
              <div className="glass-strong relative h-full rounded-3xl p-8 sm:p-10">
                <div className="flex items-start justify-between">
                  <p className="font-display text-sm text-gold/70">{p.n}</p>
                  <p.icon className="h-6 w-6 text-foreground/80" strokeWidth={1.4} />
                </div>
                <h3 className="font-display mt-16 text-4xl text-foreground sm:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
                <div className="mt-10 h-px w-full bg-gradient-to-r from-foreground/20 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
