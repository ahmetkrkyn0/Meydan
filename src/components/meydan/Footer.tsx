import { Logo } from "./Logo";

const links = {
  Platform: ["Keşfet", "Sporcular", "Destekle", "Canlı Akış"],
  Topluluk: ["Taraftar Ol", "Topluluk Fonu", "Şehrimde Ne Var?", "Keşfet Modu"],
  Şirket: ["Hakkında", "Basın", "Kariyer", "İletişim"],
};

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/8 bg-ink">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand col */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Türkiye'nin futbol dışı sporcularını taraftarla buluşturan dijital sahne. Her branşın kendi meydanı var.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {["X", "İG", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/12 bg-foreground/5 font-mono text-[11px] text-muted-foreground transition-all hover:border-violet/40 hover:bg-violet/10 hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {Object.entries(links).map(([cat, items]) => (
              <div key={cat}>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{cat}</p>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <p className="text-xs text-muted-foreground">
            © 2025 Meydan. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground/60">İzle.</span>{" "}
            <span className="text-foreground/60">Destekle.</span>{" "}
            <span className="text-gradient-violet">Sahaya Çık.</span>
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Gizlilik</a>
            <a href="#" className="transition-colors hover:text-foreground">Kullanım Koşulları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
