import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ArrowLeft, Sparkles } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu/$slug/yolculuk")({
  component: AthleteJourneyPage,
  head: ({ params }) => ({
    meta: [{ title: `${athleteBySlug(params.slug).name} — Yolculuk | Meydan` }],
  }),
});

type Milestone = {
  year: string;
  age: number;
  title: string;
  emotion: string;
  hearts: number;
  comments: number;
  kind: "achievement" | "moment";
};

function buildTimeline(
  achievements: { year: string; title: string }[],
  birthYear: number,
  slug: string,
): Milestone[] {
  const memoryBank: Record<string, { year: string; age: number; title: string; emotion: string }[]> = {
    "mete-gazoz": [
      { year: "2015", age: 17, title: "İlk milli takım çağrısı", emotion: "Telefon Bursa'dan geldi, otobüsteydim. Telefonu kapadım, kimseye söyleyemedim. Sadece annemi aradım." },
      { year: "2019", age: 21, title: "Olimpiyat kotası", emotion: "Kotayı aldığım gün babam ilk kez ağladı. Ondan sonra benim de gözlerim doldu." },
    ],
    "zeynep-sonmez": [
      { year: "2016", age: 15, title: "İlk uluslararası tur", emotion: "Bursa'dan tek başına çıktığım ilk gündü. Valizin yarısı raket, yarısı sucuktu." },
      { year: "2021", age: 20, title: "İlk ITF finali", emotion: "Maçtan sonra koridorda yere oturdum. Üç dakika hiçbir şey düşünmedim. Sadece nefes." },
    ],
    "sureyya-demir": [
      { year: "2014", age: 19, title: "Babamın masasında ilk seri", emotion: "Pencere açıktı, dışarıda yağmur vardı. 12. atışta dedim ki — bu iş bana göre." },
      { year: "2022", age: 27, title: "İlk Avrupa madalyası", emotion: "Annem maçı izlemedi, içeride bekledi. Salondan çıkınca beni öpmeden 'tebrikler oğlum' dedi. O yetti." },
    ],
    "yusuf-dikec": [
      { year: "1999", age: 26, title: "İlk milli takım kampı", emotion: "O yıllar tüm maaşımı mermilere veriyordum. Eve para götürdüğüm gün annem hiç sormadı, sadece çorba doldurdu." },
      { year: "2008", age: 35, title: "İlk olimpiyat", emotion: "Pekin'de uçaktan inerken — 'Cebim boş, hedefim dolu' demiştim kendime. O söz hâlâ duruyor." },
    ],
    "buse-naz-cakiroglu": [
      { year: "2015", age: 19, title: "Ringe ilk çıkış", emotion: "Eldivenleri ilk taktığım gün ellerim titriyordu. Hocam — 'titreyen el de yumruktur' dedi." },
      { year: "2021", age: 25, title: "Tokyo'da ilk olimpiyat", emotion: "Maçtan önce kulaklığımda annemin sesi vardı. 'Korkma' diyordu. Korkmadım." },
    ],
    "necati-er": [
      { year: "2018", age: 21, title: "Eskişehir'de keşfedildi", emotion: "Pist tozluydu, ben paslıydım. Hocam tribünden bağırdı — 'çocuk üç adımı bilmiyor ama ritmi var.'" },
      { year: "2022", age: 25, title: "Akdeniz Oyunları", emotion: "Madalyayı boynuma takarken annemi düşündüm. O yıl pisti sabah dörtte süpürürdü." },
    ],
  };

  const memories = memoryBank[slug] ?? [
    { year: String(birthYear + 16), age: 16, title: "İlk büyük adım", emotion: "Salonun ışıkları açıktı, kimse yoktu. Tek başıma. O an karar verdim." },
    { year: String(birthYear + 22), age: 22, title: "İlk gerçek sınav", emotion: "Maçtan sonra bir saat konuşmadım. Sonra annem aradı — 'biliyorum, gurur duyuyorum' dedi." },
  ];

  const items: Milestone[] = [
    ...achievements.map((ach) => ({
      year: ach.year,
      age: parseInt(ach.year) - birthYear,
      title: ach.title,
      emotion: "",
      hearts: 120 + Math.floor(Math.random() * 380),
      comments: 8 + Math.floor(Math.random() * 22),
      kind: "achievement" as const,
    })),
    ...memories.map((m) => ({
      year: m.year,
      age: m.age,
      title: m.title,
      emotion: m.emotion,
      hearts: 240 + Math.floor(Math.random() * 600),
      comments: 12 + Math.floor(Math.random() * 40),
      kind: "moment" as const,
    })),
  ];

  return items.sort((a, b) => parseInt(a.year) - parseInt(b.year));
}

