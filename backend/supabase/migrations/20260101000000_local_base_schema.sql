-- =============================================================
-- Yerel geliştirme için temel şema (koddan yeniden oluşturuldu)
-- =============================================================
-- Orijinal tablolar Supabase Studio'da elle açılmıştı ve repoda
-- yoktu; backend/migrations/001-010 bu tabloların var olduğunu
-- varsayıyor. Bu dosya sütunları şu kaynaklardan çıkarır:
--   backend/supabase_service.py, backend/main.py, src/lib/api.ts,
--   backend/migrations/001-010
-- Sadece yerel Supabase içindir; production şemasıyla birebir
-- aynı olmayabilir. 001-010, config.toml'daki [db.seed] ile bu
-- dosyadan sonra uygulanır.
-- =============================================================

create extension if not exists vector with schema extensions;

create table public.profiles (
  id               uuid primary key default gen_random_uuid(),
  role             text not null check (role in ('sporcu', 'taraftar', 'marka')),
  full_name        text not null,
  branch           text,
  city             text,
  bio              text,
  ranking          text,
  value_tags       text[],
  offered_talent   text,
  brand_budget     integer,
  brand_values     text,
  avatar_url       text,
  social_links     jsonb,
  -- gemini_service.generate_embedding 768 boyut üretir (bkz. 008/009 match_talents)
  talent_embedding extensions.vector(768),
  created_at       timestamptz not null default now()
);

create table public.needs (
  id             uuid primary key default gen_random_uuid(),
  athlete_id     uuid not null references public.profiles(id) on delete cascade,
  title          text not null,
  description    text,
  is_fulfilled   boolean default false,
  fulfilled_by   text,
  need_embedding extensions.vector(768),
  created_at     timestamptz not null default now()
);

create table public.journals (
  id         uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  audio_url  text,
  created_at timestamptz not null default now()
);

create table public.cheers (
  id         uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  fan_id     uuid not null references public.profiles(id) on delete cascade,
  message    text not null,
  match_date date not null,
  is_toxic   boolean not null default false,
  created_at timestamptz not null default now()
);

create index cheers_athlete_match_idx on public.cheers (athlete_id, match_date);

create table public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  athlete_ids text[],
  branch      text,
  city        text,
  event_date  timestamptz,
  is_free     boolean default false,
  latitude    double precision,
  longitude   double precision,
  venue       text,
  created_at  timestamptz not null default now()
);

create index events_city_date_idx on public.events (city, event_date);
