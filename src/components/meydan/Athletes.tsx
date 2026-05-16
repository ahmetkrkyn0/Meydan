import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import adaImg from "@/assets/athlete-ada.jpg";
import keremImg from "@/assets/athlete-kerem.jpg";
import linaImg from "@/assets/athlete-lina.jpg";
import mertImg from "@/assets/athlete-mert.jpg";

const athletes = [
  {
    img: adaImg,
    name: "Ada Yılmaz",
    sport: "Okçuluk",
    rank: "#3 Ulusal",
    supporters: "1.2K",
  },
  {
    img: keremImg,
    name: "Kerem Taş",
    sport: "Güreş",
    rank: "#1 Ulusal",
    supporters: "2.4K",
  },
  {
    img: linaImg,
    name: "Lina Demir",
    sport: "Yüzme",
    rank: "Olimpik Aday",
    supporters: "980",
  },
  {
    img: mertImg,
    name: "Mert Kaya",
    sport: "Satranç",
    rank: "#7 Avrupa",
    supporters: "760",
  },
];

export function Athletes() {
  return (
    <section id="sporcular" className="relative overflow-hidden py-28 sm:py-36">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-violet/10 blur-[140px]" />
        <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-sky/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet">— Sporcular</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              Sahnedekiler.
            </h2>
          </motion.div>

          <motion.a
            href="#cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tümünü keşfet
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>

        {/* Athlete cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {athletes.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl"
            >
              {/* Photo */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={a.img}
                  alt={a.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.06_195)] via-[oklch(0.27_0.06_195/0.40)] to-transparent" />

                {/* Sport tag */}
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-md">
                    {a.sport}
                  </span>
                </div>

                {/* Info overlay */}
                <div className="absolute inset-x-4 bottom-4">
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
                    <p className="font-display text-lg leading-tight text-white">{a.name}</p>
                    <p className="mt-0.5 text-xs text-white/60">{a.rank}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          {[...Array(3)].map((_, j) => (
                            <div
                              key={j}
                              className="h-5 w-5 rounded-full border border-black/40 bg-gradient-to-br from-violet/60 to-indigo/40"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-white/60">{a.supporters} destekçi</span>
                      </div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-violet/20 transition-all duration-300 group-hover:bg-violet group-hover:scale-110"
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
