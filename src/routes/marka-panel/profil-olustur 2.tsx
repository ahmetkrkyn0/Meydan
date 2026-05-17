import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, MapPin, Target, Wallet, Building2 } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { CITY_OPTIONS } from "@/lib/form-options";

export const Route = createFileRoute("/marka-panel/profil-olustur 2")({
  component: BrandProfileCreate,
  head: () => ({ meta: [{ title: "Marka Profili — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const SECTORS = ["Ev & Yaşam", "Havayolu", "Otomotiv", "Gıda", "Spor giyim", "Bankacılık"];
const VALUES = [
  "Aile", "Disiplin", "Türkiye", "Gençlik", "Doğa", "Tasarım",
  "Erişim", "Eğitim", "Sürdürülebilirlik", "Macera", "Mühendislik",
];
const GENDERS = ["Kadın", "Erkek", "Hepsi"];
const CITIES = CITY_OPTIONS;

const STEPS = [
  { id: 1, label: "Temel", icon: Building2 },
  { id: 2, label: "Değerler", icon: Target },
  { id: 3, label: "Hedef Kitle", icon: MapPin },
  { id: 4, label: "Bütçe", icon: Wallet },
];

function BrandProfileCreate() {
  const [brand, setBrand] = useState("Karaca");
  const [sector, setSector] = useState("Ev & Yaşam");
  const [slogan, setSlogan] = useState("Türk evinin çağdaş dokunuşu.");
  const [values, setValues] = useState<string[]>(["Aile", "Türkiye", "Tasarım"]);
  const [ageMin, setAgeMin] = useState(25);
  const [ageMax, setAgeMax] = useState(45);
  const [gender, setGender] = useState<string[]>(["Hepsi"]);
  const [cities, setCities] = useState<string[]>(["İstanbul", "Ankara"]);
  const [budget, setBudget] = useState(250_000);

  const toggle = <T,>(arr: T[], set: (v: T[]) => void, v: T) =>
    arr.includes(v) ? set(arr.filter((x) => x !== v)) : set([...arr, v]);

  return (
    <AppShell role="brand" userName="Karaca" userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-4xl flex-col gap-10"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Marka paneli · Profil
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)]">
            Marka Profili
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Sporcuların değerlerine en iyi şekilde eşleşebilmek için kim olduğunu anlat.
          </p>
        </motion.header>

        <motion.div variants={fadeUp} className="soft-card rounded-2xl p-3">
          <ol className="flex items-center justify-between gap-2">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky/12 text-sky">
                    <s.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                      Adım {s.id}
                    </p>
                    <p className="truncate text-xs font-semibold text-[color:var(--app-ink)]">
                      {s.label}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="hidden h-px w-6 shrink-0 bg-[color:var(--app-line)] sm:block" />
                )}
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky">01 · Temel</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[color:var(--app-ink)]">
              Markan
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[color:var(--app-ink-soft)]">Marka adı</span>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-sky/40 focus:ring-2 focus:ring-sky/15"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[color:var(--app-ink-soft)]">Sektör</span>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-sky/40 focus:ring-2 focus:ring-sky/15"
              >
                {SECTORS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Slogan <span className="font-normal text-[color:var(--app-ink-mute)]">(opsiyonel)</span>
              </span>
              <input
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Markanı tek cümleyle özetle"
                className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-sky/40 focus:ring-2 focus:ring-sky/15"
              />
            </label>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet">02 · Değerler</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[color:var(--app-ink)]">
              Markanın değerleri
            </h2>
            <p className="mt-0.5 text-sm text-[color:var(--app-ink-soft)]">
              Sporcunun değer haritasıyla bunlar eşleştirilir. 3-5 arası seç.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {VALUES.map((v) => {
              const on = values.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggle(values, setValues, v)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    on
                      ? "bg-violet/12 text-violet ring-2 ring-violet/40"
                      : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30 hover:text-[color:var(--app-ink)]"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-coral">03 · Hedef Kitle</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[color:var(--app-ink)]">
              Kime ulaşmak istiyorsun?
            </h2>
          </div>

          <div className="soft-card rounded-2xl p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                Yaş aralığı
              </p>
              <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
                {ageMin} – {ageMax}
              </p>
            </div>
            <div className="relative mt-4 h-1.5 w-full rounded-full bg-[color:var(--app-line-soft)]">
              <div
                className="absolute top-0 h-1.5 rounded-full bg-sky"
                style={{
                  left: `${((ageMin - 18) / 47) * 100}%`,
                  right: `${100 - ((ageMax - 18) / 47) * 100}%`,
                }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky bg-white shadow-sm"
                style={{ left: `${((ageMin - 18) / 47) * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky bg-white shadow-sm"
                style={{ left: `${((ageMax - 18) / 47) * 100}%` }}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <input
                type="range"
                min={18}
                max={65}
                value={ageMin}
                onChange={(e) => setAgeMin(Math.min(Number(e.target.value), ageMax - 1))}
                className="flex-1 accent-sky"
              />
              <input
                type="range"
                min={18}
                max={65}
                value={ageMax}
                onChange={(e) => setAgeMax(Math.max(Number(e.target.value), ageMin + 1))}
                className="flex-1 accent-sky"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-[color:var(--app-ink-soft)]">Cinsiyet</p>
            <div className="flex gap-2">
              {GENDERS.map((g) => {
                const on = gender.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender([g])}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      on
                        ? "bg-coral/14 text-coral ring-2 ring-coral/40"
                        : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-[color:var(--app-ink-soft)]">Hedef şehirler</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => {
                const on = cities.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(cities, setCities, c)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      on
                        ? "bg-sky/12 text-sky ring-2 ring-sky/40"
                        : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                    }`}
                  >
                    <MapPin className="mr-1 inline-block h-3 w-3" strokeWidth={1.9} />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky">04 · Bütçe</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[color:var(--app-ink)]">
              Aylık kampanya bütçesi
            </h2>
          </div>

          <div className="soft-card rounded-2xl p-5">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-[color:var(--app-ink)]">
                  ₺ {budget.toLocaleString("tr-TR")}
                </span>
                <span className="text-xs text-[color:var(--app-ink-mute)]">/ ay</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={budget}
                  step={10_000}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-32 rounded-xl border border-[color:var(--app-line)] bg-white px-3 py-2 text-right text-sm text-[color:var(--app-ink)] outline-none focus:border-sky/40 focus:ring-2 focus:ring-sky/15"
                />
              </div>
            </div>
            <input
              type="range"
              min={50_000}
              max={1_000_000}
              step={10_000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-5 w-full accent-sky"
            />
            <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              <span>₺ 50K</span>
              <span>₺ 1M</span>
            </div>
          </div>
        </motion.section>

        <motion.div variants={fadeUp} className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-ghost-light rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            Taslak olarak sakla
          </button>
          <Link
            to="/marka-panel/eslesme"
            className="btn-primary-light inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold"
          >
            Kaydet & Eşleşmeleri Gör <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
