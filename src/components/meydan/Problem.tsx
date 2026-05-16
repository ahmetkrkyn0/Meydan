import { motion } from "framer-motion";
import { Users, Megaphone, Wallet } from "lucide-react";

const problems = [
  {
    icon: Users,
    title: "Sporcu görünmez",
    desc: "Olimpik branşların yıldızları kendi şehrinde bile tanınmıyor. Hikâye yok, sahne yok.",
    tag: "01",
  },
  {
    icon: Megaphone,
    title: "Taraftar dağınık",
    desc: "Tribün boş değil; sadece bağlanacağı bir yer arıyor. Topluluk parçalı, ses dağılmış.",
    tag: "02",
  },
  {
    icon: Wallet,
    title: "Destek ulaşmıyor",
    desc: "İyi niyet var, kanal yok. Küçük katkıların sporcuya direkt ulaşacağı bir köprü eksik.",
    tag: "03",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      {/* subtle backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-violet/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-violet">Problem</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.02] text-foreground sm:text-6xl">
            “Tribün boş değil.
            <br />
            Sadece{" "}
            <span className="text-gradient-violet italic">dağınık</span>.”
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Türkiye'de futbol dışı her branş aynı üç duvara çarpıyor. Önce
            problemi net koyalım; sonra meydanı kuralım.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {problems.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <div className="glass relative flex h-full flex-col rounded-3xl p-7 transition-colors duration-500 group-hover:bg-foreground/[0.04]">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/10 backdrop-blur">
                    <p.icon
                      className="h-5 w-5 text-foreground"
                      strokeWidth={1.6}
                    />
                  </div>
                  <span className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                    {p.tag}
                  </span>
                </div>

                <h3 className="font-display mt-10 text-2xl text-foreground sm:text-[1.7rem]">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>

                <div className="mt-8 h-px w-10 bg-gradient-to-r from-foreground/50 to-transparent transition-all duration-500 group-hover:w-24" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
