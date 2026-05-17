import okculukImg from "@/assets/athlete-okculuk-kadin.png";
import tenisImg from "@/assets/athlete-tenis-kadin.png";
import bilardoImg from "@/assets/athlete-bilardo-erkek.png";
import boksImg from "@/assets/athlete-boks-kadin.png";
import atletizmImg from "@/assets/athlete-atletizm-erkek.png";
import guresImg from "@/assets/athlete-gures-erkek.png";
import yelkenImg from "@/assets/athlete-yelken-kadin.png";
import satrancImg from "@/assets/athlete-satranc-erkek.png";
import voleybolImg from "@/assets/athlete-voleybol-kadin.png";
import eskrimImg from "@/assets/athlete-eskrim-kadin.png";
import meteGazozImg from "@/assets/metegazoz.png";
import buseNazImg from "@/assets/busenaz.png";
import sureyyaDemirImg from "@/assets/athlete-lina.jpg";
import yusufDikecImg from "@/assets/athlete-kerem.jpg";
import archeryPng from "@/assets/sport-archery-nobg.png";
import basketballPng from "@/assets/sport-basketball-nobg.png";
import billiardsPng from "@/assets/sport-billiards-nobg.png";
import tennisPng from "@/assets/sport-tennis-nobg.png";

// Branş bazlı saha/atmosfer görselleri — etkinlik kartı ve harita preview'i için.
import tennisVenue from "@/assets/tenissaha.png";
import archeryVenue from "@/assets/okçulukalan.png";
import boxingVenue from "@/assets/bokssaha.png";
import volleyballVenue from "@/assets/voleybolsaha.png";
import fencingVenue from "@/assets/eskrimarena.png";
import wrestlingVenue from "@/assets/güreşarena.png";
import runningVenue from "@/assets/koşusaha.png";
import billiardsVenue from "@/assets/bilardomasa.png";
import shootingVenue from "@/assets/atıcısaha.png";
import chessVenue from "@/assets/satrançsaha.png";
import sailingVenue from "@/assets/yelkenfoto.png";

export const sportImages: Record<string, string> = {
  Tenis: tennisVenue,
  Okçuluk: archeryVenue,
  Boks: boxingVenue,
  Voleybol: volleyballVenue,
  Eskrim: fencingVenue,
  Güreş: wrestlingVenue,
  Atletizm: runningVenue,
  Bilardo: billiardsVenue,
  Atıcılık: shootingVenue,
  Satranç: chessVenue,
  Yelken: sailingVenue,
  Basketbol: volleyballVenue, // fallback — basketbol görseli yoksa salon
};

export function getSportImage(sport?: string | null): string {
  if (!sport) return runningVenue;
  return sportImages[sport] ?? runningVenue;
}

export type Accent = "violet" | "sky" | "coral" | "emerald";

export type Athlete = {
  id: string;
  slug: string;
  name: string;
  sport: string;
  sportEmoji: string;
  city: string;
  age: number;
  gender: "K" | "E";
  club: string;
  rank: { national: number; world?: number };
  followers: number;
  supporters: number;
  monthlySupport: number;
  bio: string;
  values: string[];
  img: string;
  cutout: string;
  accent: Accent;
  alive: boolean;
  trend: string;
  socials: { instagram?: string; twitter?: string; youtube?: string };
  achievements: { year: string; title: string }[];
  nextEvent?: { date: string; title: string; city: string };
  lastResults: { opponent: string; result: "W" | "L"; score: string }[];
};

