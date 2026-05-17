-- =============================================================
-- Migration 004: profiles tablosuna auth alanları ekle
-- Tarih: 2026-05-17
-- Amaç: Demo auth — email + token tabanlı. Şifre yok (Seçenek A).
--       Bir email = bir rol kuralı: email unique.
-- =============================================================
-- Supabase Studio > SQL Editor'de çalıştır. Idempotent.
-- =============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email      text,
  ADD COLUMN IF NOT EXISTS auth_token text;

-- Unique constraint email üzerinde.
-- NOT NULL yapmıyoruz çünkü migration öncesi profiller olabilir.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique_idx
  ON public.profiles (lower(email))
  WHERE email IS NOT NULL;

-- Token üzerinde fast lookup için index.
CREATE INDEX IF NOT EXISTS profiles_auth_token_idx
  ON public.profiles (auth_token)
  WHERE auth_token IS NOT NULL;
