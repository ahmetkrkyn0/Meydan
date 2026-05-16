import { motion } from "framer-motion";
import { Logo } from "./Logo";

const links = [
  { label: "Keşfet", href: "#cozum" },
  { label: "Sporcular", href: "#ozellikler" },
  { label: "Destekle", href: "#nasil" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
        <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#katil"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
          >
            Katıl
          </a>
        </div>
      </div>
    </motion.header>
  );
}
