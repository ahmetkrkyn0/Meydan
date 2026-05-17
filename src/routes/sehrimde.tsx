import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Users,
  Sparkles,
  Tag,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
// Leaflet SSR'da window'a dokunur — sadece client'ta dynamic import.
import type LType from "leaflet";
import { AppShell } from "@/components/meydan/AppShell";
import { listNearbyEvents } from "@/lib/api";
import { backendEventToEvent as backendEventToEventLocal } from "@/lib/api-mappers";
import { CITY_OPTIONS } from "@/lib/form-options";
import { events, type Event } from "@/lib/mock-data";

export const Route = createFileRoute("/sehrimde")({
  component: SehrimdePage,
  head: () => ({ meta: [{ title: "Şehrimde Ne Var? — Meydan" }] }),
});

const ALL_CITIES = "Tüm şehirler";
const TURKEY_CENTER: [number, number] = [39.0, 35.0];

type PriceBucket = {
  id: string;
  label: string;
  hint: string;
  match: (price: number) => boolean;
};

const PRICE_BUCKETS: PriceBucket[] = [
  { id: "all",  label: "Tüm fiyatlar", hint: "Ücretsizden lükse", match: () => true },
  { id: "free", label: "Ücretsiz",     hint: "0 TL",              match: (p) => p === 0 },
  { id: "low",  label: "0–250 TL",     hint: "Bütçe dostu",       match: (p) => p > 0 && p <= 250 },
  { id: "mid",  label: "250–600 TL",   hint: "Standart bilet",    match: (p) => p > 250 && p <= 600 },
  { id: "high", label: "600+ TL",      hint: "Premium / VIP",     match: (p) => p > 600 },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const CITY_LATLNG: Record<string, [number, number]> = {
  İstanbul: [41.0082, 28.9784],
  Ankara: [39.9334, 32.8597],
  İzmir: [38.4192, 27.1287],
  Bursa: [40.1828, 29.0665],
  Antalya: [36.8969, 30.7133],
  Eskişehir: [39.7767, 30.5206],
  Adana: [37.0, 35.3213],
  Bodrum: [37.0344, 27.4305],
};
function cityToCenter(city: string | null): [number, number] | null {
  if (!city) return null;
  return CITY_LATLNG[city] ?? null;
}

function SehrimdePage() {
  const [city, setCity] = useState<string>("Ankara");
  const [bucketId, setBucketId] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cityParam = city === ALL_CITIES ? null : city;
  const eventsQuery = useQuery({
    queryKey: ["events", "nearby", cityParam],
    queryFn: () => listNearbyEvents({ city: cityParam }),
    retry: 1,
  });

  const backendResponded = !eventsQuery.isLoading && !eventsQuery.isError;
  const backendEvents = eventsQuery.data?.events ?? [];

  const baseList = useMemo(() => {
    if (backendResponded) {
      return backendEvents.length
        ? backendEvents.map((e, i) => backendEventToEventLocal(e, i))
        : [];
    }
    return events;
  }, [backendResponded, backendEvents]);

  const cityFiltered = useMemo(() => {
    if (backendResponded) return baseList;
    return baseList.filter((e) => (cityParam ? e.city === cityParam : true));
  }, [baseList, backendResponded, cityParam]);

  const bucket = PRICE_BUCKETS.find((b) => b.id === bucketId) ?? PRICE_BUCKETS[0];
  const filtered = useMemo(
    () => cityFiltered.filter((e) => bucket.match(e.priceTL)),
    [cityFiltered, bucket],
  );

  const active = filtered.find((e) => e.id === activeId) ?? null;
  const mapCenter: [number, number] = cityToCenter(cityParam) ?? TURKEY_CENTER;
  const mapZoom = cityParam ? 11 : 6;

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="flex w-full flex-col gap-6"
      >
        {/* ───────────────── Hero başlık ───────────────── */}
        <motion.header variants={fadeUp} className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--app-ink-mute)]">
            Şehrimde Ne Var?
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
            Yaklaşan etkinlikler{" "}
            <span className="italic text-violet">
              {city === ALL_CITIES ? "Türkiye'de" : `${city}'da`}
            </span>
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-[color:var(--app-ink-soft)]">
            Yakınında olan tek bir maç bile tribünün başlangıcıdır.{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">
              {filtered.length} etkinlik
            </span>{" "}
            bulundu.
          </p>
        </motion.header>

        {/* ───────────────── Filter bar (yüksek z-index, dropdown'lar haritanın üstünde) ───────────────── */}
        <motion.section
          variants={fadeUp}
          className="relative z-[600] mx-auto w-full max-w-6xl px-1"
        >
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--app-line)] bg-white/90 p-2 shadow-[0_8px_30px_-12px_oklch(0.22_0.05_258/0.18)] backdrop-blur">
            <CityDropdown value={city} onChange={setCity} />
            <span className="hidden h-7 w-px bg-[color:var(--app-line)] sm:block" />
            <PriceDropdown value={bucketId} onChange={setBucketId} />

            <div className="ml-auto flex items-center gap-2 px-2">
              <Sparkles className="h-3.5 w-3.5 text-violet" />
              <span className="text-xs font-semibold text-[color:var(--app-ink)]">
                {filtered.length} sonuç
              </span>
            </div>
          </div>
        </motion.section>

        {/* ───────────────── Full-width harita — dengeli boy ───────────────── */}
        <motion.section variants={fadeUp} className="relative z-[1] w-full">
          <div className="relative aspect-[16/10] max-h-[560px] w-full overflow-hidden border-y border-[color:var(--app-line)] bg-[color:var(--app-bg)] sm:aspect-[16/9]">
            {mounted ? (
              <LeafletMap
                center={mapCenter}
                zoom={mapZoom}
                events={filtered}
                activeId={active?.id ?? null}
                onPinHover={setActiveId}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet/5 via-white to-violet/5">
                <span className="text-xs text-[color:var(--app-ink-mute)]">Harita yükleniyor…</span>
              </div>
            )}

            {/* Sağ alt — minik legend */}
            <div className="pointer-events-none absolute bottom-4 right-4 z-[400] hidden items-center gap-2 rounded-full border border-[color:var(--app-line)] bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[color:var(--app-ink-soft)] backdrop-blur sm:flex">
              <MapPin className="h-3 w-3 text-violet" />
              {cityParam ?? "Türkiye"} · {filtered.length} pin
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  Premium şehir dropdown'u
 * ════════════════════════════════════════════════════════════════════ */
function CityDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (city: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const options = useMemo(() => [ALL_CITIES, ...CITY_OPTIONS], []);
  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLocaleLowerCase("tr-TR");
    return options.filter((c) => c.toLocaleLowerCase("tr-TR").includes(q));
  }, [options, query]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-left transition-all hover:bg-[color:var(--app-bg-soft)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet/12 text-violet">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            Şehir
          </span>
          <span className="text-sm font-semibold text-[color:var(--app-ink)]">{value}</span>
        </span>
        <ChevronDown
          className={`ml-1 h-3.5 w-3.5 text-[color:var(--app-ink-mute)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute left-0 top-[calc(100%+8px)] z-[1000] w-[300px] overflow-hidden rounded-2xl border border-[color:var(--app-line)] bg-white shadow-[0_24px_60px_-20px_oklch(0.22_0.05_258/0.25)]"
          >
            <div className="border-b border-[color:var(--app-line)] p-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Şehir ara…"
                className="w-full rounded-lg border border-[color:var(--app-line)] bg-[color:var(--app-bg-soft)] px-3 py-2 text-sm text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] focus:border-violet/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet/15"
              />
            </div>
            <ul className="max-h-[280px] overflow-y-auto py-1">
              {filtered.map((c) => {
                const on = c === value;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(c);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
                        on
                          ? "bg-violet/10 text-violet"
                          : "text-[color:var(--app-ink)] hover:bg-[color:var(--app-bg-soft)]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className={`h-3.5 w-3.5 ${on ? "text-violet" : "text-[color:var(--app-ink-mute)]"}`} />
                        {c}
                      </span>
                      {on && <Check className="h-4 w-4 text-violet" />}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-3 py-4 text-center text-xs text-[color:var(--app-ink-mute)]">
                  Eşleşen şehir yok.
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  Premium fiyat dropdown'u
 * ════════════════════════════════════════════════════════════════════ */
function PriceDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = PRICE_BUCKETS.find((b) => b.id === value) ?? PRICE_BUCKETS[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-left transition-all hover:bg-[color:var(--app-bg-soft)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-600">
          <Tag className="h-3.5 w-3.5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            Fiyat
          </span>
          <span className="text-sm font-semibold text-[color:var(--app-ink)]">{current.label}</span>
        </span>
        <ChevronDown
          className={`ml-1 h-3.5 w-3.5 text-[color:var(--app-ink-mute)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute left-0 top-[calc(100%+8px)] z-[1000] w-[280px] overflow-hidden rounded-2xl border border-[color:var(--app-line)] bg-white shadow-[0_24px_60px_-20px_oklch(0.22_0.05_258/0.25)]"
          >
            <ul className="py-1.5">
              {PRICE_BUCKETS.map((b) => {
                const on = b.id === value;
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(b.id);
                        setOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
                        on
                          ? "bg-emerald-500/10"
                          : "hover:bg-[color:var(--app-bg-soft)]"
                      }`}
                    >
                      <span className="flex flex-col leading-tight">
                        <span
                          className={`text-sm font-semibold ${
                            on ? "text-emerald-700" : "text-[color:var(--app-ink)]"
                          }`}
                        >
                          {b.label}
                        </span>
                        <span className="text-[11px] text-[color:var(--app-ink-mute)]">
                          {b.hint}
                        </span>
                      </span>
                      {on && <Check className="h-4 w-4 text-emerald-600" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  Leaflet harita — pin'in tam üstünde popup + CTA (etkinliğe yönlendir)
 * ════════════════════════════════════════════════════════════════════ */
function LeafletMap({
  center,
  zoom,
  events: pinEvents,
  activeId,
  onPinHover,
}: {
  center: [number, number];
  zoom: number;
  events: Event[];
  activeId: string | null;
  onPinHover: (id: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const leafletRef = useRef<typeof LType | null>(null);
  const markersLayerRef = useRef<LType.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Popup React node'unu render etmek için: aktif event değiştikçe Leaflet
  // popup'unu manuel açıyoruz, içine bir DOM root yaratıp portal yerine
  // basitçe React-vari HTML inject ediyoruz. Etkinliğe yönlendirme için
  // event-delegation: popup içindeki tıklama global handler'a düşer.

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled) return;
      const L = (mod.default ?? mod) as typeof LType;
      if (!containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap, © CARTO",
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      leafletRef.current = L;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      leafletRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // center/zoom değişikliği
  useEffect(() => {
    if (!ready) return;
    mapRef.current?.setView(center, zoom, { animate: true });
  }, [ready, center[0], center[1], zoom]);

  // Marker'ları (re)çiz — her seferinde sıfırdan, hover/click davranışları dahil
  useEffect(() => {
    if (!ready) return;
    const layer = markersLayerRef.current;
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!layer || !L || !map) return;
    layer.clearLayers();

    pinEvents.forEach((e) => {
      if (e.latitude == null || e.longitude == null) return;
      const active = activeId === e.id;
      const icon = L.divIcon({
        className: "meydan-pin",
        html: `<div class="meydan-pin-shell ${active ? "is-active" : ""}"><div class="meydan-pin-dot">${e.emoji}</div><div class="meydan-pin-tail"></div></div>`,
        iconSize: [40, 48],
        iconAnchor: [20, 46],
      });
      const marker = L.marker([e.latitude, e.longitude], { icon, riseOnHover: true });

      // Pin'in tam üstünde Leaflet popup. autoPan açık ki popup üst kenara
      // taşarsa harita kendi kendine kayıp tüm kartı görünür kılsın.
      // autoPanPadding ile popup ile harita kenarı arası boşluk garanti.
      const popupHtml = buildPopupHtml(e);
      marker.bindPopup(popupHtml, {
        offset: [0, -42],
        closeButton: false,
        autoPan: true,
        autoPanPadding: [40, 40],
        keepInView: true,
        className: "meydan-popup",
        maxWidth: 280,
      });

      marker.on("mouseover", () => {
        onPinHover(e.id);
        marker.openPopup();
      });
      marker.on("mouseout", () => {
        // Popup üstüne mouse geçerse açık kalsın
        const popupEl = marker.getPopup()?.getElement();
        if (popupEl && popupEl.matches(":hover")) return;
        marker.closePopup();
        onPinHover(null);
      });
      marker.on("click", () => {
        navigate({ to: "/etkinlik/$id", params: { id: e.id } });
      });

      // Popup açıldığında: içindeki CTA tıklamasını yakalayıp router'a yönlendir
      marker.on("popupopen", (ev) => {
        const popupEl = ev.popup.getElement();
        if (!popupEl) return;
        const cta = popupEl.querySelector<HTMLElement>("[data-event-cta]");
        cta?.addEventListener("click", (clickEv) => {
          clickEv.preventDefault();
          navigate({ to: "/etkinlik/$id", params: { id: e.id } });
        });
        // Popup'a girince açık kalsın
        popupEl.addEventListener("mouseleave", () => {
          marker.closePopup();
          onPinHover(null);
        });
      });

      marker.addTo(layer);
    });
  }, [ready, pinEvents, activeId, onPinHover, navigate]);

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      <style>{`
        .meydan-pin { background: transparent !important; border: 0 !important; }
        .meydan-pin-shell {
          position: relative;
          width: 40px; height: 48px;
          display: flex; flex-direction: column; align-items: center;
          transform-origin: center bottom;
          transition: transform .22s cubic-bezier(.22,1,.36,1);
          filter: drop-shadow(0 6px 10px oklch(0.22 0.05 258 / 0.25));
        }
        .meydan-pin-shell:hover, .meydan-pin-shell.is-active {
          transform: scale(1.12) translateY(-2px);
        }
        .meydan-pin-dot {
          width: 36px; height: 36px;
          border-radius: 999px;
          background: #ffffff;
          border: 2px solid oklch(0.60 0.22 252);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; line-height: 1;
        }
        .meydan-pin-shell.is-active .meydan-pin-dot {
          background: oklch(0.60 0.22 252);
          color: white;
          box-shadow: 0 0 0 4px oklch(0.60 0.22 252 / 0.18);
        }
        .meydan-pin-tail {
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid oklch(0.60 0.22 252);
          margin-top: -2px;
        }

        /* Leaflet popup — premium kart görünümü */
        .meydan-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 16px;
          box-shadow: 0 24px 60px -20px oklch(0.22 0.05 258 / 0.35);
          border: 1px solid oklch(0.22 0.05 258 / 0.08);
          overflow: hidden;
        }
        .meydan-popup .leaflet-popup-content {
          margin: 0;
          width: 260px !important;
          font-family: inherit;
        }
        .meydan-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 0 4px 12px oklch(0.22 0.05 258 / 0.15);
        }
        .meydan-popup-card {
          display: flex;
          flex-direction: column;
        }
        .meydan-popup-media {
          position: relative;
          width: 100%;
          height: 120px;
          background: oklch(0.96 0.02 258);
        }
        .meydan-popup-media img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .meydan-popup-media::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0));
        }
        .meydan-popup-sport {
          position: absolute; top: 10px; left: 10px;
          background: rgba(255,255,255,0.95);
          color: oklch(0.22 0.05 258);
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 8px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
          z-index: 2;
        }
        .meydan-popup-price {
          position: absolute; top: 10px; right: 10px;
          background: oklch(0.60 0.22 252);
          color: white;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 999px;
          z-index: 2;
        }
        .meydan-popup-title {
          position: absolute; bottom: 8px; left: 12px; right: 12px;
          color: white;
          font-family: var(--font-display, inherit);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.15;
          z-index: 2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .meydan-popup-body {
          padding: 10px 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .meydan-popup-meta {
          font-size: 11px;
          color: oklch(0.45 0.04 258);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .meydan-popup-meta strong {
          color: oklch(0.22 0.05 258);
          font-weight: 600;
        }
        .meydan-popup-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: oklch(0.22 0.05 258);
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
          transition: background .15s ease;
        }
        .meydan-popup-cta:hover {
          background: oklch(0.60 0.22 252);
        }
        .meydan-popup-cta svg {
          width: 14px; height: 14px;
        }
      `}</style>
    </>
  );
}

/* HTML string olarak popup içeriği — Leaflet's bindPopup string kabul eder. */
function buildPopupHtml(e: Event): string {
  const priceLabel = e.priceTL === 0 ? "Ücretsiz" : `${e.priceTL.toLocaleString("tr-TR")} TL`;
  const safeTitle = escapeHtml(e.title);
  const safeSport = escapeHtml(e.sport);
  const safeDistrict = escapeHtml(e.district);
  const safeDay = escapeHtml(e.day);
  const safeMonth = escapeHtml(e.month);
  const safeTime = escapeHtml(e.time);
  return `
    <div class="meydan-popup-card">
      <div class="meydan-popup-media">
        <span class="meydan-popup-sport">${safeSport}</span>
        <span class="meydan-popup-price">${escapeHtml(priceLabel)}</span>
        <img src="${e.image}" alt="${safeTitle}" />
        <div class="meydan-popup-title">${safeTitle}</div>
      </div>
      <div class="meydan-popup-body">
        <div class="meydan-popup-meta">
          <strong>${safeDay} ${safeMonth}</strong> · ${safeTime} · ${safeDistrict}
        </div>
        <button type="button" data-event-cta class="meydan-popup-cta">
          Etkinlik sayfasına git
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
