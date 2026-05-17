import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import adaImg   from "@/assets/athlete-ada.jpg";
import keremImg from "@/assets/athlete-kerem.jpg";
import linaImg  from "@/assets/athlete-lina.jpg";
import mertImg  from "@/assets/athlete-mert.jpg";

const athletes = [
  { img: adaImg,   name: "Ada Yılmaz",  sport: "Okçuluk", rank: "#3 Ulusal",    supporters: "1.2K", featured: false },
  { img: keremImg, name: "Kerem Taş",   sport: "Güreş",   rank: "#1 Ulusal",    supporters: "2.4K", featured: true  },
  { img: linaImg,  name: "Lina Demir",  sport: "Yüzme",   rank: "Olimpik Aday", supporters: "980",  featured: false },
  { img: mertImg,  name: "Mert Kaya",   sport: "Satranç", rank: "#7 Avrupa",    supporters: "760",  featured: false },
];

export function Athletes() {
  return (
    <section id="sporcular" className="relative overflow-hidden py-28 sm:py-36">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-dots opacity-60" />
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-sky/10 blur-[130px]" />
      <div className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-violet/8 blur-[110px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-violet/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-violet">
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              Sporcular
            </span>
            <h2 className="font-display mt-5 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              Sahnedekiler.
            </h2>
          </motion.div>

          <motion.a
            href="#cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/12 bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:border-violet/25 hover:text-violet hover:shadow"
          >
            Tümünü keşfet
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {athletes.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              whileHover={{ y: -4 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-foreground/8 bg-foreground/[0.04] transition-all duration-500 hover:border-foreground/15 hover:bg-foreground/[0.07]"
            >
              {a.featured && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-50 px-2.5 py-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-600">Öne Çıkan</span>
                </div>
              )}

              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={a.img}
                  alt={a.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                {/* Gradient — fades into white card bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.04_258)] via-[oklch(0.14_0.04_258/0.35)] to-transparent" />

                {/* Sport tag — top right if not featured */}
                {!a.featured && (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-white/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/60 backdrop-blur-sm">
                      {a.sport}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-5 pb-5 pt-0 -mt-6 relative z-10">
                <p className="font-display text-xl text-foreground">{a.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.sport} · {a.rank}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 w-6 rounded-full border-2 border-foreground/10 bg-gradient-to-br from-violet/60 to-sky/40 shadow-sm" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{a.supporters}</span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/10 text-violet transition-colors duration-300 group-hover:bg-violet group-hover:text-white"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
