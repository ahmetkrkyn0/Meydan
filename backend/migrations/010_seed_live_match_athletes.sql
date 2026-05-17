-- =============================================================
-- Migration 010: Canlı maçlar için gerçek sporcu seed'i
-- Tarih: 2026-05-17
-- Amaç:
--   - mock-data.ts/liveMatches'taki 6 sporcuyu (11 maç bunların arasında)
--     profiles tablosuna ekler.
--   - 2 demo taraftar ekler (cheer gönderebilmek için).
--   - Her sporcuya bugünün tarihiyle ~10 temiz cheer kaydı seed eder
--     (cheers/summary endpoint'i Gemini ile özetleyebilsin diye).
--
-- Şifre (hepsi için): meydan2026
-- bcrypt hash: $2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6
-- (backend/_hash_password ile uyumlu, _verify_password doğrular)
--
-- Idempotent: tekrar çalıştırılabilir.
-- Supabase Studio > SQL Editor'de çalıştır.
-- =============================================================

-- profiles tablosundaki unique index lower(email) üzerinde "partial expression"
-- index olduğundan ON CONFLICT (lower(email)) bazı PG sürümlerinde sorunlu.
-- Bu yüzden seed satırlarını önce DELETE ile temizleyip yeniden INSERT ediyoruz.
-- Bu sadece bizim seed email'lerini etkiler; gerçek kullanıcılara dokunmaz.

-- -------------------------------------------------------------
-- 0) Eski seed cheer'larını ve seed taraftarlarını temizle.
--    (Sporcular silinmiyor; ON DELETE kısıtları varsa korunur.
--     Sadece bu seed'in kendi cheer kayıtlarını sileceğiz.)
-- -------------------------------------------------------------
DELETE FROM public.cheers
WHERE fan_id IN (
  SELECT id FROM public.profiles
  WHERE lower(email) IN ('taraftar1@meydan.test','taraftar2@meydan.test')
);

-- -------------------------------------------------------------
-- 1) Sporcu profilleri (6) — varsa güncelle, yoksa ekle
-- -------------------------------------------------------------
-- Mevcut seed sporcularını sil. Cheers'taki athlete_id FK kısıtı varsa
-- bu satırlara bağlı cheer kalmamasını sağlamak için önce onları sildik.
-- Ama gerçek bir taraftarın bu sporcuya cheer'ı varsa silinmemeli — bu
-- yüzden sporcuyu silmek yerine UPDATE/INSERT yapacağız.

-- Adım 1a: Var olan seed sporcularını UPDATE et.
UPDATE public.profiles SET
  full_name = v.full_name,
  password_hash = v.password_hash,
  role = 'sporcu',
  branch = v.branch,
  city = v.city,
  bio = v.bio
FROM (VALUES
  ('zeynep-sonmez@meydan.test',      'Zeynep Sönmez',      '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Tenis',    'İstanbul',  'WTA tur oyuncusu. Toprak kortta sabır, betonda agresif oyun.'),
  ('buse-naz-cakiroglu@meydan.test', 'Buse Naz Çakıroğlu', '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Boks',     'Kocaeli',   'Olimpiyat madalyalı boksör. 50 kg sıklet, hızlı ayak oyunu.'),
  ('mete-gazoz@meydan.test',         'Mete Gazoz',         '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Okçuluk',  'İstanbul',  'Olimpiyat şampiyonu. Olimpik recurve 70 m kategorisi.'),
  ('necati-er@meydan.test',          'Necati Er',          '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Atletizm', 'Eskişehir', 'Üç adım atlama milli sporcusu. Avrupa madalyası sahibi.'),
  ('sureyya-demir@meydan.test',      'Süreyya Demir',      '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Bilardo',  'İzmir',     'Üç bant bilardo oyuncusu. Yurt dışında turnuva tecrübesi.'),
  ('yusuf-dikec@meydan.test',        'Yusuf Dikeç',        '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Atıcılık', 'Ankara',    '10 m havalı tabanca milli sporcusu. Olimpiyat madalyalı.')
) AS v(email, full_name, password_hash, branch, city, bio)
WHERE lower(public.profiles.email) = v.email;