export const athletes: Athlete[] = [
  {
    id: "a1",
    slug: "nisan-celik",
    name: "Nisan Çelik",
    sport: "Okçuluk",
    sportEmoji: "🏹",
    city: "İstanbul",
    age: 24,
    gender: "K",
    club: "İstanbul Ok Spor Kulübü",
    rank: { national: 1, world: 8 },
    followers: 12_400,
    supporters: 2_103,
    monthlySupport: 18_400,
    bio: "Nişangahta sessizlik bulur. Her ok biraz daha yakın.",
    values: ["Disiplin", "Sabır", "Odak"],
    img: okculukImg,
    cutout: archeryPng,
    accent: "violet",
    alive: true,
    trend: "+12%",
    socials: { instagram: "@nisancelik" },
    achievements: [
      { year: "2022", title: "Türkiye Şampiyonası Altın" },
      { year: "2023", title: "Avrupa Şampiyonası Gümüş" },
      { year: "2024", title: "Dünya Kupası Finali" },
    ],
    nextEvent: { date: "25 May", title: "Avrupa Şampiyonası Finali", city: "Budapeşte" },
    lastResults: [
      { opponent: "B. Ellison", result: "W", score: "6-4" },
      { opponent: "K. Min Hee", result: "W", score: "7-3" },
      { opponent: "M. Furukawa", result: "L", score: "5-6" },
    ],
  },
  {
    id: "a2",
    slug: "defne-arslan",
    name: "Defne Arslan",
    sport: "Tenis",
    sportEmoji: "🎾",
    city: "Ankara",
    age: 22,
    gender: "K",
    club: "Ankara Tenis İhtisas",
    rank: { national: 1, world: 87 },
    followers: 8_700,
    supporters: 1_567,
    monthlySupport: 12_300,
    bio: "Toprak kortta doğmuş gibi hisseder. Rakete her dokunuşta bir söz verir.",
    values: ["Cesaret", "Mücadele", "Sürat"],
    img: tenisImg,
    cutout: tennisPng,
    accent: "sky",
    alive: true,
    trend: "+15%",
    socials: { instagram: "@defnearslan" },
    achievements: [
      { year: "2022", title: "İlk WTA Galibiyeti" },
      { year: "2024", title: "Wimbledon 2. Tur" },
    ],
    nextEvent: { date: "02 Haz", title: "Roland Garros Eleme", city: "Paris" },
    lastResults: [
      { opponent: "I. Świątek", result: "L", score: "3-6 4-6" },
      { opponent: "L. Boulter", result: "W", score: "6-2 6-4" },
      { opponent: "A. Bouzkova", result: "W", score: "7-5 6-1" },
    ],
  },
  {
    id: "a3",
    slug: "tayfun-keskin",
    name: "Tayfun Keskin",
    sport: "Bilardo",
    sportEmoji: "🎱",
    city: "İzmir",
    age: 31,
    gender: "E",
    club: "Ege Bilardo Akademi",
    rank: { national: 2, world: 7 },
    followers: 4_200,
    supporters: 932,
    monthlySupport: 7_800,
    bio: "Sessiz salonların hesabı. Üç bant geometrisini rüyasında çözer.",
    values: ["Hesap", "Sabır", "Zarafet"],
    img: bilardoImg,
    cutout: billiardsPng,
    accent: "coral",
    alive: true,
    trend: "+24%",
    socials: { instagram: "@tayfunkeskin" },
    achievements: [
      { year: "2023", title: "Türkiye Şampiyonu" },
      { year: "2024", title: "Dünya 3 Bant 7." },
    ],
    nextEvent: { date: "01 Haz", title: "Dünya Kupası — Antalya", city: "Antalya" },
    lastResults: [
      { opponent: "T. Jaspers", result: "L", score: "30-40" },
      { opponent: "D. Sayginer", result: "W", score: "40-21" },
      { opponent: "F. Caudron", result: "W", score: "40-35" },
    ],
  },
  {
    id: "a4",
    slug: "emre-sahin",
    name: "Emre Şahin",
    sport: "Güreş",
    sportEmoji: "🤼",
    city: "Bursa",
    age: 26,
    gender: "E",
    club: "Bursa Büyükşehir Güreş",
    rank: { national: 1, world: 5 },
    followers: 9_800,
    supporters: 1_420,
    monthlySupport: 8_600,
    bio: "Minderde sakin, rakibe karşı fırtına. Toprağın ruhunu taşıyor.",
    values: ["Güç", "Denge", "Sabır"],
    img: guresImg,
    cutout: archeryPng,
    accent: "violet",
    alive: true,
    trend: "+9%",
    socials: { instagram: "@emresahin" },
    achievements: [
      { year: "2022", title: "Türkiye Şampiyonu" },
      { year: "2023", title: "Avrupa Şampiyonası Bronz" },
      { year: "2024", title: "Dünya Kupası Yarı Final" },
    ],
    nextEvent: { date: "22 Haz", title: "Bursa Üniversite Güreşi", city: "Bursa" },
    lastResults: [
      { opponent: "A. Sharov", result: "W", score: "Final" },
      { opponent: "B. Tadic", result: "W", score: "Yarı" },
      { opponent: "R. Murtazaliev", result: "L", score: "Çeyrek" },
    ],
  },
  {
    id: "a5",
    slug: "seda-yilmaz",
    name: "Seda Yılmaz",
    sport: "Boks",
    sportEmoji: "🥊",
    city: "İzmit",
    age: 25,
    gender: "K",
    club: "Kocaeli Boks Kulübü",
    rank: { national: 1, world: 6 },
    followers: 11_200,
    supporters: 1_450,
    monthlySupport: 11_600,
    bio: "Ringte her nefes bir strateji. Göründüğünden çok daha hızlı.",
    values: ["Cesaret", "Direnç", "Strateji"],
    img: boksImg,
    cutout: basketballPng,
    accent: "coral",
    alive: true,
    trend: "+18%",
    socials: { instagram: "@sedayilmaz" },
    achievements: [
      { year: "2023", title: "Türkiye Şampiyonu" },
      { year: "2024", title: "Avrupa Şampiyonası Gümüş" },
    ],
    nextEvent: { date: "20 Haz", title: "Avrupa Şampiyonası", city: "Belgrad" },
    lastResults: [
      { opponent: "B. Philon", result: "L", score: "Final" },
      { opponent: "N. Kim", result: "W", score: "Yarı" },
    ],
  },
  {
    id: "a6",
    slug: "alp-karadeniz",
    name: "Alp Karadeniz",
    sport: "Atletizm",
    sportEmoji: "🏃",
    city: "Eskişehir",
    age: 24,
    gender: "E",
    club: "Eskişehir Atletizm İhtisas",
    rank: { national: 1, world: 19 },
    followers: 3_100,
    supporters: 412,
    monthlySupport: 4_400,
    bio: "Üç adım atlama ritmi kafasında çalar. Pist, ter, sabah karanlığı.",
    values: ["Ritim", "Sabır", "Sürat"],
    img: atletizmImg,
    cutout: basketballPng,
    accent: "emerald",
    alive: false,
    trend: "+4%",
    socials: { instagram: "@alpkaradeniz" },
    achievements: [
      { year: "2022", title: "Akdeniz Oyunları Altın" },
      { year: "2024", title: "Türkiye Rekoru" },
    ],
    lastResults: [
      { opponent: "—", result: "W", score: "17.18 m" },
    ],
  },
  {
    id: "a7",
    slug: "cem-kaan-gokerkan",
    name: "Cem Kaan Gökerkan",
    sport: "Satranç",
    sportEmoji: "♟️",
    city: "İstanbul",
    age: 22,
    gender: "E",
    club: "İstanbul Satranç Kulübü",
    rank: { national: 1, world: 42 },
    followers: 6_300,
    supporters: 780,
    monthlySupport: 5_200,
    bio: "Tahtada her hamle bir hikâye. Türk satrancının genç dehası.",
    values: ["Strateji", "Sabır", "Analiz"],
    img: satrancImg,
    cutout: archeryPng,
    accent: "violet",
    alive: true,
    trend: "+21%",
    socials: { instagram: "@cemkaangokerkan" },
    achievements: [
      { year: "2022", title: "Türkiye Gençler Şampiyonu" },
      { year: "2023", title: "FIDE Rating 2450" },
      { year: "2024", title: "Avrupa Gençler 3." },
    ],
    nextEvent: { date: "15 Haz", title: "İstanbul Açık Turnuvası", city: "İstanbul" },
    lastResults: [
      { opponent: "V. Anand", result: "W", score: "1-0" },
      { opponent: "F. Caruana", result: "L", score: "0-1" },
      { opponent: "M. Carlsen", result: "W", score: "1/2" },
    ],
  },
];

export const athleteBySlug = (slug: string) =>
  athletes.find((a) => a.slug === slug) ?? athletes[0];

/* ============================================================
 * SPORTS / BRANCHES
 * ============================================================ */
export type Sport = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  athleteCount: number;
  trending: boolean;
  accent: Accent;
};

