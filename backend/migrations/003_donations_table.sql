-- =============================================================
-- Migration 003: donations tablosu — taraftarın sporcuya yaptığı destek
-- Tarih: 2026-05-17
-- Amaç: Destek miktarını ve kuyruğunu kalıcı tutmak. Gerçek ödeme
--       entegrasyonu henüz yok; status='completed' ile demo amaçlı
--       direkt kaydedilir.
-- =============================================================
-- Supabase Studio > SQL Editor'de çalıştır. Idempotent.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.donations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supporter_profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  athlete_profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  need_id               uuid NULL REFERENCES public.needs(id) ON DELETE SET NULL,
  amount                integer NOT NULL CHECK (amount > 0),
  message               text NULL,
  is_recurring          boolean NOT NULL DEFAULT false,
  status                text NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed')),
  external_ref          text NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS donations_supporter_idx ON public.donations (supporter_profile_id);
CREATE INDEX IF NOT EXISTS donations_athlete_idx   ON public.donations (athlete_profile_id);
CREATE INDEX IF NOT EXISTS donations_need_idx      ON public.donations (need_id);

-- Bir need karşılandığında collected_amount otomatik artsın diye
-- trigger tercih edilebilir; şimdilik backend tarafında manuel update yapacağız.
