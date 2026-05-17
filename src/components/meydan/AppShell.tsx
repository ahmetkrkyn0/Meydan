import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Home, Compass, MapPin, Radio, Heart, User, Bell, Search,
  Trophy, Wrench, Award, Settings, LogOut, ChevronDown,
  Mail, Sparkles, LogIn,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import adaImg from "@/assets/athlete-ada.jpg";
import { useDemoLogin, useLogout, useSession } from "@/lib/session";
import type { ProfileRole } from "@/lib/api";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  badge?: string;
};

const fanNav: NavItem[] = [
  { to: "/dashboard",    label: "Ana Sahne",       icon: Home },
  { to: "/kesfet",       label: "Keşfet",          icon: Compass },
  { to: "/sehrimde",     label: "Şehrimde",        icon: MapPin },
  { to: "/canli",        label: "Canlı Maçlar",    icon: Radio, badge: "2" },
  { to: "/desteklerim",  label: "Desteklerim",     icon: Heart },
  { to: "/yetenek",      label: "Yetenek Bağışı",  icon: Wrench },
  { to: "/rozetlerim",   label: "Rozetlerim",      icon: Award },
];

export type AppRole = "fan" | "athlete" | "brand";

const athleteNav: NavItem[] = [
  { to: "/sporcu-panel",      label: "Panelim",        icon: Home },
  { to: "/sporcu-panel/teklifler", label: "Teklifler", icon: Mail, badge: "3" },
  { to: "/sporcu-panel/ihtiyaclar", label: "İhtiyaçlarım", icon: Wrench },
  { to: "/sporcu-panel/profil",  label: "Profilim",      icon: User },
];

const brandNav: NavItem[] = [
  { to: "/marka-panel",            label: "Genel Bakış",   icon: Home },
  { to: "/marka-panel/eslesme",    label: "AI Eşleştirme", icon: Sparkles },
  { to: "/marka-panel/kampanyalar",label: "Kampanyalar",   icon: Trophy },
  { to: "/marka-panel/profil",     label: "Marka Profili", icon: User },
];

const navFor = (r: AppRole) =>
  r === "athlete" ? athleteNav : r === "brand" ? brandNav : fanNav;