export const sports: Sport[] = [
  { id: "okculuk",   name: "Okçuluk",  emoji: "🏹", description: "Sessiz odak, eski bir disiplin.",        athleteCount: 24, trending: true,  accent: "violet" },
  { id: "tenis",     name: "Tenis",    emoji: "🎾", description: "Topla zekanın sahnesi.",                  athleteCount: 38, trending: true,  accent: "sky" },
  { id: "bilardo",   name: "Bilardo",  emoji: "🎱", description: "Açıların ve sabrın oyunu.",                athleteCount: 14, trending: false, accent: "coral" },
  { id: "boks",      name: "Boks",     emoji: "🥊", description: "Ringin sessiz kıvılcımı.",                 athleteCount: 22, trending: true,  accent: "coral" },
  { id: "atletizm",  name: "Atletizm", emoji: "🏃", description: "Pist, ter ve sabah karanlığı.",            athleteCount: 56, trending: false, accent: "emerald" },
  { id: "guresh",    name: "Güreş",    emoji: "🤼", description: "Türk sporunun en eski meydanı.",           athleteCount: 32, trending: false, accent: "coral" },
  { id: "yelken",    name: "Yelken",   emoji: "⛵", description: "Rüzgârla pazarlık, mavi disiplin.",        athleteCount: 11, trending: true,  accent: "sky" },
  { id: "satranc",   name: "Satranç",  emoji: "♟️", description: "Hareketsiz mücadele.",                     athleteCount: 19, trending: false, accent: "violet" },
  { id: "voleybol",  name: "Voleybol", emoji: "🏐", description: "Filenin kız ve erkek sultanları.",         athleteCount: 44, trending: true,  accent: "sky" },
  { id: "eskrim",    name: "Eskrim",   emoji: "🤺", description: "Bilek, refleks, zarafet.",                 athleteCount: 9,  trending: false, accent: "violet" },
];

/* ============================================================
 * EVENTS — Cities, dates, sports
 * ============================================================ */
export type Event = {
  id: string;
  title: string;
  sport: string;
  emoji: string;
  city: string;
  district: string;
  date: string;
  day: string;
  month: string;
  time: string;
  free: boolean;
  cap: number;
  attending: number;
  description: string;
  coords: { x: number; y: number }; // map mock position 0-100
  latitude?: number; // gerçek coğrafi konum (backend'den gelir)
  longitude?: number;
  // Fiyat (TL). Free=true ise 0. Fiyat aralığı filtreleri bu alana göre çalışır.
  priceTL: number;
  // Branş bazlı saha/atmosfer görseli — kart ve harita hover preview'i için.
  image: string;
};

export const events: Event[] = [
  { id: "e1",  title: "İstanbul Yarı Maratonu",        sport: "Atletizm",  emoji: "🏃", city: "İstanbul",  district: "Maltepe",       date: "2026-05-25", day: "25", month: "MAY", time: "08:00", free: true,  cap: 5000, attending: 4350, description: "21 km sahil rotası.",             coords: { x: 60, y: 38 }, latitude: 40.9351, longitude: 29.1543, priceTL: 0,    image: runningVenue },
  { id: "e2",  title: "Okçuluk Başlangıç Atölyesi",    sport: "Okçuluk",   emoji: "🏹", city: "İstanbul",  district: "Kadıköy",       date: "2026-05-28", day: "28", month: "MAY", time: "14:00", free: false, cap: 30,   attending: 10,   description: "Sıfırdan ok atışı dersi.",        coords: { x: 62, y: 39 }, latitude: 40.9923, longitude: 29.0274, priceTL: 350,  image: archeryVenue },
  { id: "e3",  title: "Türkiye Satranç Şampiyonası",   sport: "Satranç",   emoji: "♟️", city: "Ankara",    district: "Çankaya",       date: "2026-05-22", day: "22", month: "MAY", time: "10:00", free: true,  cap: 5000, attending: 4350, description: "TSF Ankara Salonu finalleri.",    coords: { x: 56, y: 50 }, latitude: 39.9208, longitude: 32.8541, priceTL: 0,    image: chessVenue },
  { id: "e4",  title: "Bodrum Sahil Yelken Kupası",    sport: "Yelken",    emoji: "⛵", city: "Bodrum",    district: "Yalıkavak",     date: "2026-06-07", day: "07", month: "HAZ", time: "11:00", free: false, cap: 80,   attending: 73,   description: "Açık deniz parkur yarışı.",       coords: { x: 48, y: 80 }, latitude: 37.0805, longitude: 27.3245, priceTL: 850,  image: sailingVenue },
  { id: "e5",  title: "Avrupa Okçuluk Şampiyonası",    sport: "Okçuluk",   emoji: "🏹", city: "İzmir",     district: "Konak",         date: "2026-06-15", day: "15", month: "HAZ", time: "13:30", free: true,  cap: 1200, attending: 980,  description: "Avrupa'nın 28 takımı İzmir'de.",  coords: { x: 44, y: 60 }, latitude: 38.4189, longitude: 27.1284, priceTL: 0,    image: archeryVenue },
  { id: "e6",  title: "Bursa Üniversite Güreşi",       sport: "Güreş",     emoji: "🤼", city: "Bursa",     district: "Osmangazi",     date: "2026-06-22", day: "22", month: "HAZ", time: "16:00", free: true,  cap: 400,  attending: 152,  description: "Üniversiteler birinciliği.",      coords: { x: 53, y: 44 }, latitude: 40.1956, longitude: 29.0610, priceTL: 0,    image: wrestlingVenue },
  { id: "e7",  title: "Eskişehir Eskrim Showcase",     sport: "Eskrim",    emoji: "🤺", city: "Eskişehir", district: "Tepebaşı",      date: "2026-06-30", day: "30", month: "HAZ", time: "18:00", free: false, cap: 250,  attending: 38,   description: "Genç eskrimciler showcase.",      coords: { x: 55, y: 47 }, latitude: 39.7836, longitude: 30.5067, priceTL: 200,  image: fencingVenue },

  /* ── Ankara — 8 ek etkinlik, farklı branş & fiyat aralığı, harita için
   *    şehir merkezi etrafında dağıtılmış koordinatlarla ── */
  { id: "ank1", title: "Ankara Açık Tenis Turnuvası",     sport: "Tenis",     emoji: "🎾", city: "Ankara", district: "Bilkent",       date: "2026-05-30", day: "30", month: "MAY", time: "09:00", free: false, cap: 320,  attending: 198,  description: "Dış kortlarda 3 günlük turnuva.",  coords: { x: 56, y: 50 }, latitude: 39.8682, longitude: 32.7491, priceTL: 450,  image: tennisVenue },
  { id: "ank2", title: "Başkent Yarı Maratonu",           sport: "Atletizm",  emoji: "🏃", city: "Ankara", district: "Çankaya",       date: "2026-06-02", day: "02", month: "HAZ", time: "07:30", free: true,  cap: 8000, attending: 6420, description: "Anıtkabir önünden çıkış, 21 km.",  coords: { x: 56, y: 51 }, latitude: 39.9255, longitude: 32.8369, priceTL: 0,    image: runningVenue },
  { id: "ank3", title: "TBMM Cup — Voleybol",             sport: "Voleybol",  emoji: "🏐", city: "Ankara", district: "Yenimahalle",   date: "2026-06-05", day: "05", month: "HAZ", time: "18:00", free: false, cap: 1500, attending: 920,  description: "Kurumlar arası dostluk kupası.",   coords: { x: 56, y: 49 }, latitude: 39.9626, longitude: 32.7975, priceTL: 150,  image: volleyballVenue },
  { id: "ank4", title: "Anadolu Boks Galası",             sport: "Boks",      emoji: "🥊", city: "Ankara", district: "Keçiören",      date: "2026-06-08", day: "08", month: "HAZ", time: "20:00", free: false, cap: 1100, attending: 880,  description: "Profesyonel ringde 12 maç.",       coords: { x: 56, y: 49 }, latitude: 39.9941, longitude: 32.8633, priceTL: 1200, image: boxingVenue },
  { id: "ank5", title: "Ankara Bilardo Open",             sport: "Bilardo",   emoji: "🎱", city: "Ankara", district: "Çankaya",       date: "2026-06-11", day: "11", month: "HAZ", time: "19:00", free: false, cap: 200,  attending: 134,  description: "3-bant ulusal derece maçları.",    coords: { x: 56, y: 50 }, latitude: 39.9056, longitude: 32.8584, priceTL: 250,  image: billiardsVenue },
  { id: "ank6", title: "Kızılay Atıcılık Şampiyonası",    sport: "Atıcılık",  emoji: "🎯", city: "Ankara", district: "Çankaya",       date: "2026-06-14", day: "14", month: "HAZ", time: "11:00", free: false, cap: 180,  attending: 96,   description: "10 m havalı tabanca finalleri.",   coords: { x: 56, y: 50 }, latitude: 39.9181, longitude: 32.8553, priceTL: 350,  image: shootingVenue },
  { id: "ank7", title: "Başkent Okçuluk Kupası",          sport: "Okçuluk",   emoji: "🏹", city: "Ankara", district: "Gölbaşı",       date: "2026-06-18", day: "18", month: "HAZ", time: "13:00", free: false, cap: 400,  attending: 210,  description: "Olimpik 70 m kategorisi.",         coords: { x: 56, y: 51 }, latitude: 39.7878, longitude: 32.8092, priceTL: 200,  image: archeryVenue },
  { id: "ank8", title: "ODTÜ Genç Eskrim Galası",         sport: "Eskrim",    emoji: "🤺", city: "Ankara", district: "Çankaya",       date: "2026-06-21", day: "21", month: "HAZ", time: "17:00", free: true,  cap: 300,  attending: 142,  description: "Üniversite kulüpleri showcase.",   coords: { x: 56, y: 50 }, latitude: 39.8923, longitude: 32.7841, priceTL: 0,    image: fencingVenue },
];

