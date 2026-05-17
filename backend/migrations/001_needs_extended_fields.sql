-- =============================================================
-- Migration 001: needs tablosuna yapılandırılmış alanlar ekle
-- Tarih: 2026-05-17
-- Amaç: Frontend'in form üzerinden gönderdiği alanların
--       (need_type, target_amount, deadline vb.) düz description
--       string'ine sıkışmasını engellemek.
-- =============================================================
-- Supabase Studio > SQL Editor'de bu dosyayı bir defa çalıştır.
-- Idempotent: tekrar çalışırsa hata vermez.
-- =============================================================

ALTER TABLE public.needs
  ADD COLUMN IF NOT EXISTS need_type        text
    CHECK (need_type IN ('money', 'talent')),
  ADD COLUMN IF NOT EXISTS category         text,
  ADD COLUMN IF NOT EXISTS target_amount    integer,
  ADD COLUMN IF NOT EXISTS collected_amount integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deadline         date,
  ADD COLUMN IF NOT EXISTS talent_needed    text,
  ADD COLUMN IF NOT EXISTS availability     text
    CHECK (availability IN ('local', 'online')),
  ADD COLUMN IF NOT EXISTS is_urgent        boolean DEFAULT false;

-- Geriye dönük: mevcut kayıtlar varsa is_urgent NULL olabilir,
-- frontend tarafı bunu false olarak yorumluyor; veriyi düzeltmek isteyen olursa:
UPDATE public.needs SET is_urgent = COALESCE(is_urgent, false);
UPDATE public.needs SET collected_amount = COALESCE(collected_amount, 0);
