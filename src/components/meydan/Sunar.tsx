import { motion } from "framer-motion";
import { Compass, HandHeart, Flame } from "lucide-react";

const pillars = [
  {
    icon: Compass,
    title: "Keşfet",
    desc: "Yeni sporcuları ve branşları keşfet.",
    grad: "from-sky/30 to-indigo/10",
  },
  {
    icon: HandHeart,
    title: "Destekle",
    desc: "Sporculara doğrudan katkı ver.",
    grad: "from-violet/35 to-indigo/10",
  },
  {
    icon: Flame,
    title: "Sahaya Çık",
    desc: "Sen de yeni sporlarla tanış.",
    grad: "from-coral/25 to-violet/15",
  },
];

export function Sunar() {
  return (
    <section id="sunar" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-violet">Platform</p>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] text-foreground sm:text-6xl">
              Meydan ne <span className="text-gradient-violet italic">sunar?</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Üç sade adım. Sporcuyu görünür kılan, taraftarı sahaya bağlayan, herkesi yeniden harekete davet eden bir akış.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.grad} opacity-80 transition-opacity group-hover:opacity-100`} />
              <div className="glass-strong relative flex h-full flex-col rounded-3xl p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/10 backdrop-blur">
                  <p.icon className="h-5 w-5 text-foreground" strokeWidth={1.6} />
                </div>
                <h3 className="font-display mt-12 text-3xl text-foreground sm:text-4xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-8 h-px w-10 bg-gradient-to-r from-foreground/50 to-transparent transition-all duration-500 group-hover:w-24" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