/* ============================================================
 * LIVE MATCHES
 * ============================================================ */
export type Match = {
  id: string;
  athleteSlug: string;
  athleteName: string;
  athleteImg: string;
  athleteFlag?: string;
  opponent: string;
  opponentFlag: string;
  sport: string;
  emoji: string;
  status: "live" | "soon" | "ended";
  startsAt: string;
  score?: string;
  setScore?: string;
  viewers: number;
  cheers: number;
  momentum: number;
};

export const liveMatches: Match[] = [
  /* ── Canlı (5) ── */
  { id: "m1", athleteSlug: "zeynep-sonmez",        athleteName: "Zeynep Sönmez",        athleteImg: tenisImg,       athleteFlag: "tr", opponent: "Maria Sakkari",   opponentFlag: "gr", sport: "Tenis",    emoji: "🎾", status: "live", startsAt: "Şimdi", score: "1-0",  setScore: "5-3", viewers: 1_240, cheers: 320,  momentum: 72 },
  { id: "m2", athleteSlug: "buse-naz-cakiroglu",   athleteName: "Buse Naz Çakıroğlu",   athleteImg: buseNazImg,     athleteFlag: "tr", opponent: "Buse Philon",     opponentFlag: "fr", sport: "Boks",     emoji: "🥊", status: "live", startsAt: "Şimdi", score: "2-1",  setScore: "R3",  viewers: 2_180, cheers: 540,  momentum: 64 },
  { id: "m3", athleteSlug: "mete-gazoz",            athleteName: "Mete Gazoz",            athleteImg: meteGazozImg,   athleteFlag: "tr", opponent: "Kim Woo-jin",     opponentFlag: "kr", sport: "Okçuluk",  emoji: "🏹", status: "live", startsAt: "Şimdi", score: "5-4",  setScore: "1/4", viewers: 3_460, cheers: 1_120,momentum: 81 },
  { id: "m4", athleteSlug: "necati-er",             athleteName: "Necati Er",             athleteImg: atletizmImg,    athleteFlag: "tr", opponent: "Pedro Pichardo",  opponentFlag: "pt", sport: "Atletizm", emoji: "🏃", status: "live", startsAt: "Şimdi", score: "17.42m", setScore: "5/6", viewers: 612,   cheers: 142,  momentum: 48 },
  { id: "m5", athleteSlug: "sureyya-demir",         athleteName: "Süreyya Demir",         athleteImg: sureyyaDemirImg,athleteFlag: "tr", opponent: "Eddy Merckx",     opponentFlag: "be", sport: "Bilardo",  emoji: "🎱", status: "live", startsAt: "Şimdi", score: "23-19", setScore: "1/3", viewers: 480,   cheers: 96,   momentum: 55 },

  /* ── Yakında (3) ── */
  { id: "m6", athleteSlug: "mete-gazoz",            athleteName: "Mete Gazoz",            athleteImg: meteGazozImg,   athleteFlag: "tr", opponent: "Brady Ellison",   opponentFlag: "us", sport: "Okçuluk",  emoji: "🏹", status: "soon", startsAt: "Bugün 19:30", viewers: 870,  cheers: 220, momentum: 0 },
  { id: "m7", athleteSlug: "sureyya-demir",         athleteName: "Süreyya Demir",         athleteImg: sureyyaDemirImg,athleteFlag: "tr", opponent: "Dani Sánchez",    opponentFlag: "es", sport: "Bilardo",  emoji: "🎱", status: "soon", startsAt: "Bugün 21:15", viewers: 410,  cheers: 88,  momentum: 0 },
  { id: "m8", athleteSlug: "zeynep-sonmez",         athleteName: "Zeynep Sönmez",         athleteImg: tenisImg,       athleteFlag: "tr", opponent: "Iga Świątek",     opponentFlag: "pl", sport: "Tenis",    emoji: "🎾", status: "soon", startsAt: "Yarın 14:00", viewers: 1_980, cheers: 420, momentum: 0 },

  /* ── Bitti (3) ── */
  { id: "m9",  athleteSlug: "yusuf-dikec",          athleteName: "Yusuf Dikeç",          athleteImg: yusufDikecImg,  athleteFlag: "tr", opponent: "Serhiy Kulish",  opponentFlag: "ua", sport: "Atıcılık", emoji: "🎯", status: "ended", startsAt: "Bitti", score: "10-8",  viewers: 980,  cheers: 612, momentum: 100 },
  { id: "m10", athleteSlug: "buse-naz-cakiroglu",   athleteName: "Buse Naz Çakıroğlu",   athleteImg: buseNazImg,     athleteFlag: "tr", opponent: "Nazym Kyzaibay", opponentFlag: "kz", sport: "Boks",     emoji: "🥊", status: "ended", startsAt: "Bitti", score: "5-0",   viewers: 1_540, cheers: 410, momentum: 100 },
  { id: "m11", athleteSlug: "necati-er",            athleteName: "Necati Er",             athleteImg: atletizmImg,    athleteFlag: "tr", opponent: "Hugues Zango",   opponentFlag: "bf", sport: "Atletizm", emoji: "🏃", status: "ended", startsAt: "Bitti", score: "17.18m", viewers: 380,  cheers: 92,  momentum: 100 },
];