-- Adım 1b: UPDATE bulamadıklarını INSERT et.
INSERT INTO public.profiles (role, full_name, email, password_hash, branch, city, bio)
SELECT 'sporcu', v.full_name, v.email, v.password_hash, v.branch, v.city, v.bio
FROM (VALUES
  ('zeynep-sonmez@meydan.test',      'Zeynep Sönmez',      '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Tenis',    'İstanbul',  'WTA tur oyuncusu. Toprak kortta sabır, betonda agresif oyun.'),
  ('buse-naz-cakiroglu@meydan.test', 'Buse Naz Çakıroğlu', '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Boks',     'Kocaeli',   'Olimpiyat madalyalı boksör. 50 kg sıklet, hızlı ayak oyunu.'),
  ('mete-gazoz@meydan.test',         'Mete Gazoz',         '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Okçuluk',  'İstanbul',  'Olimpiyat şampiyonu. Olimpik recurve 70 m kategorisi.'),
  ('necati-er@meydan.test',          'Necati Er',          '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Atletizm', 'Eskişehir', 'Üç adım atlama milli sporcusu. Avrupa madalyası sahibi.'),
  ('sureyya-demir@meydan.test',      'Süreyya Demir',      '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Bilardo',  'İzmir',     'Üç bant bilardo oyuncusu. Yurt dışında turnuva tecrübesi.'),
  ('yusuf-dikec@meydan.test',        'Yusuf Dikeç',        '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Atıcılık', 'Ankara',    '10 m havalı tabanca milli sporcusu. Olimpiyat madalyalı.')
) AS v(email, full_name, password_hash, branch, city, bio)
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE lower(p.email) = v.email
);

-- -------------------------------------------------------------
-- 2) Demo taraftar profilleri (2) — aynı şablon
-- -------------------------------------------------------------
UPDATE public.profiles SET
  full_name = v.full_name,
  password_hash = v.password_hash,
  role = 'taraftar',
  city = v.city,
  bio = v.bio
FROM (VALUES
  ('taraftar1@meydan.test', 'Demo Taraftar 1', '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'İstanbul', 'Tribünde sessiz, sporcunun yanında.'),
  ('taraftar2@meydan.test', 'Demo Taraftar 2', '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Ankara',   'Her maçta seninleyim.')
) AS v(email, full_name, password_hash, city, bio)
WHERE lower(public.profiles.email) = v.email;

INSERT INTO public.profiles (role, full_name, email, password_hash, city, bio)
SELECT 'taraftar', v.full_name, v.email, v.password_hash, v.city, v.bio
FROM (VALUES
  ('taraftar1@meydan.test', 'Demo Taraftar 1', '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'İstanbul', 'Tribünde sessiz, sporcunun yanında.'),
  ('taraftar2@meydan.test', 'Demo Taraftar 2', '$2b$12$9PhN256Hdw0yLrtWKeWY1O9woNVEk3Q8yWexNSP6s6gMVTLSAQ4R6', 'Ankara',   'Her maçta seninleyim.')
) AS v(email, full_name, password_hash, city, bio)
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE lower(p.email) = v.email
);

-- -------------------------------------------------------------
-- 3) Cheers seed — her sporcuya bugünün tarihiyle 10 mesaj
--    (cheers/summary endpoint'i bunları + senin gönderdiklerini özetleyecek)
-- -------------------------------------------------------------
WITH athletes AS (
  SELECT id, email
  FROM public.profiles
  WHERE role = 'sporcu'
    AND lower(email) IN (
      'zeynep-sonmez@meydan.test',
      'buse-naz-cakiroglu@meydan.test',
      'mete-gazoz@meydan.test',
      'necati-er@meydan.test',
      'sureyya-demir@meydan.test',
      'yusuf-dikec@meydan.test'
    )
),
fans AS (
  SELECT id, email,
         ROW_NUMBER() OVER (ORDER BY email) AS fn
  FROM public.profiles
  WHERE lower(email) IN ('taraftar1@meydan.test','taraftar2@meydan.test')
),
messages(idx, text) AS (
  VALUES
    (1,  'Seninleyim, sakin kal.'),
    (2,  'Bir nefes daha, bilirsin.'),
    (3,  'Türkiye seninle bugün.'),
    (4,  'Pes etme, bu maç senin.'),
    (5,  'Burdayız, sesini duyuyoruz.'),
    (6,  'Sen bu işi bilirsin, devam et.'),
    (7,  'Her vuruşa odaklan, gerisi gelir.'),
    (8,  'Tribün ayakta, güveniyoruz.'),
    (9,  'Sakin nefes, temiz kafa.'),
    (10, 'Yıllarca bu an için çalıştın.')
)
INSERT INTO public.cheers (athlete_id, fan_id, message, match_date, is_toxic)
SELECT
  a.id,
  f.id,
  m.text,
  CURRENT_DATE,
  false
FROM athletes a
CROSS JOIN messages m
JOIN fans f ON f.fn = ((m.idx - 1) % 2) + 1;

-- -------------------------------------------------------------
-- 4) Doğrulama (manuel — istersen çalıştır)
-- -------------------------------------------------------------
-- SELECT full_name, role, city, branch FROM public.profiles
--   WHERE lower(email) LIKE '%@meydan.test' ORDER BY role, full_name;
--
-- SELECT p.full_name AS sporcu, COUNT(*) AS temiz_cheer
-- FROM public.cheers c
-- JOIN public.profiles p ON p.id = c.athlete_id
-- WHERE c.match_date = CURRENT_DATE AND c.is_toxic = false
-- GROUP BY p.full_name
-- ORDER BY p.full_name;
