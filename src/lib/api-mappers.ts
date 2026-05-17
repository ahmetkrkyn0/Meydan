import type { Athlete, DiaryEntry, Event, Match, Need } from "@/lib/mock-data";
import { athletes, events, getSportImage, liveMatches, needs } from "@/lib/mock-data";
import type { BackendEvent, BackendJournal, BackendNeed, BackendProfile } from "@/lib/api";

import imgAtletizmErkek from "@/assets/athlete-atletizm-erkek.png";
import imgBilardoErkek from "@/assets/athlete-bilardo-erkek.png";
import imgBoksKadin from "@/assets/athlete-boks-kadin.png";
import imgEskrimKadin from "@/assets/athlete-eskrim-kadin.png";
import imgGuresErkek from "@/assets/athlete-gures-erkek.png";
import imgOkculukKadin from "@/assets/athlete-okculuk-kadin.png";
import imgSatrancErkek from "@/assets/athlete-satranc-erkek.png";
import imgTenisKadin from "@/assets/athlete-tenis-kadin.png";
import imgVoleybolKadin from "@/assets/athlete-voleybol-kadin.png";
import imgYelkenKadin from "@/assets/athlete-yelken-kadin.png";

// Gerçek sporcu fotoğrafları
import imgMeteGazoz from "@/assets/metegazoz.png";
import imgCemKaan from "@/assets/cem-kaan-gokerkan.png";
import imgBusenaz from "@/assets/busenaz.png";
import imgZeynepSonmez from "@/assets/zeynep-sonmez.png";

const SPORT_EMOJI: Record<string, string> = {
  atletizm: "🏃",
  atıcılık: "🎯",
  basketbol: "🏀",
  bilardo: "🎱",
  boks: "🥊",
  eskrim: "🤺",
  güreş: "🤼",
  jimnastik: "🤸",
  okçuluk: "🏹",
  satranç: "♟️",
  tenis: "🎾",
  voleybol: "🏐",
  yelken: "⛵",
  yüzme: "🏊",
};

const MONTHS = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];

function normalize(text?: string | null) {
  return (text ?? "").trim().toLocaleLowerCase("tr-TR");
}

export function slugifyProfile(profile: Pick<BackendProfile, "id" | "full_name">) {
  const slug = normalize(profile.full_name)
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || profile.id;
}

function sportEmoji(branch?: string | null) {
  return SPORT_EMOJI[normalize(branch)] ?? "🏅";
}

function pickFallbackByIndex(index: number) {
  return athletes[index % athletes.length] ?? athletes[0];
}

function guessGender(name: string): "kadin" | "erkek" {
  const n = normalize(name).split(" ")[0];
  const femaleNames = ["elif", "ada", "buse", "seda", "zeynep", "ayşe", "fatma", "merve", "busenaz", "süreyya", "lina", "aylin", "ilke", "gizem", "eda", "hande", "zehra", "melisa"];
  if (femaleNames.includes(n)) return "kadin";
  return "erkek";
}

function getDynamicAvatar(gender: "kadin" | "erkek", sport: string, fullName: string) {
  const nameNormal = normalize(fullName);
  
  // Gerçek sporcu override'ları
  if (nameNormal.includes("mete gazoz")) return imgMeteGazoz;
  if (nameNormal.includes("cem kaan")) return imgCemKaan;
  if (nameNormal.includes("buse naz") || nameNormal.includes("busenaz")) return imgBusenaz;
  if (nameNormal.includes("zeynep sönmez") || nameNormal.includes("zeynep sonmez")) return imgZeynepSonmez;

  const branch = normalize(sport);
  if (branch === "atletizm") return imgAtletizmErkek; 
  if (branch === "bilardo") return imgBilardoErkek; 
  if (branch === "boks") return imgBoksKadin;
  if (branch === "eskrim") return imgEskrimKadin;
  if (branch === "güreş" || branch === "gures") return imgGuresErkek;
  if (branch === "okçuluk" || branch === "okculuk") return imgOkculukKadin;
  if (branch === "satranç" || branch === "satranc") return imgSatrancErkek;
  if (branch === "tenis") return imgTenisKadin;
  if (branch === "voleybol") return imgVoleybolKadin;
  if (branch === "yelken") return imgYelkenKadin;
  
  return gender === "kadin" ? imgTenisKadin : imgGuresErkek;
}