/* ============================================================
 * NEEDS / IHTIYAÇ KARTLARI
 * ============================================================ */
export type Need = {
  id: string;
  athleteSlug: string;
  athleteName: string;
  athleteImg: string;
  type: "money" | "talent";
  category: string;
  title: string;
  description: string;
  targetAmount?: number;
  collectedAmount?: number;
  talentNeeded?: string;
  city: string;
  deadline: string;
  urgent: boolean;
};

export const needs: Need[] = [
  { id: "n1", athleteSlug: "tayfun-keskin", athleteName: "Tayfun Keskin",  athleteImg: bilardoImg,  type: "money",  category: "Yol",       title: "Antalya Dünya Kupası yol masrafı",  description: "Tek başına gidiyor, otel + ulaşım için destek lazım.",  targetAmount: 14000, collectedAmount: 9300, city: "İzmir",    deadline: "30 May", urgent: true  },
  { id: "n2", athleteSlug: "defne-arslan", athleteName: "Defne Arslan",  athleteImg: tenisImg,    type: "money",  category: "Ekipman",    title: "Yeni grip ve kort ayakkabısı",        description: "Roland Garros eleme öncesi malzeme yenilenmeli.",          targetAmount: 6000,  collectedAmount: 2100, city: "Ankara",   deadline: "01 Haz", urgent: false },
  { id: "n3", athleteSlug: "alp-karadeniz",     athleteName: "Alp Karadeniz",      athleteImg: atletizmImg, type: "talent", category: "Beslenme",   title: "Beslenme danışmanı arıyor",            description: "Yarış sezonu için 3 ay haftalık takip.",                   talentNeeded: "Beslenme uzmanı",                                       city: "Eskişehir",deadline: "10 Haz", urgent: false },
  { id: "n4", athleteSlug: "nisan-celik",    athleteName: "Nisan Çelik",     athleteImg: okculukImg,  type: "talent", category: "İçerik",     title: "Reels editörü gönüllüsü",              description: "Maç sonrası kısa video kurgu desteği.",                    talentNeeded: "Video editör",                                          city: "İstanbul", deadline: "20 May", urgent: true  },
  { id: "n5", athleteSlug: "seda-yilmaz", athleteName: "Seda Yılmaz", athleteImg: boksImg,    type: "money", category: "Antrenör", title: "Yabancı antrenör kampı katkısı",   description: "Avrupa Şampiyonası öncesi 2 hafta İspanya kampı.",        targetAmount: 22000, collectedAmount: 11400, city: "İzmit",  deadline: "12 Haz", urgent: false },
];

/* ============================================================
 * SUPPORTERS / DESTEKÇİLER
 * ============================================================ */
export type Supporter = {
  id: string;
  name: string;
  city: string;
  monthlyAmount: number;
  since: string;
  athletes: string[]; // slugs
  totalContributed: number;
};

export const supporters: Supporter[] = [
  { id: "s1", name: "Mehmet Kaya",      city: "İstanbul", monthlyAmount: 250, since: "2024-09", athletes: ["nisan-celik","defne-arslan"], totalContributed: 2100 },
  { id: "s2", name: "Selin Yıldız",     city: "Ankara",   monthlyAmount: 100, since: "2025-01", athletes: ["nisan-celik"],                  totalContributed: 600  },
  { id: "s3", name: "Ali Eren",         city: "İzmir",    monthlyAmount: 50,  since: "2024-12", athletes: ["tayfun-keskin"],                totalContributed: 350  },
];

/* ============================================================
 * BRANDS
 * ============================================================ */
export type Brand = {
  id: string;
  name: string;
  sector: string;
  values: string[];
  budget: number;
  targetAge: string;
  targetCity: string[];
  logo?: string;
};

export const brands: Brand[] = [
  { id: "b1", name: "Karaca", sector: "Ev & Yaşam",  values: ["Aile","Türkiye","Tasarım"],        budget: 250_000, targetAge: "25-45", targetCity: ["İstanbul","Ankara"] },
  { id: "b2", name: "Pegasus",sector: "Havayolu",     values: ["Genç","Macera","Erişim"],          budget: 500_000, targetAge: "18-35", targetCity: ["Tüm Türkiye"] },
  { id: "b3", name: "Tofaş",  sector: "Otomotiv",     values: ["Disiplin","Mühendislik","Aile"],   budget: 1_200_000, targetAge: "25-50", targetCity: ["Bursa","İzmir"] },
];

/* ============================================================
 * AI MATCH RESULTS — Brand → Athletes
 * ============================================================ */
export type MatchResult = {
  athleteSlug: string;
  athleteName: string;
  athleteImg: string;
  sport: string;
  fitScore: number;
  riskScore: number;
  estROI: string;
  growth: string;
  reasoning: string[];
};

