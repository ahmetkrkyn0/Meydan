import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Pencil, Building2, Tag, Users, MapPin, Wallet, Check, ArrowRight } from "lucide-react";
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
const ALL_CITIES = ["Tüm Türkiye", ...CITY_OPTIONS] as const;

function BrandProfilePage() {
  const brand = brands[0];
  const [values, setValues] = useState<string[]>(brand.values);
  const [ages, setAges] = useState<string[]>(["25-34", "35-44"]);
  const [cities, setCities] = useState<string[]>(brand.targetCity);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    arr.includes(v) ? set(arr.filter((x) => x !== v)) : set([...arr, v]);

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
        <motion.section variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">Hedef yaş aralığı</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ALL_AUDIENCE.map((a) => {
                const active = ages.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggle(ages, setAges, a)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-violet bg-violet/12 text-violet"
                        : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">Hedef şehirler</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ALL_CITIES.map((c) => {
                const active = cities.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(cities, setCities, c)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-violet bg-violet/12 text-violet"
                        : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:border-violet/30"
                    }`}
                  >
                    <MapPin className="h-3 w-3" /> {c}
                  </button>
                );
              })}
            </div>
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
