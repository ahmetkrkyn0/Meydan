export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-crimson opacity-90 blur-[6px]" />
        <svg viewBox="0 0 32 32" className="relative h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="16" cy="16" r="12" className="text-foreground/30" />
          <path d="M16 4 L16 28" className="text-gold" strokeLinecap="round" />
          <path d="M4 16 L28 16" className="text-gold/60" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3" className="fill-crimson stroke-none" />
        </svg>
      </span>
      <span className="font-display text-2xl tracking-tight text-foreground">
        Meydan
      </span>
    </a>
  );
}