export const matchResults: Record<string, MatchResult[]> = {
  b1: [
    { athleteSlug: "nisan-celik",     athleteName: "Nisan Çelik",     athleteImg: okculukImg, sport: "Okçuluk", fitScore: 94, riskScore: 8,  estROI: "3.2x", growth: "+12%/ay", reasoning: ["Değer eşleşmesi: Disiplin, Türkiye", "İzleyici demografisi 25-45 ağırlıklı", "Düşük kontroversi geçmişi"] },
    { athleteSlug: "seda-yilmaz", athleteName: "Seda Yılmaz", athleteImg: boksImg,    sport: "Boks", fitScore: 87, riskScore: 12, estROI: "2.8x", growth: "+18%/ay", reasoning: ["Olimpiyat madalyası halk takdiri","Aile değerleriyle uyumlu","Genç kadın izleyici"] },
    { athleteSlug: "emre-sahin",    athleteName: "Emre Şahin",    athleteImg: okculukImg, sport: "Atıcılık",fitScore: 82, riskScore: 6,  estROI: "2.4x", growth: "+8%/ay",  reasoning: ["Düşük risk profili","Klasik Türk imajı","Sosyal medyada viral potansiyel"] },
  ],
};

/* ============================================================
 * BADGES
 * ============================================================ */
export type Badge = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  emoji: string;
};

export const badges: Badge[] = [
  { id: "bd1", name: "İlk Adım",            description: "İlk sporcunu takip ettin.",         earned: true,  earnedDate: "15 Mar", emoji: "👣" },
  { id: "bd2", name: "Sessiz Alkış",        description: "İlk sessiz tezahüratını gönderdin.", earned: true,  earnedDate: "20 Mar", emoji: "🤲" },
  { id: "bd3", name: "Tribün Üyesi",        description: "5 canlı maç izledin.",               earned: true,  earnedDate: "02 Nis", emoji: "🎟️" },
  { id: "bd4", name: "İlk Destekçi",        description: "İlk maddi desteğini verdin.",        earned: true,  earnedDate: "10 Nis", emoji: "💛" },
  { id: "bd5", name: "Şehrimin Takipçisi",  description: "Şehrindeki 3 sporcuyu takip et.",    earned: false, emoji: "📍" },
  { id: "bd6", name: "Keşifçi",             description: "5 farklı branşı keşfet.",            earned: false, emoji: "🧭" },
  { id: "bd7", name: "Yetenek Bağışçısı",   description: "İlk yetenek bağışını yap.",          earned: false, emoji: "🛠️" },
];

/* ============================================================
 * NOTIFICATIONS
 * ============================================================ */
export type Notification = {
  id: string;
  type: "support" | "event" | "match" | "brand" | "diary" | "match-talent";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "no1", type: "match",        title: "Mete sahaya çıkıyor",         message: "Avrupa Şampiyonası finali 14:30'da başlıyor.",       time: "12 dk",  read: false },
  { id: "no2", type: "diary",        title: "Süreyya günlük paylaştı",     message: "Maç sonrası sesli bir not bıraktı.",                 time: "1 sa",   read: false },
  { id: "no3", type: "event",        title: "Yakınında yeni etkinlik",     message: "İstanbul Yarı Maratonu için kayıtlar açıldı.",        time: "3 sa",   read: false },
  { id: "no4", type: "match-talent", title: "Yetenek eşleşmen bulundu",   message: "Alp Karadeniz'in beslenme ihtiyacıyla eşleştin.",        time: "Dün",    read: true  },
  { id: "no5", type: "support",      title: "Destek yenilendi",           message: "Aylık ₺250 desteğin Nisan Çelik'a iletildi.",          time: "2 gün",  read: true  },
];

/* ============================================================
 * DIARY / GÜNLÜK
 * ============================================================ */
export type DiaryEntry = {
  id: string;
  athleteSlug: string;
  date: string;
  mood: "🙏" | "🔥" | "😮‍💨" | "😊" | "💭" | "💪";
  audio: boolean;
  content: string;
};

export const diaryEntries: DiaryEntry[] = [
  { id: "d1", athleteSlug: "nisan-celik",    date: "16 May", mood: "🙏", audio: false, content: "Bugün gelen mesajların hepsini okudum. Sahaya tek başına çıkmıyorum artık." },
  { id: "d2", athleteSlug: "nisan-celik",    date: "14 May", mood: "💭", audio: true,  content: "Antrenmandan sonra Budapeşte hakkında konuştuk. Sesli notu bırakıyorum." },
  { id: "d3", athleteSlug: "tayfun-keskin", date: "15 May", mood: "💪", audio: false, content: "Salonda 5 saat. Üç bant açıları yeniden çalıştım." },
  { id: "d4", athleteSlug: "defne-arslan", date: "13 May", mood: "🔥", audio: false, content: "İlk set kayıptı ama dönmesini bildim. Toprak kortta her şey mümkün." },
];

/* ============================================================
 * SILENT CHEERS / SESSIZ TEZAHÜRAT
 * ============================================================ */
export const cheerTemplates = [
  "Seninleyim",
  "Devam et",
  "Pes etme",
  "Sakin kal",
  "Burdayız",
  "Bir nefes daha",
  "Türkiye seninle",
  "Sen bu işi bilirsin",
];

export type Cheer = {
  id: string;
  from: string;
  message: string;
  time: string;
};

export const recentCheers: Cheer[] = [
  { id: "c1", from: "Ayşegül",  message: "Seninleyim",          time: "şimdi" },
  { id: "c2", from: "Burak",    message: "Bir nefes daha 🙏",   time: "şimdi" },
  { id: "c3", from: "Ela",      message: "Türkiye seninle",      time: "1 dk" },
  { id: "c4", from: "Mert",     message: "Sakin kal, bilirsin",  time: "1 dk" },
  { id: "c5", from: "Selin",    message: "Pes etme",             time: "2 dk" },
];

/* ── Geniş tribün havuzu — canlı maç chat akışı için ── */

export const tribuneNames: string[] = [
  "Ayşe", "Mehmet", "Selin", "Ufuk", "Pelin", "Onur", "Burak", "Ela",
  "Mert", "Defne", "Berk", "Naz", "Kaan", "Sude", "Ege", "Doruk",
  "Zeynep", "Ozan", "İrem", "Tuna", "Aslı", "Kerem", "Buse", "Deniz",
  "Yiğit", "Cansu", "Emre", "Beril", "Ahmet", "Şevval", "Çağla",
  "Bora", "Sıla", "Eren", "Melis", "Atilla", "Damla", "Furkan",
  "Gizem", "Hakan", "İpek", "Tolga", "Yasemin",
];