function AthleteJourneyPage() {
  const { slug } = Route.useParams();
  const a = athleteBySlug(slug);
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - a.age;
  const timeline = buildTimeline(a.achievements, birthYear, slug);

  return (
    <AppShell role="fan">
      <div className="mx-auto max-w-3xl pb-24">
        {/* back link */}
        <Link
          to="/sporcu/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-2 text-xs font-medium text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{a.name} kartına dön</span>
        </Link>

        {/* heading */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-8 space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">
            Yolculuk
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            {a.name} — yolculuk
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Türkiye sporu sayıları değil, hikayeleri sever. Bu sayfa
            sıralamalardan değil, hatırlanan anlardan örülüyor.
          </p>
        </motion.header>

        {/* timeline */}
        <ol className="relative mt-14 space-y-10 pl-6 sm:pl-10">
          {/* line */}
          <span
            aria-hidden
            className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-violet/40 via-[color:var(--app-line)] to-transparent sm:left-3"
          />

          {timeline.map((m, i) => (
            <motion.li
              key={`${m.year}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative"
            >
              {/* node */}
              <span
                aria-hidden
                className={`absolute -left-[22px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full sm:-left-[30px] ${
                  m.kind === "achievement" ? "bg-violet" : "bg-white border-2 border-violet/40"
                }`}
              >
                {m.kind === "achievement" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>

              {/* year/age */}
              <div className="mb-2 flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold tabular-nums text-[color:var(--app-ink)]">
                  {m.year}
                </span>
                <span className="text-xs font-medium text-[color:var(--app-ink-mute)]">
                  {m.age} yaşında
                </span>
                {m.kind === "achievement" && (
                  <span className="chip chip-violet">
                    <Sparkles className="h-3 w-3" /> Başarı
                  </span>
                )}
              </div>

              {/* title */}
              <h3 className="font-display text-lg font-semibold leading-snug text-[color:var(--app-ink)] sm:text-xl">
                {m.title}
              </h3>

              {/* emotion note */}
              {m.emotion && (
                <p className="mt-3 max-w-xl border-l-2 border-violet/30 pl-4 text-[15px] italic leading-relaxed text-[color:var(--app-ink-soft)]">
                  "{m.emotion}"
                </p>
              )}

              {/* reactions */}
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[color:var(--app-ink-soft)] transition-colors hover:bg-coral/10 hover:text-coral cursor-pointer">
                  <Heart className="h-3 w-3" strokeWidth={2} /> {m.hearts}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[color:var(--app-ink-soft)] transition-colors hover:bg-violet/10 hover:text-violet cursor-pointer">
                  <MessageCircle className="h-3 w-3" strokeWidth={2} /> {m.comments}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-20 overflow-hidden rounded-3xl bg-aurora-light px-6 py-10 sm:px-10 sm:py-12"
        >
          <div className="absolute -right-12 top-0 h-64 w-64 rounded-full bg-violet/15 blur-3xl" />
          <div className="relative max-w-md space-y-5">
            <h2 className="font-display text-2xl font-bold leading-tight text-[color:var(--app-ink)] sm:text-3xl">
              Bu yolculuğa sen de yaz.
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
              Sonraki sayfa daha hafif yazılsın diye, {a.name.split(" ")[0]}'ın
              ihtiyaç duyduğu küçük şeylere göz at.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/dashboard"
                className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <Heart className="h-4 w-4" fill="currentColor" /> Destek Ol
              </Link>
              <Link
                to="/sporcu/$slug/ihtiyaclar"
                params={{ slug }}
                className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                İhtiyaçlarına bak
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}
