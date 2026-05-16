import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#sunar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Keşfet</a>
            <a href="#ozellikler" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sporcular</a>
            <a href="#cta" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Destekle</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#cta"
              className="hidden rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10 sm:inline-flex"
            >
              Giriş Yap
            </a>
            <button
              aria-label="Menü"
              className="glass flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
