-- =============================================================
-- Migration 006: events tablosunda latitude/longitude backfill
-- Tarih: 2026-05-17
-- Amaç: ORS isochrone filtresi sadece koordinatlı eventleri pin
--       olarak gösterir. Mevcut kayıtların çoğunda lat/lng NULL —
--       şehir merkezleriyle yaklaşık konum doldurulur. Yeni
--       eventler kendi gerçek konumuyla zaten gelir.
-- =============================================================
-- Supabase Studio > SQL Editor'de çalıştır. Idempotent (sadece
-- NULL olanları doldurur, mevcut koordinatları üzerine yazmaz).
-- =============================================================

UPDATE public.events SET latitude = 41.0082, longitude = 28.9784
  WHERE city = 'İstanbul'  AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 39.9334, longitude = 32.8597
  WHERE city = 'Ankara'    AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 38.4192, longitude = 27.1287
  WHERE city = 'İzmir'     AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 40.1828, longitude = 29.0665
  WHERE city = 'Bursa'     AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 36.8969, longitude = 30.7133
  WHERE city = 'Antalya'   AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 39.7767, longitude = 30.5206
  WHERE city = 'Eskişehir' AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 37.0000, longitude = 35.3213
  WHERE city = 'Adana'     AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.events SET latitude = 37.0344, longitude = 27.4305
  WHERE city = 'Bodrum'    AND (latitude IS NULL OR longitude IS NULL);
