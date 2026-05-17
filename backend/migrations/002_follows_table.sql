-- =============================================================
-- Migration 002: follows tablosu — taraftarın takip ettiği sporcular
-- Tarih: 2026-05-17
-- Amaç: Dashboard'daki "Senin sporcuların" listesi ve takip butonu için
--       persistent takip ilişkisi. Auth gelene kadar follower_profile_id
--       herhangi bir profil id'si olabilir.
-- =============================================================
-- Supabase Studio > SQL Editor'de çalıştır.
-- Idempotent.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.follows (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  athlete_profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_profile_id, athlete_profile_id)
);

CREATE INDEX IF NOT EXISTS follows_follower_idx ON public.follows (follower_profile_id);
CREATE INDEX IF NOT EXISTS follows_athlete_idx  ON public.follows (athlete_profile_id);
