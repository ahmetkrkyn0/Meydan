# Backend Eksik Endpoint Roadmap

Tarih: 2026-05-17

Bu doküman frontend'in henüz mock kullandığı ekranlar için backend'de açılması gereken endpoint ve tabloları sıralar. Her madde Supabase migration + FastAPI endpoint + Pydantic model + supabase_service helper olarak düşünülmeli.

## Tamamlananlar (bu PR'da eklendi)

- `follows` tablosu + endpointleri (takip sistemi) — migration 002.
- `needs` tablosuna yapılandırılmış alanlar — migration 001.
- `/events/nearby` filtreleri (is_free, range).

## 1. Donations / Destekler (KRİTİK)

**Frontend ekranlar:** `/destekle/$slug`, `/desteklerim`, ana sayfa toplanan miktar.

**Tablo: `donations`**
```sql
id                uuid PK
supporter_profile_id  uuid REFERENCES profiles(id)
athlete_profile_id    uuid REFERENCES profiles(id)
need_id           uuid NULL REFERENCES needs(id)
amount            integer        -- kuruş değil, TL tam sayı
message           text NULL
is_recurring      boolean DEFAULT false
status            text           -- 'pending' | 'completed' | 'failed'
external_ref      text NULL      -- ödeme sağlayıcı referans no
created_at        timestamptz DEFAULT now()
```

**Endpoint'ler:**
- `POST /donations` — bağış kaydı oluştur (ödeme akışı dışarıda).
- `GET /donations?supporter_id=` — kullanıcının destek geçmişi.
- `GET /donations/athlete/{id}` — sporcuya gelen destekler.
- `GET /donations/summary/{athlete_id}` — toplam/aylık/donor sayısı.

**Önemli:** Gerçek ödeme henüz yok. `status='completed'` ile direkt kaydedilebilir (demo). Iyzico/Stripe/Paddle entegrasyonu ayrı bir iş.

## 2. Badges (rozetler)

**Frontend ekran:** `/rozetlerim`, `/dashboard` rozet progress strip.

**Tablo: `badges`**
```sql
id          text PK         -- 'first-step', 'kalpten-destek' gibi slug
name        text
description text
icon        text NULL
criteria    jsonb           -- {"type":"donation_count","min":1}
```

**Tablo: `profile_badges`**
```sql
profile_id  uuid REFERENCES profiles(id)
badge_id    text REFERENCES badges(id)
earned_at   timestamptz
PRIMARY KEY (profile_id, badge_id)
```

**Endpoint'ler:**
- `GET /badges` — tüm rozet kataloğu.
- `GET /badges/profile/{id}` — bir kullanıcının kazandığı rozetler.
- `POST /badges/award` — manuel rozet ver (admin/oto).

**Not:** Rozet kazanma kuralları (örn. ilk destek → 'first-step') backend'de trigger ya da donation insert sonrası kontrolle yapılabilir. Şimdilik manuel.

## 3. Brand panel (marka eşleştirme + kampanya + teklif)

**Frontend ekranlar:** `/marka-panel/*`.

**Tablo: `campaigns`**
```sql
id            uuid PK
brand_profile_id  uuid REFERENCES profiles(id)
title         text
description   text
budget        integer
target_branch text NULL
target_city   text NULL
status        text         -- 'draft' | 'active' | 'ended'
created_at    timestamptz
```

**Tablo: `brand_offers`**
```sql
id                  uuid PK
campaign_id         uuid REFERENCES campaigns(id)
athlete_profile_id  uuid REFERENCES profiles(id)
amount              integer
message             text
status              text     -- 'pending' | 'accepted' | 'rejected'
created_at          timestamptz
```

**Endpoint'ler:**
- `POST /campaigns`, `GET /campaigns?brand_id=`, `PATCH /campaigns/{id}`.
- `POST /brand-offers`, `GET /brand-offers?athlete_id=`, `PATCH /brand-offers/{id}` (kabul/red).
- `POST /campaigns/{id}/match` — Gemini embedding ile sporcu önerisi (mevcut `/needs/match` modelinden esinlen).

## 4. Notifications

**Frontend ekran:** `/bildirimler`.

**Tablo: `notifications`**
```sql
id          uuid PK
profile_id  uuid REFERENCES profiles(id)
type        text       -- 'cheer' | 'donation' | 'follow' | 'offer'
title       text
body        text
ref_id      uuid NULL  -- ilgili kayıt id'si
is_read     boolean DEFAULT false
created_at  timestamptz
```

**Endpoint'ler:**
- `GET /notifications?profile_id=`
- `PATCH /notifications/{id}/read`
- `POST /notifications/mark-all-read?profile_id=`

**Trigger:** donation/follow/cheer/offer insert sonrası karşı tarafa otomatik notification yazılması (DB trigger ya da app-level).

## 5. Messages (mesajlar)

**Frontend ekran:** `/mesajlar`.

**Tablo: `conversations`** + **`messages`** klasik 1-1 model. Detay bu turda yok.

## 6. Auth (REGISTER / LOGIN / SESSION)

**Frontend ekranlar:** `/giris`, `/kayit`.

**Karar gerekli:**
- Opsiyon A: Supabase Auth (Email + Şifre). FastAPI Supabase JWT'sini doğrular.
- Opsiyon B: Custom session (cookie). Daha çok iş.

**Önerilen:** A.

Auth eklendiğinde silinecek geçici varsayımlar:
- `meydan.activeAthleteId` localStorage anahtarı.
- `meydan.activeFanId` localStorage anahtarı.
- Sporcu panelindeki `<ActiveAthletePicker />` widget'ı.
- `canli/$id` içindeki `fan_id: "demo-fan"` literal'ı.

## 7. Live matches (canlı maçlar)

**Frontend ekran:** `/canli`, `/canli/$id`, `/tezahurat*`.

**Tablo: `matches`**
```sql
id              uuid PK
athlete_profile_id  uuid REFERENCES profiles(id)
opponent_name   text
opponent_flag   text NULL
sport           text
status          text       -- 'soon' | 'live' | 'ended'
starts_at       timestamptz
score           text NULL
set_score       text NULL
created_at      timestamptz
```

**Endpoint'ler:** klasik CRUD + `GET /matches/live`.

Skor güncellemesi muhtemelen Supabase Realtime ile gerçek zamanlı yayılır.

## 8. Talent match detayları

**Frontend ekran:** `/yetenek/eslesme`.

Backend `/needs/match` zaten var ama frontend tarafı henüz bağlı değil. Yetenek sayfasında seçilen "yetenek türü + şehir + müsaitlik" backend'de `talent_match` benzeri bir endpoint çağırmalı.

## 9. Profile creation (sporcu/taraftar/marka)

`POST /profiles` zaten var. Frontend tarafında `kayit.tsx` ve `marka-panel/profil-olustur.tsx` bu endpoint'e bağlanmalı. Auth gelene kadar email/şifre olmadan, sadece form bilgisiyle kayıt mümkün.

---

## Öncelik sırası önerisi

1. **Auth** — diğer her şeyin temeli; demo-fan/picker'lar kalkar.
2. **Donations** — para destek ekranı en sık etkileşilen aksiyon.
3. **Notifications** — kullanıcı tutma için kritik.
4. **Brand panel** — proje değer önermesinin önemli yarısı.
5. **Live matches** — şimdilik mock yeterli görünüyor.
6. **Badges** — gamification, son sıraya alınabilir.
