import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { useState } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6">
        <motion.div
          animate={scrolled
            ? { background: "oklch(1 0 0 / 0.92)", borderColor: "oklch(0.22 0.055 240 / 0.12)", boxShadow: "0 4px 24px oklch(0.22 0.055 240 / 0.08)" }
            : { background: "oklch(1 0 0 / 0.10)", borderColor: "oklch(1 0 0 / 0.20)", boxShadow: "none" }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-md sm:px-5"
        >
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {[
              { href: "#sunar",      label: "Keşfet" },
              { href: "#ozellikler", label: "Sporcular" },
              { href: "#cta",        label: "Destekle" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${scrolled ? "text-foreground/60 hover:text-foreground" : "text-white/75 hover:text-white"}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#cta"
              className={`hidden rounded-full px-4 py-2 text-sm font-medium transition-all sm:inline-flex ${
                scrolled
                  ? "border border-violet/25 bg-violet/8 text-violet hover:bg-violet/14"
                  : "border border-white/25 text-white/90 hover:bg-white/12"
              }`}
            >
              Giriş Yap
            </a>
            <button
              aria-label="Menü"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                scrolled
                  ? "border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/18"
              }`}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