function rankFromText(ranking?: string | null, fallback = 99) {
  const match = String(ranking ?? "").match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

export function profileToAthlete(profile: BackendProfile, index = 0): Athlete {
  const fallback = pickFallbackByIndex(index);
  const branch = profile.branch || fallback.sport;
  const socialLinks = profile.social_links ?? {};

  const gender = guessGender(profile.full_name);
  const dynamicImg = getDynamicAvatar(gender, branch, profile.full_name);

  return {
    ...fallback,
    id: profile.id,
    slug: slugifyProfile(profile),
    name: profile.full_name,
    sport: branch,
    sportEmoji: sportEmoji(branch),
    city: profile.city || fallback.city,
    rank: {
      ...fallback.rank,
      national: rankFromText(profile.ranking, fallback.rank.national),
    },
    bio: profile.bio || fallback.bio,
    values: profile.value_tags?.length ? profile.value_tags : fallback.values,
    img: profile.avatar_url || dynamicImg,
    socials: {
      instagram: socialLinks.instagram ?? fallback.socials.instagram,
      twitter: socialLinks.twitter ?? fallback.socials.twitter,
      youtube: socialLinks.youtube ?? fallback.socials.youtube,
    },
  };
}

export function profilesToAthletes(profiles?: BackendProfile[]) {
  if (!profiles?.length) return athletes;
  return profiles.map((profile, index) => profileToAthlete(profile, index));
}

export function findAthleteBySlug(slug: string, profiles?: BackendProfile[]) {
  const backendIndex = profiles?.findIndex((profile) => slugifyProfile(profile) === slug || profile.id === slug) ?? -1;
  if (profiles && backendIndex >= 0) {
    return profileToAthlete(profiles[backendIndex], backendIndex);
  }
  return athletes.find((athlete) => athlete.slug === slug || athlete.id === slug) ?? athletes[0];
}

export function findProfileBySlug(slug: string, profiles?: BackendProfile[]) {
  return profiles?.find((profile) => slugifyProfile(profile) === slug || profile.id === slug) ?? null;
}

function dateParts(eventDate?: string | null) {
  if (!eventDate) {
    return { date: "", day: "--", month: "---", time: "--:--" };
  }
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) {
    return { date: eventDate, day: "--", month: "---", time: "--:--" };
  }
  return {
    date: eventDate.slice(0, 10),
    day: String(date.getDate()).padStart(2, "0"),
    month: MONTHS[date.getMonth()] ?? "---",
    time: date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function mapCoords(latitude?: number | null, longitude?: number | null) {
  if (latitude == null || longitude == null) return { x: 50, y: 50 };
  const x = 5 + ((longitude - 26) / 19) * 90;
  const y = 20 + ((42.5 - latitude) / 7) * 60;
  return {
    x: Math.max(8, Math.min(92, Math.round(x))),
    y: Math.max(18, Math.min(82, Math.round(y))),
  };
}

export function backendEventToEvent(event: BackendEvent, index = 0): Event {
  const fallback = events[index % events.length] ?? events[0];
  const parts = dateParts(event.event_date);
  const branch = event.branch || fallback.sport;

  return {
    ...fallback,
    id: event.id,
    title: event.title,
    sport: branch,
    emoji: sportEmoji(branch),
    city: event.city || fallback.city,
    district: event.venue || fallback.district,
    date: parts.date || fallback.date,
    day: parts.day,
    month: parts.month,
    time: parts.time,
    free: Boolean(event.is_free),
    description: event.venue ? `${event.venue} etkinliği.` : fallback.description,
    coords: mapCoords(event.latitude, event.longitude),
    latitude: event.latitude ?? undefined,
    longitude: event.longitude ?? undefined,
    // Backend henüz fiyat alanı taşımıyor — is_free=true ise 0, değilse fallback.
    priceTL: event.is_free ? 0 : fallback.priceTL,
    image: getSportImage(branch),
  };
}

export function backendEventsToEvents(backendEvents?: BackendEvent[]) {
  if (!backendEvents?.length) return events;
  return backendEvents.map((event, index) => backendEventToEvent(event, index));
}

function inferNeedType(need: BackendNeed): "money" | "talent" {
  if (need.need_type === "money" || need.need_type === "talent") return need.need_type;
  const text = normalize(`${need.title} ${need.description}`);
  return /(edit|mentor|beslen|fizyo|tasar|tercü|tercu|gönüll|gonull|yetenek|uzman)/.test(text)
    ? "talent"
    : "money";
}

function formatDeadline(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("tr-TR");
}

export function backendNeedToNeed(need: BackendNeed, athlete: Athlete, index = 0): Need {
  const fallback = needs[index % needs.length] ?? needs[0];
  const type = inferNeedType(need);
  const deadlineStr = formatDeadline(need.deadline) ?? formatDeadline(need.created_at) ?? fallback.deadline;
  const isUrgent = need.is_urgent ?? (need.is_fulfilled === false);

  return {
    ...fallback,
    id: need.id,
    athleteSlug: athlete.slug,
    athleteName: athlete.name,
    athleteImg: athlete.img,
    type,
    category: need.category || (type === "talent" ? "Yetenek" : "Destek"),
    title: need.title,
    description: need.description || "",
    city: athlete.city,
    urgent: Boolean(isUrgent),
    deadline: deadlineStr,
    targetAmount: type === "money" ? need.target_amount ?? fallback.targetAmount : undefined,
    collectedAmount: type === "money" ? need.collected_amount ?? 0 : undefined,
    talentNeeded: type === "talent" ? (need.talent_needed || need.title) : undefined,
  };
}

export function backendNeedsToNeeds(backendNeeds: BackendNeed[] | undefined, athlete: Athlete) {
  if (!backendNeeds) return needs.filter((need) => need.athleteSlug === athlete.slug);
  if (backendNeeds.length === 0) return [];
  return backendNeeds.map((need, index) => backendNeedToNeed(need, athlete, index));
}

export function backendNeedsToNeedsWithProfiles(
  backendNeeds: BackendNeed[] | undefined,
  profiles?: BackendProfile[],
) {
  if (!backendNeeds) return needs;
  return backendNeeds.map((need, index) => {
    const profile = profiles?.find((item) => item.id === need.athlete_id);
    const athlete = profile ? profileToAthlete(profile, index) : pickFallbackByIndex(index);
    return backendNeedToNeed(need, athlete, index);
  });
}

export function backendJournalToDiary(entry: BackendJournal): DiaryEntry {
  const date = entry.created_at
    ? new Date(entry.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })
    : "Bugün";

  return {
    id: entry.id,
    athleteSlug: entry.athlete_id,
    date,
    mood: entry.audio_url ? "🙏" : "💪",
    audio: Boolean(entry.audio_url),
    content: entry.content,
  };
}

export function backendJournalsToDiary(entries?: BackendJournal[]) {
  return entries?.map(backendJournalToDiary) ?? [];
}

/**
 * Mock liveMatches listesindeki her satırı, DB'deki sporcu profilleriyle eşler.
 * - Önce mock slug (örn. "defne-arslan") DB profilinde varsa onunla override edilir.
 * - Yoksa DB profilleri sırayla mock satırlara atanır (round-robin) — böylece DB'de
 *   olmayan mock sporcular yerine gerçek sporcular gösterilir.
 * - DB profili yoksa mock liveMatches olduğu gibi döner.
 */
export function liveMatchesWithProfiles(profiles?: BackendProfile[]): Match[] {
  if (!profiles?.length) return liveMatches;

  const sporcular = profiles.filter((p) => p.role === "sporcu");
  if (!sporcular.length) return liveMatches;

  const bySlug = new Map<string, BackendProfile>();
  sporcular.forEach((p) => bySlug.set(slugifyProfile(p), p));

  let cursor = 0;
  return liveMatches.map((match) => {
    let profile = bySlug.get(match.athleteSlug);
    if (!profile) {
      profile = sporcular[cursor % sporcular.length];
      cursor += 1;
    }
    const branch = profile.branch || match.sport;
    return {
      ...match,
      athleteSlug: slugifyProfile(profile),
      athleteName: profile.full_name,
      athleteImg: profile.avatar_url || match.athleteImg,
      sport: branch,
      emoji: sportEmoji(branch),
    };
  });
}