export const tribuneMessages: string[] = [
  // Genel motivasyon
  "Seninleyim.",
  "Pes etme!",
  "Devam et, az kaldı.",
  "Türkiye seninle 🇹🇷",
  "Bir nefes daha.",
  "Sakin kal, bilirsin.",
  "Sen bu işi bilirsin.",
  "Tribün ayakta.",
  "Burdayız, duy bizi.",
  "Her vuruşa odaklan.",
  "Yıllarca bu an için çalıştın.",
  "Güveniyorum sana.",
  "Arkandayız!",
  "Sakin nefes, temiz kafa.",
  "Sen yaparsın.",
  "Bu maç senin.",
  "Vazgeçme sakın.",
  "Gözünü topa dik.",
  "Bütün Türkiye ekranda.",
  // Kısa burst / emoji
  "🔥🔥🔥",
  "💪💪",
  "🇹🇷🇹🇷🇹🇷",
  "✨ aslan ✨",
  "👏 muhteşemsin",
  // Yapıcı / serbest
  "İlk set kayıptı, dön bu setten.",
  "Servis çok iyi gidiyor.",
  "Konsantre ol, başaracaksın.",
  "Ritmi bulduğun an her şey gelir.",
  "Nefes al, kendine güven.",
];


/* ============================================================
 * BRAND OFFERS — for athlete inbox
 * ============================================================ */
export type BrandOffer = {
  id: string;
  brandName: string;
  brandSector: string;
  amount: number;
  duration: string;
  expectedContent: string;
  message: string;
  fitScore: number;
  date: string;
};

export const brandOffers: BrandOffer[] = [
  { id: "of1", brandName: "Karaca",  brandSector: "Ev & Yaşam", amount: 75_000,  duration: "3 ay",  expectedContent: "2 Reels + 1 Story serisi", message: "Aile değerlerine yakın bir kampanya planlıyoruz.",                       fitScore: 94, date: "12 May" },
  { id: "of2", brandName: "Pegasus", brandSector: "Havayolu",    amount: 120_000, duration: "6 ay",  expectedContent: "Maç öncesi havalimanı içeriği aylık", message: "Genç sporcuların yolculuk hikâyelerini öne çıkarmak istiyoruz.",        fitScore: 81, date: "08 May" },
];

/* ============================================================
 * TALENT / YETENEK BAĞIŞI
 * ============================================================ */
export type TalentMatch = {
  id: string;
  needId: string;
  athleteName: string;
  athleteImg: string;
  talentName: string;
  talentCity: string;
  talentType: string;
  matchScore: number;
  reasoning: string;
};

export const talentMatches: TalentMatch[] = [
  { id: "tm1", needId: "n3", athleteName: "Alp Karadeniz",  athleteImg: atletizmImg, talentName: "Dr. Elif Aksoy",  talentCity: "Eskişehir", talentType: "Beslenme uzmanı", matchScore: 92, reasoning: "Aynı şehirde, atletizm tecrübesi var, müsaitliği uygun." },
  { id: "tm2", needId: "n4", athleteName: "Nisan Çelik", athleteImg: okculukImg, talentName: "Cem Toprak",      talentCity: "İstanbul",  talentType: "Video editör",    matchScore: 87, reasoning: "Spor içerik portföyü güçlü, İstanbul'da bulunuyor." },
];

/* ============================================================
 * BRAND CAMPAIGNS — for Karaca brand panel
 * ============================================================ */
export type CampaignStatus = "active" | "ended" | "draft";

export type Campaign = {
  id: string;
  title: string;
  athleteSlug: string;
  athleteName: string;
  athleteImg: string;
  sport: string;
  budget: number;
  spent: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  daysLeft: number;
  description: string;
  deliverables: string[];
  metrics: { reach: number; engagement: number; clicks: number; roi: number };
  spark: number[];
  accent: "violet" | "sky" | "coral";
  timeline: { date: string; title: string; type: "post" | "milestone" | "report" }[];
};

export const campaigns: Campaign[] = [
  {
    id: "k1",
    title: "Yaz Koleksiyonu — Nisan Çelik",
    athleteSlug: "nisan-celik",
    athleteName: "Nisan Çelik",
    athleteImg: okculukImg,
    sport: "Okçuluk",
    budget: 60_000,
    spent: 47_800,
    status: "active",
    startDate: "01 May",
    endDate: "14 Haz",
    daysLeft: 28,
    description: "Yaz koleksiyonu lansmanı için disiplin temalı 4 parça içerik serisi. Mete'nin antrenman rutini üzerinden marka değerleri anlatılıyor.",
    deliverables: ["2 Reels", "1 Story serisi", "1 lansman post"],
    metrics: { reach: 412_000, engagement: 8.4, clicks: 14_200, roi: 3.1 },
    spark: [8, 12, 10, 18, 22, 19, 28, 34, 38, 46],
    accent: "sky",
    timeline: [
      { date: "01 May", title: "Kampanya başladı",           type: "milestone" },
      { date: "05 May", title: "1. Reels yayınlandı",         type: "post" },
      { date: "10 May", title: "Ara rapor: %18 etkileşim",    type: "report" },
      { date: "14 May", title: "2. Reels yayınlandı",         type: "post" },
      { date: "20 May", title: "Story serisi başladı",        type: "post" },
    ],
  },
  {
    id: "k2",
    title: "Anneler Günü — Seda Yılmaz",
    athleteSlug: "seda-yilmaz",
    athleteName: "Seda Yılmaz",
    athleteImg: boksImg,
    sport: "Boks",
    budget: 20_000,
    spent: 11_200,
    status: "active",
    startDate: "01 May",
    endDate: "27 May",
    daysLeft: 10,
    description: "Anneler Günü için aile bağı temalı tek lansman etkinliği. Seda ve annesinin antrenman hikâyesi üzerinden kurgulanan duygu odaklı kampanya.",
    deliverables: ["1 lansman etkinliği", "Etkinlik aftermath içerik"],
    metrics: { reach: 128_000, engagement: 18.0, clicks: 4_900, roi: 2.4 },
    spark: [4, 8, 6, 11, 14, 12, 16, 20],
    accent: "coral",
    timeline: [
      { date: "01 May", title: "Brief onaylandı",            type: "milestone" },
      { date: "08 May", title: "Etkinlik mekânı belirlendi",  type: "milestone" },
      { date: "12 May", title: "Ön tanıtım postu",            type: "post" },
      { date: "14 May", title: "Lansman etkinliği gerçekleşti", type: "milestone" },
      { date: "16 May", title: "Ara rapor: 128K erişim",      type: "report" },
    ],
  },
  {
    id: "k3",
    title: "Sahil & Mavi — Bahar Lansmanı",
    athleteSlug: "defne-arslan",
    athleteName: "Defne Arslan",
    athleteImg: tenisImg,
    sport: "Tenis",
    budget: 45_000,
    spent: 45_000,
    status: "ended",
    startDate: "01 Mar",
    endDate: "30 Nis",
    daysLeft: 0,
    description: "Bahar lansmanı tamamlandı. Açık hava aktivite temasıyla Zeynep'in turne öncesi hazırlık dönemi kullanıldı.",
    deliverables: ["3 Reels", "2 Story serisi", "1 röportaj video"],
    metrics: { reach: 287_000, engagement: 9.1, clicks: 12_100, roi: 2.8 },
    spark: [30, 32, 30, 28, 24, 22, 18, 14, 10, 8],
    accent: "violet",
    timeline: [
      { date: "01 Mar", title: "Kampanya başladı",           type: "milestone" },
      { date: "15 Mar", title: "1. Reels yayınlandı",         type: "post" },
      { date: "01 Nis", title: "Röportaj yayınlandı",         type: "post" },
      { date: "30 Nis", title: "Kampanya tamamlandı",         type: "milestone" },
    ],
  },
  {
    id: "k4",
    title: "Mutfak Hikâyesi (Taslak)",
    athleteSlug: "emre-sahin",
    athleteName: "Emre Şahin",
    athleteImg: okculukImg,
    sport: "Atıcılık",
    budget: 60_000,
    spent: 0,
    status: "draft",
    startDate: "15 Haz",
    endDate: "15 Tem",
    daysLeft: 30,
    description: "Yusuf'un evdeki sakinlik ve odak rutini üzerinden kurgulanacak içerik serisi. Henüz onaya gönderilmedi.",
    deliverables: ["TBD"],
    metrics: { reach: 0, engagement: 0, clicks: 0, roi: 0 },
    spark: [],
    accent: "sky",
    timeline: [
      { date: "12 May", title: "Brief hazırlandı", type: "milestone" },
    ],
  },
];

