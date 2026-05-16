export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-indigo to-sky opacity-90 blur-[10px]" />
        <span className="glass-strong relative flex h-9 w-9 items-center justify-center rounded-2xl">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 19 L3 6 L12 16 L21 6 L21 19" className="text-foreground" />
          </svg>
        </span>
      </span>
      <span className="font-display text-2xl tracking-tight text-foreground">Meydan</span>
    </a>
  );
}
