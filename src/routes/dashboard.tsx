import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  ArrowUpRight,
  ArrowRight,
  Radio,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/meydan/Navbar";
import adaImg from "@/assets/athlete-ada.jpg";
import keremImg from "@/assets/athlete-kerem.jpg";
import linaImg from "@/assets/athlete-lina.jpg";
import mertImg from "@/assets/athlete-mert.jpg";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Ana Sahne — Meydan" },
      {
        name: "description",
        content:
          "Takip ettiğin sporcular, canlı maçlar, yaklaşan etkinlikler ve sana özel keşifler — editorial bir sahne olarak.",
      },
      { property: "og:title", content: "Ana Sahne — Meydan" },
      { property: "og:image", content: adaImg },
    ],
  }),
});

const stripAthletes = [
  { name: "Ada Yıldız", branch: "Okçuluk", city: "İzmir", img: adaImg, status: "10:30 — Final" },
  { name: "Kerem Demir", branch: "Eskrim", city: "Ankara", img: keremImg, status: "Canlı · 12-9" },
  { name: "Lina Aksoy", branch: "Atletizm", city: "İstanbul", img: linaImg, status: "11 Haz · 1500m" },
  { name: "Mert Uçar", branch: "Yelken", city: "Bodrum", img: mertImg, status: "Yarın · regatta" },
];

const discover = [
  { n: "01", name: "Naz Erol", branch: "Kaya Tırmanışı", reason: "İzmir + 'Disiplin' uyumu %94" },
  { n: "02", name: "Onur Çelik", branch: "Tekvando", reason: "Ada Yıldız ile aynı kulüpten" },
  { n: "03", name: "Ezgi Kara", branch: "Yelken", reason: "Bu hafta öne çıkanlar" },
  { n: "04", name: "Bora Aslan", branch: "Eskrim", reason: "Kerem'i izleyenler de izledi" },
];

