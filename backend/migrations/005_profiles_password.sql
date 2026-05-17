-- =============================================================
-- Migration 005: profiles tablosuna password_hash kolonu ekle
-- Tarih: 2026-05-17
-- Amaç: Demo auth artık email + şifre. password_hash bcrypt hash'i
--       saklar, asla plaintext şifre değil.
-- =============================================================
-- Supabase Studio > SQL Editor'de çalıştır. Idempotent.
-- =============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS password_hash text;

-- NOT NULL yapmıyoruz; migration öncesi profiller varsa password olmadan
-- yaşıyor olabilirler. Yeni kayıtlar /auth/register üzerinden şifreyle gelir.
