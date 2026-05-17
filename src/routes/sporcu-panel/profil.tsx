import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AtSign,
  Camera,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug } from "@/lib/mock-data";
import { updateProfile } from "@/lib/api";
import { useSession } from "@/lib/session";
import { BRANCH_OPTIONS, CITY_OPTIONS } from "@/lib/form-options";

export const Route = createFileRoute("/sporcu-panel/profil")({
  component: AthleteProfilePage,
  head: () => ({ meta: [{ title: "Profilim — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const TABS = [
  { id: "temel", label: "Temel" },
  { id: "basari", label: "Başarılar" },
  { id: "bio", label: "Biyografi" },
  { id: "sosyal", label: "Sosyal Medya" },
];

const VALUE_TAGS = [
  "Disiplin", "Sabır", "Odak", "Aile", "Türkiye", "Cesaret",
  "Mücadele", "Sürat", "Hesap", "Zarafet", "Strateji",
];

const SPORTS = ["Okçuluk", "Tenis", "Bilardo", "Boks", "Atıcılık", "Atletizm", "Güreş", "Yelken"];

function AthleteProfilePage() {
  const session = useSession();
  const queryClient = useQueryClient();
  // Görsel/mock fallback — gerçek profil alanlarında değer yoksa kullanılır.
  const mock = athleteBySlug("nisan-celik");

  const profile = session.profile;
  const initial = useMemo(
    () => ({
      name: profile?.full_name ?? mock.name,
      sport: profile?.branch ?? mock.sport,
      city: profile?.city ?? mock.city,
      bio: profile?.bio ?? mock.bio,
      values: profile?.value_tags?.length ? profile.value_tags : mock.values,
    }),
    [profile, mock],
  );

  const [active, setActive] = useState("temel");
  const [name, setName] = useState(initial.name);
  const [sport, setSport] = useState(initial.sport);
  const [city, setCity] = useState(initial.city);
  const [club, setClub] = useState(mock.club);
  const [age, setAge] = useState(mock.age);
  const [bio, setBio] = useState(initial.bio);
  const [values, setValues] = useState<string[]>(initial.values);
  const [achievements, setAchievements] = useState(mock.achievements);
  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [instagram, setInstagram] = useState(mock.socials.instagram ?? "");
  const [twitter, setTwitter] = useState(mock.socials.twitter ?? "");
  const [youtube, setYoutube] = useState(mock.socials.youtube ?? "");
  const [savedFlash, setSavedFlash] = useState(false);

  // Session yüklendiğinde / değiştiğinde form state'ini güncelle.
  useEffect(() => {
    setName(initial.name);
    setSport(initial.sport);
    setCity(initial.city);
    setBio(initial.bio);
    setValues(initial.values);
  }, [initial]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!profile?.id) throw new Error("Önce giriş yap.");
      return updateProfile(profile.id, {
        full_name: name,
        branch: sport,
        city,
        bio,
        value_tags: values,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", "me"] });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    },
  });

  const addAchievement = () => {
    if (!newYear || !newTitle) return;
    setAchievements([{ year: newYear, title: newTitle }, ...achievements]);
    setNewYear("");
    setNewTitle("");
  };

  const removeAchievement = (i: number) =>
    setAchievements(achievements.filter((_, idx) => idx !== i));

  const toggleValue = (v: string) =>
    values.includes(v) ? setValues(values.filter((x) => x !== v)) : setValues([...values, v]);

  // Auth gate
  if (!session.isLoading && !session.isAuthenticated) {
    return (
      <AppShell role="athlete">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
          <p className="font-display text-2xl font-bold text-[color:var(--app-ink)]">
            Profilini görmek için giriş yap
          </p>
          <Link
            to="/giris"
            className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
          >
            Giriş Yap
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="athlete">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Sporcu paneli · Profil
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)]">
            Profilim
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            Markalar seni burada görür. Değerlerini, hikâyeni, kazandıklarını eksiksiz tut.
          </p>
        </motion.header>

        <motion.nav variants={fadeUp} className="soft-card flex gap-1 rounded-2xl p-1.5">
          {TABS.map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  on
                    ? "bg-violet/12 text-violet"
                    : "text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </motion.nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            <motion.section variants={fadeUp} id="temel" className="flex flex-col gap-5">
              <h2 className="font-display text-lg font-bold text-[color:var(--app-ink)]">Temel bilgiler</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                    Profil fotoğrafı
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[color:var(--app-line)] bg-white p-3">
                    <img
                      src={profile?.avatar_url ?? mock.img}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover object-top"
                    />
                    <div className="flex-1">
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-violet/12 px-3 py-1.5 text-xs font-semibold text-violet">
                        <Camera className="h-3.5 w-3.5" /> Yükle
                      </button>
                      <p className="mt-1.5 text-[10px] text-[color:var(--app-ink-mute)]">
                        PNG / JPG · max 4MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[color:var(--app-ink-soft)]">
                    Banner görseli
                  </label>
                  <div className="flex h-[88px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-mute)]">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-5 w-5" strokeWidth={1.7} />
                      <p className="mt-1 text-[11px]">Banner sürükle ya da tıkla</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="İsim" value={name} onChange={setName} />
                <Field
                  label="Branş"
                  value={sport}
                  onChange={setSport}
                  select={BRANCH_OPTIONS.map((b) => b.value)}
                />
                <Field
                  label="Şehir"
                  value={city}
                  onChange={setCity}
                  select={[...CITY_OPTIONS]}
                />
                <Field label="Kulüp" value={club} onChange={setClub} />
                <Field
                  label="Yaş"
                  value={String(age)}
                  onChange={(v) => setAge(Number(v) || 0)}
                  type="number"
                />
              </div>

              {/* Save button */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {saveMutation.isError && (
                  <p className="rounded-full bg-coral/10 px-3 py-1.5 text-[11px] font-semibold text-coral">
                    {saveMutation.error instanceof Error
                      ? saveMutation.error.message
                      : "Kaydedilemedi"}
                  </p>
                )}
                {savedFlash && (
                  <p className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                    ✓ Profil güncellendi
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || !profile?.id}
                  className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Profili Kaydet
                    </>
                  )}
                </button>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} id="basari" className="flex flex-col gap-4">
              <h2 className="font-display text-lg font-bold text-[color:var(--app-ink)]">Başarılar</h2>

              <div className="grid grid-cols-[100px_1fr_auto] items-end gap-3">
                <Field label="Yıl" value={newYear} onChange={setNewYear} />
                <Field label="Başlık" value={newTitle} onChange={setNewTitle} />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="btn-primary-light inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" /> Ekle
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {achievements.map((a, i) => (
                  <li
                    key={i}
                    className="soft-card flex items-center gap-3 rounded-xl px-4 py-3"
                  >
                    <span className="chip chip-violet">{a.year}</span>
                    <p className="flex-1 text-sm text-[color:var(--app-ink)]">{a.title}</p>
                    <button
                      onClick={() => removeAchievement(i)}
                      className="text-[color:var(--app-ink-mute)] hover:text-coral"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.7} />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section variants={fadeUp} id="bio" className="flex flex-col gap-4">
              <h2 className="font-display text-lg font-bold text-[color:var(--app-ink)]">Biyografi</h2>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="resize-none rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3 text-sm leading-relaxed text-[color:var(--app-ink)] outline-none transition-all focus:border-violet/40 focus:ring-2 focus:ring-violet/15"
              />

              <div>
                <p className="mb-2 text-xs font-semibold text-[color:var(--app-ink-soft)]">
                  Değer haritası
                </p>
                <div className="flex flex-wrap gap-2">
                  {VALUE_TAGS.map((v) => {
                    const on = values.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => toggleValue(v)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          on
                            ? "bg-violet/12 text-violet ring-2 ring-violet/40"
                            : "border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} id="sosyal" className="flex flex-col gap-4">
              <h2 className="font-display text-lg font-bold text-[color:var(--app-ink)]">Sosyal medya</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <SocialField icon={AtSign}         label="Instagram" placeholder="@kullaniciadi" value={instagram} onChange={setInstagram} />
                <SocialField icon={MessageCircle}  label="Twitter / X" placeholder="@kullaniciadi" value={twitter}   onChange={setTwitter} />
                <SocialField icon={Video}          label="YouTube" placeholder="Kanal linki"   value={youtube}   onChange={setYoutube} />
              </div>
            </motion.section>

            <motion.div variants={fadeUp} className="flex justify-end gap-3">
              <button className="btn-ghost-light rounded-2xl px-5 py-3 text-sm font-semibold">
                İptal
              </button>
              <button className="btn-primary-light inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold">
                <Save className="h-4 w-4" /> Kaydet
              </button>
            </motion.div>
          </div>

          <motion.aside variants={fadeUp}>
            <div className="soft-card-strong sticky top-24 overflow-hidden rounded-3xl">
              <div className="relative h-24 bg-gradient-to-br from-violet via-indigo to-sky">
                <div className="absolute inset-0 grid-dots-warm opacity-20" />
              </div>
              <div className="-mt-10 flex flex-col items-center px-5 pb-5">
                <img
                  src={profile?.avatar_url ?? mock.img}
                  alt={name}
                  className="h-20 w-20 rounded-2xl border-4 border-white object-cover object-top shadow-md"
                />
                <p className="mt-3 font-display text-lg font-bold text-[color:var(--app-ink)]">
                  {name || "İsim"}
                </p>
                <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                  {sport} · {city}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {values.slice(0, 4).map((v) => (
                    <span key={v} className="chip chip-violet">{v}</span>
                  ))}
                </div>

                <p className="mt-3 line-clamp-3 text-center text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                  {bio || "Biyografi yazılmadı."}
                </p>

                <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[color:var(--app-line-soft)] py-2">
                    <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
                      0
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">takipçi</p>
                  </div>
                  <div className="rounded-xl bg-[color:var(--app-line-soft)] py-2">
                    <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
                      {achievements.length}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">başarı</p>
                  </div>
                  <div className="rounded-xl bg-[color:var(--app-line-soft)] py-2">
                    <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
                      0
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">destekçi</p>
                  </div>
                </div>
              </div>
              <p className="border-t border-[color:var(--app-line-soft)] py-2.5 text-center text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Canlı önizleme
              </p>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  select,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  select?: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[color:var(--app-ink-soft)]">{label}</span>
      {select ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-violet/40 focus:ring-2 focus:ring-violet/15"
        >
          {select.map((s) => <option key={s}>{s}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--app-ink)] outline-none transition-all focus:border-violet/40 focus:ring-2 focus:ring-violet/15"
        />
      )}
    </label>
  );
}

function SocialField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: typeof AtSign;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[color:var(--app-ink-soft)]">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-[color:var(--app-line)] bg-white px-3.5 py-2.5">
        <Icon className="h-4 w-4 text-[color:var(--app-ink-mute)]" strokeWidth={1.7} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[color:var(--app-ink)] outline-none placeholder:text-[color:var(--app-ink-mute)]"
        />
      </div>
    </label>
  );
}