function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-aurora">
      <Navbar />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[55%] light-rays opacity-30" />
        <div className="absolute inset-0 grid-dots opacity-[0.05]" />
      </div>

      {/* ——— HERO ——— */}
      <section className="relative mx-auto max-w-[1400px] px-4 pt-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-px w-10 bg-foreground/40" />
              Cumartesi · 16 Mayıs
              <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 normal-case tracking-normal">
                <Sparkles className="h-3 w-3 text-[var(--violet)]" />
                Meydan Günlüğü
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
              <span className="text-gradient">Bugün</span>
              <br />
              <span className="text-gradient-violet">iki sporcun</span>
              <br />
              sahnede.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              Ada yayını çekti, Kerem ise üçüncü turda. Sessiz tezahüratını yazmadan akşam bitmesin.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-[1.02]">
                Sahneye geç
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="glass inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm transition-colors hover:bg-foreground/10">
                <Search className="h-4 w-4" /> Keşfet
              </button>
              <button className="relative glass inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-foreground/10">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--coral)]" />
              </button>
            </div>
          </div>

          {/* Ada portresi */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 1.05, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="ring-glow relative aspect-[3/4] overflow-hidden rounded-[2rem]"
            >
              <img
                src={adaImg}
                alt="Ada Yıldız — okçuluk"
                width={832}
                height={1216}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Şu an takip ettiğin
                </p>
                <p className="font-display text-2xl leading-tight">Ada Yıldız</p>
                <p className="text-xs text-muted-foreground">Okçuluk · TR 8. / Dünya 247.</p>
              </div>
            </motion.div>

            {/* yan etiket */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="glass-strong absolute -left-4 top-10 hidden rounded-2xl px-4 py-3 lg:block"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Bu hafta
              </p>
              <p className="font-display text-lg">+24% etki</p>
            </motion.div>
          </div>
        </motion.div>

        {/* ince stat hattı */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-y-6 border-t border-border pt-6">
          {[
            { k: "Takip ettiğin", v: "12", sub: "sporcu" },
            { k: "Bu ay destek", v: "₺ 420", sub: "4 sporcuya" },
            { k: "Sessiz tezahürat", v: "38", sub: "mesaj" },
            { k: "Etki skoru", v: "+24%", sub: "geçen haftaya göre" },
          ].map((s) => (
            <div key={s.k} className="min-w-[140px]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.k}</p>
              <p className="mt-1 font-display text-3xl leading-none">{s.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— FEATURED LIVE — Kerem ——— */}
      <section className="relative mt-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--coral)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--coral)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
                </span>
                Şu an meydanda
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                <span className="text-gradient">Kerem üçüncü turda.</span>
              </h2>
            </div>
            <Link
              to="/sporcu"
              className="hidden text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground sm:inline-flex items-center gap-1"
            >
              Sahneye geç <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-none sm:rounded-[2rem] sm:mx-8"
        >
          <div className="relative grid lg:grid-cols-[1.4fr_1fr]">
            <div className="relative aspect-[16/10] lg:aspect-auto">
              <img
                src={keremImg}
                alt="Kerem Demir — eskrim"
                width={1216}
                height={832}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/40 via-transparent to-[var(--background)]/80" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                  Eskrim · Tour de 16
                </p>
                <p className="font-display text-2xl text-white sm:text-3xl">
                  Kerem Demir <span className="text-white/50">vs.</span> M. Petrov
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-[color-mix(in_oklab,var(--foreground)_10%,transparent)] to-[color-mix(in_oklab,var(--violet)_18%,transparent)] p-7 sm:p-9">
              <div className="flex items-baseline gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Kerem
                  </p>
                  <p className="font-display text-6xl leading-none">12</p>
                </div>
                <span className="font-display text-2xl text-muted-foreground">—</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Petrov
                  </p>
                  <p className="font-display text-6xl leading-none text-muted-foreground">9</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span>Momentum</span>
                  <span>%78 Kerem</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "78%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--sky)] via-[var(--violet)] to-[var(--coral)]"
                  />
                </div>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                "Üçüncü turda hızı düştü ama duruşu sertleşti. Bir sonraki touchede final
                yumruğu gibi geliyor." —{" "}
                <span className="text-foreground">Meydan AI Yorumu</span>
              </p>

              <button className="group mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-[1.02]">
                <Radio className="h-4 w-4" /> Canlı akışa katıl
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ——— SPORCULARIM ŞERİDİ ——— */}
      <section className="relative mt-28">
        <div className="mx-auto mb-8 max-w-[1400px] px-4 sm:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Senin meydanın
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                <span className="text-gradient-violet">Sporcularım.</span>
              </h2>
            </div>
            <button className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
              Tümü (12)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="mx-auto flex w-max gap-5 px-4 sm:px-8">
            {stripAthletes.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <Link
                  to="/sporcu"
                  className="group relative block aspect-[3/4] w-[260px] overflow-hidden rounded-3xl"
                >
                  <img
                    src={a.img}
                    alt={a.name}
                    width={832}
                    height={1216}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/10 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                      {a.branch} · {a.city}
                    </p>
                    <p className="font-display text-xl leading-tight">{a.name}</p>
                    <p className="mt-1 text-xs text-[var(--violet)]">{a.status}</p>
                  </div>
                  <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— LINA — Editorial Split ——— */}
      <section className="relative mt-28">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Bu hafta sahnede
            </p>
            <h3 className="mt-3 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1] tracking-tight">
              <span className="text-gradient">Lina pisti</span>
              <br />
              <span className="text-gradient-violet">silmeye geliyor.</span>
            </h3>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Balkan Atletizm Şampiyonası'nda 1500 metrede Türkiye rekoruna 0.4 saniye uzakta.
              Sofya pisti, 11 Haziran 16:45.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Mesafe
                </p>
                <p className="font-display text-2xl">1500 m</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  En iyi
                </p>
                <p className="font-display text-2xl">4:02.18</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Hedef
                </p>
                <p className="font-display text-2xl text-[var(--coral)]">4:01.80</p>
              </div>
            </div>
            <Link
              to="/sporcu"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold story-link"
            >
              Lina'nın hikâyesi
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="ring-glow relative aspect-[5/6] overflow-hidden rounded-[2rem]"
          >
            <img
              src={linaImg}
              alt="Lina Aksoy — atletizm"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--background)]/40 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ——— KEŞFET — Editorial Liste ——— */}
      <section className="relative mt-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Sana özel
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                <span className="text-gradient">Yeni meydanlar.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Meydan AI; takip ettiğin sporcuların branş, şehir ve değer örüntülerinden
              öğreniyor. İşte bu hafta dikkatini hak edenler.
            </p>
          </div>

          <ul>
            {discover.map((d, i) => (
              <motion.li
                key={d.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group grid cursor-pointer grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-border py-6 transition-colors hover:bg-foreground/[0.03] sm:gap-10 sm:py-7"
              >
                <span className="font-display text-sm text-[var(--violet)]">{d.n}</span>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <h3 className="font-display text-2xl leading-none sm:text-3xl">{d.name}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {d.branch}
                  </span>
                  <p className="basis-full text-sm text-muted-foreground sm:basis-auto sm:max-w-md">
                    <span className="text-[var(--violet)]">AI · </span>
                    {d.reason}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— MERT — Sessiz Tezahürat CTA ——— */}
      <section className="relative mt-32">
        <div className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem]"
          >
            <img
              src={mertImg}
              alt="Mert Uçar — yelken"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-[560px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/70 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex w-full max-w-2xl flex-col justify-center p-8 sm:p-14">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Sessiz Tezahürat
              </p>
              <h3 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]">
                <span className="text-gradient-violet">Mert'in yelkenini</span>
                <br />
                bir cümlenle doldur.
              </h3>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                Yarın Bodrum'da regatta var. Maç anında AI özetiyle sporcuya tek mesaj olarak
                ulaşır — ses değil, niyet.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <Link
                  to="/sporcu"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-[1.02]"
                >
                  Mesaj yaz
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> 12 saat içinde
                  <MapPin className="ml-2 h-3 w-3" /> Bodrum
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