export const campaignById = (id: string) =>
  campaigns.find((c) => c.id === id) ?? campaigns[0];

/* ============================================================
 * PAST MATCHES — post-match silent cheer summaries (for /tezahurat/$id/ozet)
 * ============================================================ */
export type PastMatch = {
  id: string;
  athleteSlug: string;
  athleteName: string;
  athleteImg: string;
  title: string;
  city: string;
  date: string;
  score: string;
  result: "W" | "L";
  totalCheers: number;
  totalPeople: number;
  themes: { word: string; weight: number }[];
  aiSummary: string;
  featuredCheers: { id: string; from: string; message: string; time: string }[];
};

export const pastMatches: PastMatch[] = [
  {
    id: "m1",
    athleteSlug: "nisan-celik",
    athleteName: "Nisan Çelik",
    athleteImg: okculukImg,
    title: "Avrupa Şampiyonası — Yarı Final",
    city: "Budapeşte",
    date: "12 May",
    score: "6-2",
    result: "W",
    totalCheers: 1_240,
    totalPeople: 847,
    themes: [
      { word: "Sabır",     weight: 92 },
      { word: "Aile",      weight: 78 },
      { word: "Türkiye",   weight: 71 },
      { word: "Güven",     weight: 64 },
      { word: "Sessizlik", weight: 51 },
      { word: "Nefes",     weight: 44 },
      { word: "Dönüş",     weight: 38 },
      { word: "Cesaret",   weight: 32 },
    ],
    aiSummary:
      "Bugünkü mesajların çoğunda sabır ve güven kelimeleri öne çıktı. Kalabalık seni yargılamadı; tek beklediği, sahaya çıkıp denemen oldu. 24 kişi 'aile' kelimesini kullandı — geri dönüş hikâyene odaklanan bir ton hâkimdi.",
    featuredCheers: [
      { id: "f1", from: "Ayşegül", message: "Seninleyim. Bir okun bizim umudumuz.",                time: "2 dk önce" },
      { id: "f2", from: "Burak",   message: "Bir nefes daha. Sahnede yalnız değilsin.",            time: "5 dk önce" },
      { id: "f3", from: "Hakan",   message: "Bugün hepimiz seninle nefes aldık.",                  time: "8 dk önce" },
      { id: "f4", from: "Pınar",   message: "Geri dönüş hikâyenle gurur duyuyorum.",               time: "11 dk önce" },
      { id: "f5", from: "Ela",     message: "Türkiye seninle, sessizce.",                          time: "14 dk önce" },
    ],
  },
  {
    id: "m2",
    athleteSlug: "nisan-celik",
    athleteName: "Nisan Çelik",
    athleteImg: okculukImg,
    title: "Dünya Kupası 2. Tur",
    city: "Antalya",
    date: "06 May",
    score: "7-3",
    result: "W",
    totalCheers: 870,
    totalPeople: 612,
    themes: [
      { word: "Konsantrasyon", weight: 88 },
      { word: "Ev sahibi",     weight: 74 },
      { word: "Şampiyon",      weight: 66 },
      { word: "Rüzgâr",        weight: 52 },
      { word: "Sakinlik",      weight: 48 },
      { word: "Türkiye",       weight: 41 },
      { word: "Aile",          weight: 33 },
    ],
    aiSummary:
      "Bu maçta mesajların çoğu sahanın senin sahan olduğunu vurguladı. 'Konsantrasyon' ve 'ev sahibi' temaları öne çıktı. 18 kişi rüzgâr koşullarını yorumlayıp ona güvendiğini söyledi. Genel ton: rahat, neşeli, sahiplenici.",
    featuredCheers: [
      { id: "g1", from: "Mehmet",   message: "Antalya senin sahan, rüzgâr da seninle.", time: "az önce" },
      { id: "g2", from: "Selin",    message: "Sakin kal, biz buradayız.",                time: "3 dk önce" },
      { id: "g3", from: "Kaan",     message: "Şampiyon ruhu hissediliyor 🇹🇷",          time: "6 dk önce" },
      { id: "g4", from: "Defne",    message: "İlk seti senin alacağını biliyorduk.",     time: "9 dk önce" },
      { id: "g5", from: "Eren",     message: "Konsantrasyona devam, ipi sen göğüsle.",   time: "13 dk önce" },
    ],
  },
];

export const pastMatchById = (id: string) =>
  pastMatches.find((m) => m.id === id) ?? pastMatches[0];
