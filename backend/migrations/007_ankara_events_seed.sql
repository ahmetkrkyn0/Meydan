-- =============================================================
-- Migration 007: Ankara için 8 demo etkinlik insert eder
-- Tarih: 2026-05-17
-- Amaç: /sehrimde haritasında Ankara merkezi etrafında zengin pin
--       deneyimi sağlamak. Farklı branş + farklı fiyat aralığı +
--       farklı ilçe ile dağıtılmış 8 etkinlik.
-- =============================================================
-- Supabase Studio > SQL Editor'de çalıştır. Idempotent değil —
-- her çalıştırmada 8 kayıt insert eder. Tekrarlı çalıştırma
-- istemiyorsan önce mevcut Ankara demo verisini temizle:
--
--   DELETE FROM public.events WHERE city = 'Ankara';
--
-- (Eski "Ankara Basketbol Turnuvası" gibi kayıtlar varsa da
-- gider — istiyorsan WHERE ile spesifik title sil.)
-- =============================================================

INSERT INTO public.events (title, branch, city, venue, event_date, is_free, latitude, longitude) VALUES
  ('Ankara Açık Tenis Turnuvası', 'Tenis',    'Ankara', 'Bilkent',     '2026-05-30 09:00:00+03', false, 39.8682, 32.7491),
  ('Başkent Yarı Maratonu',       'Atletizm', 'Ankara', 'Çankaya',     '2026-06-02 07:30:00+03', true,  39.9255, 32.8369),
  ('TBMM Cup — Voleybol',         'Voleybol', 'Ankara', 'Yenimahalle', '2026-06-05 18:00:00+03', false, 39.9626, 32.7975),
  ('Anadolu Boks Galası',         'Boks',     'Ankara', 'Keçiören',    '2026-06-08 20:00:00+03', false, 39.9941, 32.8633),
  ('Ankara Bilardo Open',         'Bilardo',  'Ankara', 'Çankaya',     '2026-06-11 19:00:00+03', false, 39.9056, 32.8584),
  ('Kızılay Atıcılık Şampiyonası','Atıcılık', 'Ankara', 'Çankaya',     '2026-06-14 11:00:00+03', false, 39.9181, 32.8553),
  ('Başkent Okçuluk Kupası',      'Okçuluk',  'Ankara', 'Gölbaşı',     '2026-06-18 13:00:00+03', false, 39.7878, 32.8092),
  ('ODTÜ Genç Eskrim Galası',     'Eskrim',   'Ankara', 'Çankaya',     '2026-06-21 17:00:00+03', true,  39.8923, 32.7841);
