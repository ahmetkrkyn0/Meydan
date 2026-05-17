import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Compass,
  MapPin,
  Radio,
  Heart,
  User,
  Bell,
  Search,
  Trophy,
  Wrench,
  Award,
  Settings,
  LogOut,
  ChevronDown,
  Mail,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import okculukImg from "@/assets/athlete-okculuk-kadin.png";
import { useDemoLogin, useLogout, useSession } from "@/lib/session";
import type { ProfileRole } from "@/lib/api";

type NavItem = {
  to: string;
  label: string;
  tooltip?: string;
  icon: typeof Home;
  badge?: string;
};

const fanNav: NavItem[] = [
  {
    to: "/dashboard",
    label: "Ana Sahne",
    icon: Home,
    tooltip: "Takip ettiğin sporcuların canlı sahnesi",
  },
  {
    to: "/kesfet",
    label: "Keşfet",
    icon: Compass,
    tooltip: "Yeni sporcular bul, branşları keşfet",
  },
  {
    to: "/sehrimde",
    label: "Şehrimde",
    icon: MapPin,
    tooltip: "Şehrindeki etkinlikler ve sporcular",
  },
  {
    to: "/canli",
    label: "Canlı Maçlar",
    icon: Radio,
    badge: "2",
    tooltip: "Şu an devam eden maçları izle",
  },
  {
    to: "/desteklerim",
    label: "Desteklerim",
    icon: Heart,
    tooltip: "Aylık desteklediğin sporcular",
  },
  {
    to: "/yetenek",
    label: "Yetenek Bağışı",
    icon: Wrench,
    tooltip: "Sporculara para yerine yetenek bağışla",
  },
  { to: "/rozetlerim", label: "Rozetlerim", icon: Award, tooltip: "Kazandığın rozet ve başarılar" },
];

export type AppRole = "fan" | "athlete" | "brand";

const athleteNav: NavItem[] = [
  { to: "/sporcu-panel", label: "Panelim", icon: Home },
  { to: "/sporcu-panel/teklifler", label: "Teklifler", icon: Mail, badge: "3" },
  { to: "/sporcu-panel/ihtiyaclar", label: "İhtiyaçlarım", icon: Wrench },
  { to: "/sporcu-panel/profil", label: "Profilim", icon: User },
];

const brandNav: NavItem[] = [
  { to: "/marka-panel", label: "Genel Bakış", icon: Home },
  { to: "/marka-panel/eslesme", label: "AI Eşleştirme", icon: Sparkles },
  { to: "/marka-panel/kampanyalar", label: "Kampanyalar", icon: Trophy },
  { to: "/marka-panel/profil", label: "Marka Profili", icon: User },
];

const navFor = (r: AppRole) => (r === "athlete" ? athleteNav : r === "brand" ? brandNav : fanNav);

