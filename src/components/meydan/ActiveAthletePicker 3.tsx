import { AlertCircle, UserCircle2 } from "lucide-react";
import type { ActiveAthleteState } from "@/lib/active-athlete";
import { useSession } from "@/lib/session";

export function ActiveAthletePicker({ state }: { state: ActiveAthleteState }) {
  const session = useSession();
  const { profile, athleteOptions, isLoading, isError, setActiveId } = state;

  // Login olmuş bir sporcu varsa picker gerek yok.
  if (session.isAuthenticated && session.role === "sporcu") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-2.5 text-xs text-[color:var(--app-ink-mute)]">
        <UserCircle2 className="h-4 w-4" />
        Sporcu profilleri backend'den yükleniyor...
      </div>
    );
  }

  if (isError || athleteOptions.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-coral/30 bg-coral/5 px-4 py-2.5 text-xs text-coral">
        <AlertCircle className="h-4 w-4" />
        Backend'de sporcu profili bulunamadı. Bu panel yalnız backend bağlı olduğunda kullanılabilir.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300/40 bg-amber-50 px-4 py-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">
        Demo seçici (oturum açılmamış)
      </span>
      <select
        value={profile?.id ?? ""}
        onChange={(e) => setActiveId(e.target.value)}
        className="rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[color:var(--app-ink)] focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/15"
      >
        {athleteOptions.map((o) => (
          <option key={o.profile.id} value={o.profile.id}>
            {o.athlete.name} · {o.athlete.city}
          </option>
        ))}
      </select>
      <span className="text-[10px] text-amber-700/80">
        Gerçek deneyim için <a href="/giris" className="underline">giriş yap</a>.
      </span>
    </div>
  );
}