export function AppShell({
  children,
  role = "fan",
  userName,
  userCity,
  hideSearch = false,
}: {
  children: ReactNode;
  role?: AppRole;
  userName?: string;
  userCity?: string;
  hideSearch?: boolean;
}) {
  const loc = useLocation();
  const nav = navFor(role);
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useSession();
  const logout = useLogout();
  const demoLogin = useDemoLogin();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState<AppRole | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);

  const ROLE_TO_PROFILE: Record<AppRole, ProfileRole> = {
    fan: "taraftar",
    athlete: "sporcu",
    brand: "marka",
  };
  const ROLE_TO_DEST: Record<AppRole, string> = {
    fan: "/dashboard",
    athlete: "/sporcu-panel",
    brand: "/marka-panel",
  };

  async function handleRoleSwitch(target: AppRole) {
    if (demoLoading) return;
    setDemoError(null);
    setDemoLoading(target);
    try {
      await demoLogin(ROLE_TO_PROFILE[target]);
      navigate({ to: ROLE_TO_DEST[target] }).catch(() => undefined);
    } catch (err) {
      setDemoError(err instanceof Error ? err.message : "Demo giriş başarısız");
    } finally {
      setDemoLoading(null);
    }
  }

  // Override: oturum açıldıysa session bilgisi tercih edilir.
  const effectiveName = session.profile?.full_name ?? userName ?? "Misafir";
  const effectiveCity = session.profile?.city ?? userCity ?? "";

  async function handleLogout() {
    await logout();
    navigate({ to: "/giris" }).catch(() => undefined);
  }

  return (
    <div className="app-surface app-ambient relative flex min-h-screen w-full">
      {/* ── Sidebar ── */}
      <aside className="sidebar-glass fixed left-0 top-0 z-30 hidden h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-[color:var(--app-line)] lg:flex">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 px-6 py-5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-indigo to-sky opacity-95" />
            <span className="relative font-display text-base font-bold text-white">M</span>
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight text-[color:var(--app-ink)]">Meydan</p>
            <p className="mt-1 text-[10px] text-[color:var(--app-ink-mute)]">Her sporun bir meydanı</p>
          </div>
        </Link>

        <nav className="sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pt-2">
          {nav.map((item) => {
            const active = loc.pathname === item.to ||
              (item.to !== "/dashboard" && loc.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[color:oklch(0.60_0.22_252/0.10)] text-[color:oklch(0.45_0.22_252)]"
                    : "text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="app-nav-pill"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-violet"
                  />
                )}
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.2 : 1.7} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral/85 px-1.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mode switcher — demo: ilgili roldeki ilk profile login yapar */}
        <div className="mx-3 mb-3 mt-3 shrink-0 rounded-2xl border border-[color:var(--app-line)] bg-white/80 p-2 backdrop-blur">
          <p className="px-2 pt-1 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            Demo rol
          </p>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {(["fan", "athlete", "brand"] as AppRole[]).map((r) => {
              const isActive = role === r;
              const isLoading = demoLoading === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => void handleRoleSwitch(r)}
                  disabled={Boolean(demoLoading)}
                  className={`rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    isActive
                      ? "bg-[color:var(--app-ink)] text-white"
                      : "text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)]"
                  }`}
                >
                  {isLoading
                    ? "…"
                    : r === "fan"
                      ? "Taraftar"
                      : r === "athlete"
                        ? "Sporcu"
                        : "Marka"}
                </button>
              );
            })}
          </div>
          {demoError && (
            <p className="mt-1.5 px-2 text-[10px] font-semibold text-coral">{demoError}</p>
          )}
        </div>

        {/* User card */}
        <div className="m-3 mt-0 flex shrink-0 items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white/85 p-2.5 backdrop-blur">
          <img src={adaImg} alt="" className="h-9 w-9 rounded-xl object-cover object-top" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[color:var(--app-ink)]">{effectiveName}</p>
            <p className="text-[10px] text-[color:var(--app-ink-mute)]">{effectiveCity}</p>
          </div>
          <button className="text-[color:var(--app-ink-mute)] hover:text-[color:var(--app-ink)]">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[color:var(--app-line-soft)] bg-white/75 px-5 backdrop-blur-xl sm:px-8">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet via-indigo to-sky">
              <span className="font-display text-sm font-bold text-white">M</span>
            </span>
            <span className="font-display font-bold tracking-tight">Meydan</span>
          </Link>

          {/* Search */}
          {!hideSearch && (
            <div className="relative ml-auto hidden max-w-md flex-1 sm:block lg:ml-0">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)]" strokeWidth={1.7} />
              <input
                type="text"
                placeholder="Sporcu, branş, etkinlik ara…"
                className="w-full rounded-xl border border-[color:var(--app-line)] bg-white py-2.5 pl-10 pr-4 text-sm text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] transition-all focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/15"
              />
            </div>
          )}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Bildirimler"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] transition-colors hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
            >
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-coral" />
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl border border-[color:var(--app-line)] bg-white px-2.5 py-1.5 transition-colors hover:bg-[color:var(--app-line-soft)]"
            >
              <img src={adaImg} alt="" className="h-7 w-7 rounded-lg object-cover object-top" />
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none text-[color:var(--app-ink)]">{effectiveName}</p>
                <p className="mt-0.5 text-[10px] leading-none text-[color:var(--app-ink-mute)]">{effectiveCity}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[color:var(--app-ink-mute)]" />
            </button>
            {menuOpen && (
              <div className="absolute right-5 top-14 w-48 rounded-2xl border border-[color:var(--app-line)] bg-white p-1.5 shadow-lg sm:right-8">
                {session.isAuthenticated ? (
                  <>
                    <Link to="/sporcu-panel/profil" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]">
                      <Settings className="h-3.5 w-3.5" /> Ayarlar
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        void handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-coral hover:bg-coral/10"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Çıkış
                    </button>
                  </>
                ) : (
                  <Link
                    to="/giris"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogIn className="h-3.5 w-3.5" /> Giriş yap
                  </Link>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[color:var(--app-line)] bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-md lg:hidden">
          {nav.slice(0, 5).map((item) => {
            const active = loc.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex h-9 w-11 items-center justify-center rounded-full transition-colors ${
                  active ? "bg-[color:var(--app-ink)] text-white" : "text-[color:var(--app-ink-soft)]"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={active ? 2.2 : 1.7} />
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 px-5 pb-24 pt-6 sm:px-8 sm:pb-8 sm:pt-8">{children}</main>
      </div>
    </div>
  );
}
