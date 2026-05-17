// Register/login ve diğer formlarda kullanılan ortak seçenekler.
// Backend ile uyumlu, Türkiye odaklı liste.

// Türkiye'nin 81 ili — alfabetik sıralı.
export const CITY_OPTIONS = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara",
  "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman",
  "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri",
  "Kilis", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya",
  "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
  "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt",
  "Sinop", "Sivas", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli",
  "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
] as const;

// Branş seçenekleri sporcular için. Backend'de string olarak saklanır.
export const BRANCH_OPTIONS = [
  { value: "Okçuluk",     emoji: "🏹" },
  { value: "Tenis",       emoji: "🎾" },
  { value: "Bilardo",     emoji: "🎱" },
  { value: "Boks",        emoji: "🥊" },
  { value: "Atletizm",    emoji: "🏃" },
  { value: "Güreş",       emoji: "🤼" },
  { value: "Yelken",      emoji: "⛵" },
  { value: "Satranç",     emoji: "♟️" },
  { value: "Voleybol",    emoji: "🏐" },
  { value: "Eskrim",      emoji: "🤺" },
  { value: "Basketbol",   emoji: "🏀" },
  { value: "Yüzme",       emoji: "🏊" },
  { value: "Jimnastik",   emoji: "🤸" },
  { value: "Atıcılık",    emoji: "🎯" },
  { value: "Halter",      emoji: "🏋️" },
  { value: "Tekvando",    emoji: "🥋" },
  { value: "Judo",        emoji: "🥋" },
  { value: "Karate",      emoji: "🥋" },
  { value: "Kürek",       emoji: "🚣" },
  { value: "Bisiklet",    emoji: "🚴" },
  { value: "Masa Tenisi", emoji: "🏓" },
  { value: "Badminton",   emoji: "🏸" },
  { value: "Hentbol",     emoji: "🤾" },
  { value: "Kayak",       emoji: "⛷️" },
  { value: "Buz Pateni",  emoji: "⛸️" },
] as const;

export type CityOption = (typeof CITY_OPTIONS)[number];
export type BranchOption = (typeof BRANCH_OPTIONS)[number]["value"];
