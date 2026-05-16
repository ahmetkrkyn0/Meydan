import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <Logo />
        <p className="text-sm tracking-wide text-muted-foreground">
          <span className="text-foreground/80">İzle.</span>{" "}
          <span className="text-foreground/80">Destekle.</span>{" "}
          <span className="text-gold">Sen de Oyna.</span>
        </p>
        <p className="text-xs text-muted-foreground">© 2025 Meydan</p>
      </div>
    </footer>
  );
}
