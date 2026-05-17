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
      <motion.div
        animate={scrolled
          ? { background: "oklch(0.11 0.035 258 / 1)", borderColor: "oklch(0.95 0.008 240 / 0.10)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.30)" }
          : { background: "oklch(0.11 0.035 258 / 1)", borderColor: "oklch(1 0 0 / 0.08)", boxShadow: "none" }
        }
        transition={{ duration: 0.3 }}
        className="border-b"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
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
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#cta"
              className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition-all hover:bg-white/10 sm:inline-flex"
            >
              Giriş Yap
            </a>
            <button
              aria-label="Menü"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/8 text-white transition-colors hover:bg-white/15"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
