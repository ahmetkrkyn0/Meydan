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
        <div className="flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md sm:px-5">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#sunar" className="text-sm text-white/75 transition-colors hover:text-white">Keşfet</a>
            <a href="#ozellikler" className="text-sm text-white/75 transition-colors hover:text-white">Sporcular</a>
            <a href="#cta" className="text-sm text-white/75 transition-colors hover:text-white">Destekle</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#cta"
              className="hidden rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:inline-flex"
            >
              Giriş Yap
            </a>
            <button
              aria-label="Menü"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Menu className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