export function AppShell({
  children,
  role = "fan",
  userName,
  userCity,
  hideSearch = true,
  topbarOverlay = false,
}: {
  children: ReactNode;
  role?: AppRole;
  userName?: string;
  userCity?: string;
  hideSearch?: boolean;
  topbarOverlay?: boolean;
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
  const ROLE_TO_SETTINGS: Record<AppRole, string> = {
    fan: "/desteklerim",
    athlete: "/sporcu-panel/profil",
    brand: "/marka-panel/profil",
  };
  const settingsTarget = ROLE_TO_SETTINGS[role];

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
  const topbarActionClass = topbarOverlay
    ? "border-white/70 bg-white/95 text-[color:var(--app-ink-soft)] shadow-sm backdrop-blur-md hover:bg-white hover:text-[color:var(--app-ink)]"
    : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]";
  const topbarProfileClass = topbarOverlay
    ? "border-white/70 bg-white/95 shadow-sm backdrop-blur-md hover:bg-white"
    : "border-[color:var(--app-line)] bg-white hover:bg-[color:var(--app-line-soft)]";

  async function handleLogout() {
    await logout();
    navigate({ to: "/giris" }).catch(() => undefined);
  }

  return (
    <div className="app-surface app-ambient relative flex min-h-screen w-full">
      {/* ── Sidebar (Premium Redesign) ── */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 shrink-0 flex-col overflow-hidden bg-[#FAFAFA] border-r border-[color:var(--app-line-soft)] lg:flex">
        {/* Subtle top gradient for depth */}
        <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />

        <Link to="/" className="relative z-10 flex shrink-0 items-center gap-3 px-6 py-6">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet/10 to-sky/10 opacity-50" />
            <span className="relative font-display text-lg font-bold text-violet">M</span>
          </span>
          <div className="flex flex-col">
            <span className="font-display text-[17px] font-bold leading-tight tracking-tight text-[color:var(--app-ink)]">
              Meydan
            </span>
            <span className="text-[10px] font-medium text-[color:var(--app-ink-mute)]">
              Her sporun bir meydanı
            </span>
          </div>
        </Link>

        <nav className="sidebar-scroll relative z-10 flex-1 space-y-1.5 overflow-y-auto px-4 pt-4 pb-6">
          {nav.map((item) => {
            const active =
              loc.pathname === item.to ||
              (item.to !== "/dashboard" && loc.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.tooltip}
                className={`group relative flex items-center justify-between rounded-[14px] px-3.5 py-2.5 text-[13px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 ${
                  active
                    ? "bg-white text-[color:var(--app-ink)] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06)] border border-slate-200/60"
                    : "text-[color:var(--app-ink-soft)] hover:bg-slate-200/40 hover:text-[color:var(--app-ink)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${active ? 'bg-violet/10 text-violet' : 'bg-transparent text-[color:var(--app-ink-mute)] group-hover:text-[color:var(--app-ink)]'}`}>
                    <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  </span>
                  <span className={active ? "font-semibold" : ""}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-bold text-white shadow-sm shadow-coral/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 px-4 pb-4">
          {/* Mode switcher — Segmented Control Style */}
          <div className="mb-4 flex flex-col gap-2 rounded-[18px] bg-slate-200/50 p-1.5">
            <div className="flex w-full items-center justify-between px-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Demo Rol
              </span>
            </div>
            <div className="relative flex w-full gap-1 rounded-xl bg-transparent">
              {(["fan", "athlete", "brand"] as AppRole[]).map((r) => {
                const isActive = role === r;
                const isLoading = demoLoading === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => void handleRoleSwitch(r)}
                    disabled={Boolean(demoLoading)}
                    className={`relative flex-1 rounded-xl py-2 text-[11px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive
                        ? "bg-white text-[color:var(--app-ink)] shadow-sm border border-slate-200/60"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent"
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
              <p className="px-2 pb-1 text-[10px] font-semibold text-coral">{demoError}</p>
            )}
          </div>

          {/* User card — Clean and minimal */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="group flex w-full items-center gap-3 rounded-[18px] border border-transparent bg-transparent p-2 transition-all hover:bg-slate-200/50 hover:border-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50"
          >
            <div className="relative shrink-0">
              <img
                src={session.profile?.avatar_url ?? okculukImg}
                alt=""
                className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[13px] font-semibold leading-tight text-[color:var(--app-ink)] group-hover:text-violet transition-colors">
                {effectiveName}
              </p>
              <p className="truncate text-[11px] font-medium text-[color:var(--app-ink-mute)]">
                {effectiveCity || "Hesap Ayarları"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
          
          {/* User Menu Dropdown (Moved to be near the trigger if it was in the bottom, but the topbar already has the menu. Wait, the sidebar doesn't have a dropdown menu. The old code just had a chevron button but did nothing with it! Let me keep it just as a visual or hook it up to top menu) */}
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="relative flex min-w-0 flex-1 flex-col lg:ml-64">
        {/* Topbar */}
        <header
          className={`${
            topbarOverlay
              ? "absolute left-0 right-0 top-0 border-transparent bg-transparent"
              : "sticky top-0 border-[color:var(--app-line-soft)] bg-[oklch(0.985_0.005_90/0.85)] backdrop-blur-xl"
          } z-20 flex h-16 items-center gap-4 border-b px-5 sm:px-8`}
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet via-indigo to-sky">
              <span className="font-display text-sm font-bold text-white">M</span>
            </span>
            <span className="font-display font-bold tracking-tight">Meydan</span>
          </Link>

          {/* Search */}
          {!hideSearch && (
            <div className="relative ml-auto hidden max-w-md flex-1 sm:block lg:ml-8 lg:mr-auto xl:ml-16">
              <Search
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)]"
                strokeWidth={1.7}
              />
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
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${topbarActionClass}`}
            >
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-coral" />
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 transition-colors ${topbarProfileClass}`}
            >
              <img
                src={session.profile?.avatar_url ?? okculukImg}
                alt=""
                className="h-7 w-7 rounded-lg object-cover object-top"
              />
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none text-[color:var(--app-ink)]">
                  {effectiveName}
                </p>
                <p className="mt-0.5 text-[10px] leading-none text-[color:var(--app-ink-mute)]">
                  {effectiveCity}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[color:var(--app-ink-mute)]" />
            </button>
            {menuOpen && (
              <div className="absolute right-5 top-14 w-48 rounded-2xl border border-[color:var(--app-line)] bg-white p-1.5 shadow-lg sm:right-8">
                {session.isAuthenticated ? (
                  <>
                    <Link
                      to={settingsTarget}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                    >
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
                aria-label={item.label}
                className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 ${
                  active
                    ? "bg-[color:var(--app-ink)] text-white"
                    : "text-[color:var(--app-ink-soft)]"
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
