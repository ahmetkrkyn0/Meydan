import { motion } from "framer-motion";
import { Heart, Trophy, Calendar, Sparkles } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow behind card */}
      <div className="absolute -inset-10 -z-10 bg-gradient-to-br from-crimson/20 via-transparent to-gold/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="glass-strong rounded-3xl p-5 shadow-2xl"
        style={{ transformPerspective: 1200 }}
      >
        {/* Sporcu Kartı */}
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-crimson to-gold">
            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-foreground">
              EY
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">Elif Yılmaz</p>
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                Milli
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Branş · Okçuluk</p>
          </div>
          <button className="rounded-full bg-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/20">
            Takip et
          </button>
        </div>

        {/* Stats grid */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-foreground/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Yaklaşan Maç
            </div>
            <p className="mt-2 font-display text-lg text-foreground">İzmir Open</p>
            <p className="text-xs text-muted-foreground">Cmt · 14:00</p>
          </div>
          <div className="rounded-2xl bg-foreground/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-crimson" />
              Dijital Tezahürat
            </div>
            <p className="mt-2 font-display text-lg text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Bugün</p>
          </div>
        </div>

        {/* Fund progress */}
        <div className="mt-3 rounded-2xl bg-foreground/[0.04] p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-gold" />
              Topluluk Fonu
            </span>
            <span className="text-foreground">₺8.450 / ₺12.000</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.4, delay: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-crimson via-gold to-crimson"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-full border border-background bg-gradient-to-br from-gold to-crimson"
                />
              ))}
              <div className="flex h-5 items-center rounded-full border border-background bg-foreground/10 px-1.5 text-[9px] text-muted-foreground">
                +124
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-gold">
              <Sparkles className="h-3 w-3" /> Destekçi Rozeti
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-crimson py-2.5 text-xs font-medium text-foreground transition-transform hover:scale-[1.02]">
            Tezahürat Gönder
          </button>
          <button className="rounded-xl border border-foreground/15 bg-foreground/[0.04] py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.08]">
            Mikro Sponsor Ol
          </button>
        </div>
      </motion.div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="glass absolute -left-6 bottom-12 hidden rounded-2xl px-4 py-3 sm:block"
      >
        <p className="text-[10px] uppercase tracking-wider text-gold">Canlı</p>
        <p className="mt-0.5 text-sm text-foreground">Maç akışı başladı</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="glass absolute -right-4 -top-6 hidden rounded-2xl px-4 py-3 lg:block"
      >
        <p className="text-[10px] uppercase tracking-wider text-crimson">Yeni</p>
        <p className="mt-0.5 text-sm text-foreground">+12 destekçi</p>
      </motion.div>
    </div>
  );
}
