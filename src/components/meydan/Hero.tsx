import { motion } from "framer-motion";
import { Play } from "lucide-react";
import heroImg from "@/assets/meydan-hero.png";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16">
      {/* Aurora background */}
      <div className="absolute inset-0 -z-30 bg-aurora" />
      <div className="absolute inset-x-0 top-0 -z-20 h-[70%] light-rays opacity-50" />
      <div className="absolute inset-0 -z-10 grid-dots opacity-[0.15]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top copy row */}
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.06] px-3 py-1 text-xs text-muted-foreground backdrop-blur"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
              Türkiye'nin yeni sporcu hareketi
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display mt-6 text-[3.25rem] leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[6.5rem]"
            >
              Her sporun
              <br />
              bir <span className="text-gradient-violet italic">meydanı</span> var.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground sm:text-xl"
            >
              Keşfet, destekle, sahaya çık.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#sunar"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo text-foreground">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                Meydanı Keşfet
              </a>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-violet via-indigo to-sky"
                    />
                  ))}
                </div>
                <p className="text-xs leading-tight text-muted-foreground">
                  <span className="text-foreground">12.400+ taraftar</span>
                  <br />
                  bu hafta sporcusunu destekledi
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="lg:col-span-5 lg:text-right"
          >
            <p className="ml-auto max-w-sm text-sm leading-relaxed text-muted-foreground/90">
              <span className="text-gradient-violet font-medium">Meydan</span>, futbolun gölgesinde
              kalan sporcuları taraftarla buluşturan, doğrudan destek için kurulmuş bir dijital sahnedir.
            </p>
            <div className="ml-auto mt-6 flex max-w-sm items-start gap-3 lg:justify-end">
              <span className="mt-1.5 h-8 w-px shrink-0 bg-gradient-to-b from-violet via-sky to-transparent lg:order-2 lg:bg-gradient-to-t" />
              <p className="text-xs italic leading-relaxed text-foreground/75 lg:order-1 lg:text-right">
                "19 Mayıs ruhuyla: gençleri, sporu ve görünmeyen kahramanları Meydan'a çıkarıyoruz."
              </p>
            </div>
          </motion.div>
        </div>


      </div>

      {/* Hero centerpiece visual — full-bleed, edge to edge */}
      <motion.div
        initial={{ opacity: 0, y: 64, scale: 0.98, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10 sm:mt-14"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-[60%] bg-gradient-to-b from-violet/30 via-sky/10 to-transparent blur-3xl" />

        <div className="relative overflow-hidden border-y border-foreground/15">
          <img
            src={heroImg}
            alt="Meydan: farklı branşlardan Türk sporcular parlayan M kapısının etrafında, üstte Atatürk ileriyi işaret ediyor"
            width={1920}
            height={1080}
            className="block h-auto w-full"
          />
          {/* Top fade into background — kept subtle so Atatürk stays clean */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/60 to-transparent" />
          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Bottom stat strip — sits over the running track, not over Atatürk */}
          <div className="absolute inset-x-0 bottom-4 hidden sm:block sm:bottom-6">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="glass-strong flex flex-wrap items-center justify-between gap-6 rounded-2xl px-6 py-4">
                <Stat label="Futbol dışı sporlar" value="7+" index={0} />
                <Divider />
                <Stat label="Dijital tribün" value="12K" index={1} />
                <Divider />
                <Stat label="Doğrudan destek" value="₺840K" index={2} />
                <Divider />
                <Stat label="Aktif sporcu" value="240+" index={3} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Scroll indicator */}
        <motion.a
          href="#sunar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mx-auto mt-10 flex w-fit flex-col items-center gap-2 text-xs text-muted-foreground"
        >
          <span className="glass flex h-9 w-6 items-start justify-center rounded-full pt-1.5">
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="h-1.5 w-1 rounded-full bg-foreground"
            />
          </span>
          Aşağı Kaydır
        </motion.a>
      </div>
    </section>
  );
}

function Stat({ label, value, index = 0 }: { label: string; value: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 1.4 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0"
    >
      <p className="font-display text-xl text-foreground sm:text-2xl">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function Divider() {
  return <span className="hidden h-8 w-px bg-foreground/15 md:inline-block" />;
}

