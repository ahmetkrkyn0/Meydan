import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Pencil, Building2, Tag, Users, MapPin, Wallet, Check, ArrowRight, X, Search, Globe2 } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { brands } from "@/lib/mock-data";
import { CITY_OPTIONS } from "@/lib/form-options";

export const Route = createFileRoute("/marka-panel/profil")({
  component: BrandProfilePage,
  head: () => ({ meta: [{ title: "Marka Profili — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const ALL_VALUES = ["Aile", "Disiplin", "Türkiye", "Gençlik", "Tasarım", "Doğa", "Eğitim", "Macera", "Mühendislik", "Erişim", "Sürdürülebilirlik"];
const ALL_AUDIENCE = ["18-24", "25-34", "35-44", "45-54", "55+"];
const POPULAR_CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep"];
const ALL_TR_CITY = "Tüm Türkiye";

function BrandProfilePage() {
  const brand = brands[0];
  const [values, setValues] = useState<string[]>(brand.values);
  const [ages, setAges] = useState<string[]>(["25-34", "35-44"]);
  const [cities, setCities] = useState<string[]>(brand.targetCity);
  const [citySearch, setCitySearch] = useState("");

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    arr.includes(v) ? set(arr.filter((x) => x !== v)) : set([...arr, v]);

  const allTRSelected = cities.includes(ALL_TR_CITY);
  const toggleAllTR = () => {
    if (allTRSelected) setCities([]);
    else setCities([ALL_TR_CITY]);
  };
  const toggleCity = (c: string) => {
    // "Tüm Türkiye" seçiliyken başka şehir seçilince Tüm Türkiye kalksın.
    const next = cities.includes(c)
      ? cities.filter((x) => x !== c)
      : [...cities.filter((x) => x !== ALL_TR_CITY), c];
    setCities(next);
  };

  const ageAllSelected = ages.length === ALL_AUDIENCE.length;
  const toggleAgeAll = () =>
    setAges(ageAllSelected ? [] : [...ALL_AUDIENCE]);

  const searchResults = citySearch.trim()
    ? CITY_OPTIONS.filter((c) =>
        c.toLocaleLowerCase("tr-TR").includes(citySearch.toLocaleLowerCase("tr-TR")),
      ).slice(0, 8)
    : [];

  return (
    <AppShell role="brand" userName={brand.name} userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-7"
      >
        {/* Header */}
        <motion.header
          variants={fadeUp}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky">Marka profili</p>
            <h1 className="font-display mt-1.5 text-3xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-2 max-w-md text-sm text-[color:var(--app-ink-soft)]">
              Değerlerin AI eşleştirmesinin temelidir. Net olduğunda uyumlu sporcu önerileri daha güçlü gelir.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/marka-panel/profil-olustur"
              className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <Pencil className="h-4 w-4" /> Düzenle
            </Link>
            <Link
              to="/marka-panel/eslesme"
              className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Eşleşmeleri Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.header>

        {/* Identity */}
        <motion.section variants={fadeUp} className="rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
          <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">Kimlik</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <Field icon={Building2} label="Sektör" value={brand.sector} />
            <Field icon={Wallet} label="Aylık bütçe" value={`₺ ${brand.budget.toLocaleString("tr-TR")}`} />
            <Field icon={Users} label="Hedef yaş" value="25-44" />
          </div>
        </motion.section>

        {/* Values */}
        <motion.section variants={fadeUp} className="rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">Marka değerleri</p>
              <h2 className="font-display mt-1 text-lg font-bold text-[color:var(--app-ink)]">
                Hangi değerlerle eşleşmek istersin?
              </h2>
            </div>
            <span className="chip chip-sky">
              <Tag className="h-3 w-3" /> {values.length} seçili
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {ALL_VALUES.map((v) => {
              const active = values.includes(v);
              return (
                <button
                  key={v}
                  onClick={() => toggle(values, setValues, v)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "border-sky bg-sky/12 text-[color:oklch(0.42_0.16_222)]"
                      : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-sky/30 hover:bg-sky/8"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                  {v}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Audience */}
        <motion.section variants={fadeUp} className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Yaş */}
          <div className="rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                <Users className="h-3 w-3" /> Hedef yaş aralığı
              </p>
              <button
                type="button"
                onClick={toggleAgeAll}
                className="text-[10px] font-semibold text-violet hover:underline"
              >
                {ageAllSelected ? "Temizle" : "Tümünü seç"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-2">
              {ALL_AUDIENCE.map((a) => {
                const active = ages.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggle(ages, setAges, a)}
                    aria-pressed={active}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                      active
                        ? "border-violet bg-violet/12 text-violet"
                        : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30 hover:text-[color:var(--app-ink)]"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-[color:var(--app-ink-mute)]">
              {ages.length === 0
                ? "Henüz aralık seçmedin. AI önerileri tüm yaşları kapsar."
                : `Aktif: ${ages.join(", ")}`}
            </p>
          </div>

          {/* Şehirler */}
          <div className="rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                <MapPin className="h-3 w-3" /> Hedef şehirler
              </p>
              <span className="text-[10px] text-[color:var(--app-ink-mute)]">
                {allTRSelected
                  ? "Tüm Türkiye"
                  : cities.length === 0
                    ? "Hiç seçim yok"
                    : `${cities.length} seçili`}
              </span>
            </div>

            {/* Tüm Türkiye geniş kart */}
            <button
              type="button"
              onClick={toggleAllTR}
              aria-pressed={allTRSelected}
              className={`mt-4 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                allTRSelected
                  ? "border-violet bg-violet/10"
                  : "border-[color:var(--app-line)] bg-white hover:border-violet/30 hover:bg-violet/5"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  allTRSelected ? "bg-violet text-white" : "bg-violet/10 text-violet"
                }`}
              >
                <Globe2 className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="flex-1">
                <p className={`text-sm font-bold ${allTRSelected ? "text-violet" : "text-[color:var(--app-ink)]"}`}>
                  Tüm Türkiye
                </p>
                <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                  Ülke genelinde tüm illeri kapsa
                </p>
              </span>
              {allTRSelected && <Check className="h-4 w-4 text-violet" strokeWidth={2.4} />}
            </button>

            {/* Popüler iller */}
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Popüler iller
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {POPULAR_CITIES.map((c) => {
                  const active = cities.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCity(c)}
                      disabled={allTRSelected}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? "border-violet bg-violet/12 text-violet"
                          : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30 hover:text-[color:var(--app-ink)]"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" strokeWidth={2.4} />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Arama */}
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Başka il ekle
              </p>
              <div className="relative mt-2">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--app-ink-mute)]"
                  strokeWidth={1.9}
                />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  disabled={allTRSelected}
                  placeholder="İl ara (örn. Trabzon)"
                  className="w-full rounded-xl border border-[color:var(--app-line)] bg-white py-2.5 pl-10 pr-3 text-sm text-[color:var(--app-ink)] outline-none transition-all placeholder:text-[color:var(--app-ink-mute)] focus:border-violet/40 focus:ring-2 focus:ring-violet/15 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {searchResults.map((c) => {
                    const active = cities.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCity(c)}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          active
                            ? "border-violet bg-violet/12 text-violet"
                            : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30 hover:text-[color:var(--app-ink)]"
                        }`}
                      >
                        {active ? (
                          <Check className="h-3 w-3" strokeWidth={2.4} />
                        ) : (
                          <span className="text-violet">+</span>
                        )}
                        {c}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Seçili olanlar */}
            {!allTRSelected && cities.length > 0 && (
              <div className="mt-5 border-t border-[color:var(--app-line-soft)] pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Seçili iller ({cities.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cities.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-3 py-1.5 text-xs font-semibold text-violet"
                    >
                      <MapPin className="h-3 w-3" /> {c}
                      <button
                        type="button"
                        onClick={() => toggleCity(c)}
                        aria-label={`${c} kaldır`}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-violet/20"
                      >
                        <X className="h-3 w-3" strokeWidth={2.4} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Save */}
        <motion.div variants={fadeUp} className="flex items-center justify-end gap-2">
          <button className="btn-ghost-light rounded-full px-5 py-2.5 text-sm font-medium">Vazgeç</button>
          <button className="btn-primary-light inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold">
            Değişiklikleri Kaydet <Check className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="font-display mt-1 text-lg font-bold text-[color:var(--app-ink)]">{value}</p>
    </div>
  );
}
