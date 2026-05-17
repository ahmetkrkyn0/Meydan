import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";
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
  FileText,
  ImagePlus,
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
  { id: "medya", label: "Belgeler & Galeri" },
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

  // Dosya Yükleme Önizleme State'leri
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [licenseName, setLicenseName] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Dosya Input Referansları
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).slice(0, 6 - galleryPreviews.length).map(f => URL.createObjectURL(f));
      setGalleryPreviews(prev => [...prev, ...newPreviews].slice(0, 6));
    }
  };

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
      <div className="min-h-screen bg-slate-50/30 pb-24 pt-6 md:pt-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto flex w-full max-w-[1150px] flex-col gap-8 px-5 md:px-8"
        >
          {/* Üst Bilgi / Header */}
          <motion.header variants={fadeUp} className="flex flex-col gap-3">
            <div className="inline-flex w-max items-center gap-2 rounded-full bg-indigo-50/80 px-3 py-1.5 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                Sporcu Paneli
              </span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Profil Ayarları
            </h1>
            <p className="max-w-2xl text-[14px] leading-relaxed text-slate-500">
              Markalar ve destekçiler seni burada tanır. Değerlerini, hikâyeni ve başarılarını eksiksiz doldurarak profesyonel imajını öne çıkar.
            </p>
          </motion.header>

          {/* Menü / Tabs */}
          <motion.nav variants={fadeUp} className="sticky top-4 z-10 flex w-full max-w-max items-center gap-1.5 overflow-x-auto rounded-2xl bg-white/80 p-1.5 shadow-sm shadow-slate-200/50 backdrop-blur-md border border-slate-200/60 hide-scrollbar">
            {TABS.map((t) => {
              const on = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActive(t.id);
                    document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`relative whitespace-nowrap rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                    on
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </motion.nav>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
            {/* SOL ALAN / Form Bölümleri */}
            <div className="flex flex-col gap-8 pb-10">
              {/* BÖLÜM: TEMEL BİLGİLER */}
              <motion.section variants={fadeUp} id="temel" className="flex flex-col gap-8 rounded-3xl border border-slate-200/60 bg-white p-7 md:p-9 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <h2 className="font-display text-xl font-bold text-slate-900">Temel Bilgiler</h2>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <AtSign className="h-4 w-4" />
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-slate-700">Profil Fotoğrafı</label>
                    <input type="file" accept="image/*" hidden ref={avatarRef} onChange={(e) => handleFileChange(e, setAvatarPreview)} />
                    <div 
                      onClick={() => avatarRef.current?.click()}
                      className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <img
                        src={avatarPreview || profile?.avatar_url || mock.img}
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
                      />
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-bold text-indigo-600 shadow-sm border border-slate-200 group-hover:border-indigo-200 transition-colors">
                          <Camera className="h-3.5 w-3.5" /> Değiştir
                        </div>
                        <p className="mt-2 text-[11px] font-medium text-slate-400">PNG, JPG (Max 4MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-slate-700">Banner Görseli</label>
                    <input type="file" accept="image/*" hidden ref={bannerRef} onChange={(e) => handleFileChange(e, setBannerPreview)} />
                    <div 
                      onClick={() => bannerRef.current?.click()}
                      className="group relative flex h-full min-h-[100px] overflow-hidden cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      {bannerPreview ? (
                         <img src={bannerPreview} alt="Banner" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
                          <p className="text-[12px] font-medium">Sürükle veya seç</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Ad Soyad" value={name} onChange={setName} />
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
                  <div className="md:col-span-2">
                    <Field
                      label="Yaş"
                      value={String(age)}
                      onChange={(v) => setAge(Number(v) || 0)}
                      type="number"
                    />
                  </div>
                </div>
              </motion.section>

              {/* BÖLÜM: BAŞARILAR */}
              <motion.section variants={fadeUp} id="basari" className="flex flex-col gap-8 rounded-3xl border border-slate-200/60 bg-white p-7 md:p-9 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <h2 className="font-display text-xl font-bold text-slate-900">Kariyer Başarıları</h2>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_auto] items-end gap-3 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                  <Field label="Yıl" value={newYear} onChange={setNewYear} placeholder="Örn: 2024" />
                  <Field label="Başarı / Turnuva" value={newTitle} onChange={setNewTitle} placeholder="Örn: Türkiye Şampiyonası 1.si" />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="mt-2 md:mt-0 inline-flex h-[46px] w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[13px] font-bold text-white transition-all hover:bg-slate-800 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" /> Ekle
                  </button>
                </div>

                {achievements.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {achievements.map((a, i) => (
                      <li
                        key={i}
                        className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] transition-all hover:border-indigo-100 hover:shadow-md"
                      >
                        <span className="flex h-11 min-w-[70px] items-center justify-center rounded-xl bg-indigo-50/80 px-4 font-mono text-[14px] font-bold text-indigo-600 border border-indigo-100">
                          {a.year}
                        </span>
                        <p className="flex-1 text-[15px] font-medium text-slate-800">{a.title}</p>
                        <button
                          onClick={() => removeAchievement(i)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 opacity-100 md:opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          aria-label="Sil"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center bg-slate-50/50">
                    <p className="text-[14px] font-semibold text-slate-600">Henüz başarı eklemedin.</p>
                    <p className="mt-1 text-[13px] text-slate-400">Kariyerindeki önemli anları paylaşarak hemen öne çık.</p>
                  </div>
                )}
              </motion.section>

              {/* BÖLÜM: BİYOGRAFİ & DEĞERLER */}
              <motion.section variants={fadeUp} id="bio" className="flex flex-col gap-8 rounded-3xl border border-slate-200/60 bg-white p-7 md:p-9 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <h2 className="font-display text-xl font-bold text-slate-900">Hikayen ve Değerlerin</h2>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-slate-700">Hakkımda</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    placeholder="Kendinden, spor geçmişinden ve kariyer hedeflerinden bahset..."
                    className="resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-[14px] leading-relaxed text-slate-900 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <p className="mb-4 text-[13px] font-bold text-slate-700">Seni Anlatan Değerler</p>
                  <div className="flex flex-wrap gap-2.5">
                    {VALUE_TAGS.map((v) => {
                      const on = values.includes(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => toggleValue(v)}
                          className={`rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                            on
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200/60 scale-105"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.section>

              {/* BÖLÜM: BELGELER & GALERİ */}
              <motion.section variants={fadeUp} id="medya" className="flex flex-col gap-8 rounded-3xl border border-slate-200/60 bg-white p-7 md:p-9 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <h2 className="font-display text-xl font-bold text-slate-900">Belgeler & Galeri</h2>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <FileText className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex flex-col gap-8">
                  {/* Lisans Yükleme */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-slate-700">Sporcu Lisansı</label>
                    <input type="file" accept=".pdf,image/*" hidden ref={licenseRef} onChange={(e) => {
                      const f = e.target.files?.[0];
                      if(f) setLicenseName(f.name);
                    }} />
                    <div 
                      onClick={() => licenseRef.current?.click()}
                      className="group flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110 ${licenseName ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                        <FileText className={`h-4 w-4 transition-colors ${licenseName ? 'text-indigo-600' : 'group-hover:text-indigo-500'}`} />
                      </div>
                      <p className={`text-[13px] font-bold transition-colors ${licenseName ? 'text-indigo-700' : 'text-slate-600 group-hover:text-indigo-600'}`}>
                        {licenseName || "Lisans belgesini seçin veya sürükleyin"}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">
                        {licenseName ? "Belge seçildi, kaydetmeyi unutmayın." : "PDF, PNG, JPG (Onaylı profil için gereklidir)"}
                      </p>
                    </div>
                  </div>

                  {/* Fotoğraf Galerisi */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-slate-700">Maç & Antrenman Fotoğrafları</label>
                      <span className="text-[11px] font-medium text-slate-400">Max 6 fotoğraf ({galleryPreviews.length}/6)</span>
                    </div>
                    <input type="file" accept="image/*" multiple hidden ref={galleryRef} onChange={handleGalleryChange} />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {/* Ekle Butonu */}
                      {galleryPreviews.length < 6 && (
                        <div 
                          onClick={() => galleryRef.current?.click()}
                          className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
                        >
                          <ImagePlus className="h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500" />
                          <span className="mt-2 text-[11px] font-bold text-slate-500 transition-colors group-hover:text-indigo-600">Fotoğraf Ekle</span>
                        </div>
                      )}
                      
                      {/* Yüklenen Fotoğraflar */}
                      {galleryPreviews.map((src, i) => (
                        <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                          <img src={src} alt="Galeri" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Örnek Mock Fotoğraflar (eğer galeri boşsa gösterelim) */}
                      {galleryPreviews.length === 0 && (
                         <>
                           <div className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                             <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=300&h=300" alt="Galeri Örnek" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 mix-blend-luminosity" />
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
                               <span className="text-[10px] font-bold bg-black/50 px-2 py-1 rounded">Örnek Görünüm</span>
                             </div>
                           </div>
                         </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* BÖLÜM: SOSYAL MEDYA */}
              <motion.section variants={fadeUp} id="sosyal" className="flex flex-col gap-8 rounded-3xl border border-slate-200/60 bg-white p-7 md:p-9 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <h2 className="font-display text-xl font-bold text-slate-900">Sosyal Medya</h2>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                    <AtSign className="h-4 w-4" />
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <SocialField icon={AtSign} label="Instagram" placeholder="@kullaniciadi" value={instagram} onChange={setInstagram} />
                  <SocialField icon={MessageCircle} label="Twitter / X" placeholder="@kullaniciadi" value={twitter} onChange={setTwitter} />
                  <SocialField icon={Video} label="YouTube" placeholder="Kanal linki" value={youtube} onChange={setYoutube} />
                </div>
              </motion.section>
            </div>

            {/* SAĞ PANEL: CANLI ÖNİZLEME & KAYDET */}
            <motion.aside variants={fadeUp} className="relative z-0">
              <div className="sticky top-24 flex flex-col gap-6">
                
                {/* KAYDET BUTONU KARTI */}
                <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <h3 className="font-display text-xl font-bold text-slate-900">Değişiklikler</h3>
                    <p className="mt-1 text-[13px] text-slate-500">Profilini güncel tutarak daha fazla etkileşim al.</p>
                  </div>
                  
                  {saveMutation.isError && (
                    <div className="mb-5 rounded-xl bg-red-50 p-3.5 text-[13px] font-semibold text-red-600 border border-red-100">
                      {saveMutation.error instanceof Error ? saveMutation.error.message : "Kaydedilemedi"}
                    </div>
                  )}
                  {savedFlash && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-[13px] font-semibold text-emerald-700 border border-emerald-100">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Profil başarıyla güncellendi!
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending || !profile?.id}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-[14px] font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" /> Değişiklikleri Kaydet
                      </>
                    )}
                  </button>
                </div>

                {/* CANLI ÖNİZLEME KARTI */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                  {/* Banner */}
                  <div className="relative h-24 w-full bg-slate-900 overflow-hidden">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#ec4899)] opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      </>
                    )}
                  </div>
                  
                  <div className="-mt-12 flex flex-col items-center px-6 pb-8">
                    {/* Profil Resmi */}
                    <div className="relative">
                      <img
                        src={avatarPreview || profile?.avatar_url || mock.img}
                        alt={name}
                        className="h-24 w-24 rounded-full border-[4px] border-white bg-white object-cover object-top shadow-sm"
                      />
                      {/* Verified Badge */}
                      <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-white">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col items-center text-center">
                      <h3 className="font-display text-[22px] font-extrabold tracking-tight text-slate-900">{name || "İsim Soyisim"}</h3>
                      <p className="mt-1 text-[13px] font-semibold text-slate-500">
                        {sport} <span className="mx-1.5 text-slate-300">•</span> {city}
                      </p>
                    </div>

                    <p className="mt-4 line-clamp-2 text-center text-[13px] leading-relaxed text-slate-600">
                      {bio || "Biyografi alanını doldurarak kendini tanıt."}
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                      {values.slice(0, 3).map((v) => (
                        <span key={v} className="rounded-full bg-slate-100/80 px-3.5 py-1.5 text-[11px] font-bold text-slate-600">
                          {v}
                        </span>
                      ))}
                      {values.length > 3 && (
                        <span className="rounded-full bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-400">
                          +{values.length - 3}
                        </span>
                      )}
                    </div>

                    {/* İstatistikler (Tek satır, ayraçlı) */}
                    <div className="mt-7 flex w-full items-center justify-center divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/50 py-3">
                      <div className="flex flex-1 flex-col items-center justify-center">
                        <p className="font-display text-lg font-extrabold text-slate-900">12k</p>
                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">Takipçi</p>
                      </div>
                      <div className="flex flex-1 flex-col items-center justify-center">
                        <p className="font-display text-lg font-extrabold text-slate-900">{achievements.length}</p>
                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">Başarı</p>
                      </div>
                      <div className="flex flex-1 flex-col items-center justify-center">
                        <p className="font-display text-lg font-extrabold text-slate-900">4</p>
                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">Sponsor</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 bg-slate-50/30 py-3 text-center">
                    <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      </span>
                      Canlı Önizleme
                    </p>
                  </div>
                </div>

              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  select,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  select?: string[];
  placeholder?: string;
}) {
  return (
    <label className="group flex flex-col gap-2.5">
      <span className="text-[13px] font-bold text-slate-700 transition-colors group-focus-within:text-indigo-600">
        {label}
      </span>
      {select ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-[14px] font-semibold text-slate-900 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            {select.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-[14px] font-semibold text-slate-900 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 placeholder:font-medium"
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
    <label className="group flex flex-col gap-2.5">
      <span className="text-[13px] font-bold text-slate-700 transition-colors group-focus-within:text-sky-500">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 transition-all hover:bg-slate-50 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10">
        <Icon className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-sky-500" strokeWidth={2} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[14px] font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}
