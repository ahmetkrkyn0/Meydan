# Meydan Backend API Handoff

Son guncelleme: 2026-05-17

Bu dokuman frontend ekibinin mevcut backend CRUD ve AI destekli endpoint'leri baglamasi icin hazirlandi. Backend FastAPI ile calisiyor ve Swagger dokumani otomatik uretiliyor.

## Calistirma ve Swagger

Local base URL:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

Frontend tarafinda tum request'ler JSON body ile gonderilmeli.

```http
Content-Type: application/json
```

## Genel Notlar

- Backend dosyalari: `backend/main.py`, `backend/supabase_service.py`
- CORS su an acik: frontend local ortamdan backend'e istek atabilir.
- UUID alanlari Supabase tarafindan uretiliyor. `POST` response'unda donen `id` frontend state veya route icin saklanmali.
- Embedding kolonlari frontend'e donmez: `talent_embedding`, `need_embedding`, `values_embedding`, `embedding` response'lardan temizlenir.
- Auth/register/login henuz backend'e bagli degil. Repoda `users` tablosu gorunmuyor; bu konu Supabase Auth olarak ayri fazda ele alinmali.
- `DELETE` islemleri test verisiyle denenmeli. Iliskili kayitlarda foreign key/cascade ayarlari varsa DB seviyesinde etki eder.

## Roller

Backend profil rollerini Turkce enum olarak bekler:

```text
sporcu | taraftar | marka
```

Frontend'de Ingilizce role state'i varsa map edilmelidir:

```ts
const roleMap = {
  athlete: "sporcu",
  fan: "taraftar",
  brand: "marka",
} as const;
```

## Response ve Hata Formati

Basarili create:

```json
{
  "id": "uuid",
  "status": "created"
}
```

Basarili update:

```json
{
  "status": "updated",
  "profile": {}
}
```

Basarili delete:

```json
{
  "status": "deleted"
}
```

Bulunamayan kayit:

```json
{
  "detail": "Profil bulunamadı"
}
```

Bos PATCH body:

```json
{
  "detail": "Güncellenecek alan yok"
}
```

## Profiles

Profil tipleri: sporcu, taraftar, marka.

### GET /profiles

Query parametreleri opsiyonel:

```text
role=sporcu|taraftar|marka
city=string
branch=string
```

Ornekler:

```text
GET /profiles
GET /profiles?role=sporcu
GET /profiles?role=taraftar&city=İstanbul
GET /profiles?branch=atletizm
```

Response:

```json
{
  "profiles": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "role": "sporcu",
      "full_name": "Ada Yılmaz",
      "branch": "atletizm",
      "city": "İzmir",
      "bio": "Orta mesafe koşucusu.",
      "ranking": "Türkiye U18 3.sü",
      "value_tags": ["disiplin", "azim"],
      "created_at": "2026-05-17T00:00:00+00:00"
    }
  ]
}
```

### GET /profiles/{profile_id}

Response tek profil objesidir.

```text
GET /profiles/11111111-1111-1111-1111-111111111111
```

### POST /profiles

Sporcu:

```json
{
  "role": "sporcu",
  "full_name": "Ada Yılmaz",
  "branch": "atletizm",
  "city": "İzmir",
  "bio": "Orta mesafe koşucusu.",
  "ranking": "Türkiye U18 3.sü",
  "value_tags": ["disiplin", "azim"]
}
```

Taraftar:

```json
{
  "role": "taraftar",
  "full_name": "Deniz Kaya",
  "city": "İstanbul",
  "bio": "Sporculara gönüllü destek vermek istiyorum.",
  "value_tags": ["gönüllülük", "destek"],
  "offered_talent": "Fizyoterapi öğrencisiyim, sakatlık sonrası egzersiz desteği verebilirim."
}
```

Marka:

```json
{
  "role": "marka",
  "full_name": "Meydan Spor",
  "branch": "çoklu branş",
  "city": "Ankara",
  "bio": "Genç sporcuları destekleyen yerel marka.",
  "brand_budget": 50000,
  "brand_values": "Azim, toplumsal fayda, sürdürülebilir destek"
}
```

Response:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "status": "created"
}
```

Not: `role="taraftar"` ve `offered_talent` doluysa backend otomatik embedding uretir.

### PATCH /profiles/{profile_id}

Partial update destekler. Sadece degisen alanlar gonderilebilir.

```json
{
  "offered_talent": "Sporcu beslenmesi ve antrenman sonrası toparlanma konusunda destek verebilirim.",
  "city": "İstanbul"
}
```

Response:

```json
{
  "status": "updated",
  "profile": {
    "id": "22222222-2222-2222-2222-222222222222",
    "role": "taraftar",
    "full_name": "Deniz Kaya",
    "city": "İstanbul",
    "offered_talent": "Sporcu beslenmesi ve antrenman sonrası toparlanma konusunda destek verebilirim."
  }
}
```

Not: Taraftar `offered_talent` degisirse backend embedding'i otomatik yeniler.

### DELETE /profiles/{profile_id}

```text
DELETE /profiles/22222222-2222-2222-2222-222222222222
```

Response:

```json
{
  "status": "deleted"
}
```

## Needs

Sporcu ihtiyaclari.

### GET /needs

Query parametresi opsiyonel:

```text
athlete_id=uuid
```

Ornekler:

```text
GET /needs
GET /needs?athlete_id=11111111-1111-1111-1111-111111111111
```

Not: `is_fulfilled=false` kayitlar once gelir.

Response:

```json
{
  "needs": [
    {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "athlete_id": "11111111-1111-1111-1111-111111111111",
      "title": "Yarış ayakkabısı desteği",
      "description": "Yaklaşan yarış için ayakkabıya ihtiyacım var.",
      "is_fulfilled": false,
      "fulfilled_by": null,
      "created_at": "2026-05-17T00:00:00+00:00"
    }
  ]
}
```

### POST /needs

```json
{
  "athlete_id": "11111111-1111-1111-1111-111111111111",
  "title": "Yarış ayakkabısı desteği",
  "description": "Yaklaşan bölgesel yarış için orta mesafe koşuya uygun yarış ayakkabısına ihtiyacım var."
}
```

Response:

```json
{
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "status": "created"
}
```

Not: Backend `title + ". " + description` metninden otomatik `need_embedding` uretir.

### PATCH /needs/{need_id}/fulfill

Ihtiyaci karsilandi olarak isaretler.

```json
{
  "fulfilled_by": "22222222-2222-2222-2222-222222222222"
}
```

Response:

```json
{
  "status": "fulfilled"
}
```

### PATCH /needs/{need_id}

Partial update destekler.

```json
{
  "title": "Güncel yarış ayakkabısı desteği",
  "description": "Yaklaşan yarış için hafif ve orta mesafe koşuya uygun ayakkabıya ihtiyacım var."
}
```

Response:

```json
{
  "status": "updated",
  "need": {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "athlete_id": "11111111-1111-1111-1111-111111111111",
    "title": "Güncel yarış ayakkabısı desteği",
    "description": "Yaklaşan yarış için hafif ve orta mesafe koşuya uygun ayakkabıya ihtiyacım var.",
    "is_fulfilled": false,
    "fulfilled_by": null
  }
}
```

Not: `title` veya `description` degisirse backend embedding'i otomatik yeniler.

### DELETE /needs/{need_id}

```text
DELETE /needs/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
```

Response:

```json
{
  "status": "deleted"
}
```

## Journals

Sporcu gunlukleri.

### GET /journals/{athlete_id}

En yeni kayit en ustte gelir.

```text
GET /journals/11111111-1111-1111-1111-111111111111
```

Response:

```json
{
  "journals": [
    {
      "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "athlete_id": "11111111-1111-1111-1111-111111111111",
      "content": "Bugünkü antrenmanda tempo koşusu yaptım.",
      "audio_url": null,
      "created_at": "2026-05-17T00:00:00+00:00"
    }
  ]
}
```

### POST /journals

```json
{
  "athlete_id": "11111111-1111-1111-1111-111111111111",
  "content": "Bugünkü antrenmanda tempo koşusu yaptım. Son sette zorlandım ama sürelerim iyileşti.",
  "audio_url": "https://example.com/audio/journal-1.mp3"
}
```

`audio_url` opsiyoneldir.

Response:

```json
{
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "status": "created"
}
```

### PATCH /journals/{journal_id}

```json
{
  "content": "Bugünkü antrenmanda tempo koşusu yaptım. Son sette zorlandım ama sürelerim geçen haftaya göre daha iyi.",
  "audio_url": null
}
```

Response:

```json
{
  "status": "updated",
  "journal": {
    "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "athlete_id": "11111111-1111-1111-1111-111111111111",
    "content": "Bugünkü antrenmanda tempo koşusu yaptım. Son sette zorlandım ama sürelerim geçen haftaya göre daha iyi.",
    "audio_url": null
  }
}
```

### DELETE /journals/{journal_id}

```text
DELETE /journals/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
```

Response:

```json
{
  "status": "deleted"
}
```

## Events

Etkinlikler.

### GET /events

Query parametreleri opsiyonel:

```text
city=string
branch=string
is_free=true|false
```

Ornekler:

```text
GET /events
GET /events?city=İzmir
GET /events?branch=atletizm
GET /events?city=İzmir&branch=atletizm&is_free=true
```

Not: `event_date` artan sirayla gelir.

Response:

```json
{
  "events": [
    {
      "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
      "title": "İzmir Atletizm Hazırlık Yarışı",
      "athlete_ids": ["11111111-1111-1111-1111-111111111111"],
      "branch": "atletizm",
      "city": "İzmir",
      "event_date": "2026-06-15T18:00:00+03:00",
      "is_free": true,
      "latitude": 38.4237,
      "longitude": 27.1428,
      "venue": "Atatürk Stadı Atletizm Pisti",
      "created_at": "2026-05-17T00:00:00+00:00"
    }
  ]
}
```

### GET /events/nearby

Harita ve "Sehrimde ne var?" ekrani icin yaklasan etkinlikleri getirir. Gecmis etkinlikler donmez.

Query parametreleri opsiyonel:

```text
city=string
branch=string
```

Ornekler:

```text
GET /events/nearby
GET /events/nearby?city=İzmir
GET /events/nearby?city=İzmir&branch=atletizm
```

Response:

```json
{
  "events": [
    {
      "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
      "title": "İzmir Atletizm Hazırlık Yarışı",
      "athlete_ids": ["11111111-1111-1111-1111-111111111111"],
      "branch": "atletizm",
      "city": "İzmir",
      "event_date": "2026-06-15T18:00:00+03:00",
      "is_free": true,
      "latitude": 38.4237,
      "longitude": 27.1428,
      "venue": "Atatürk Stadı Atletizm Pisti"
    }
  ]
}
```

Frontend haritada marker basarken `latitude` ve `longitude` bos olan etkinlikleri filtrelemelidir.

### GET /events/{event_id}

```text
GET /events/cccccccc-cccc-cccc-cccc-cccccccccccc
```

Response tek event objesidir.

### POST /events

```json
{
  "title": "İzmir Atletizm Hazırlık Yarışı",
  "athlete_ids": ["11111111-1111-1111-1111-111111111111"],
  "branch": "atletizm",
  "city": "İzmir",
  "event_date": "2026-06-15T18:00:00+03:00",
  "is_free": true,
  "latitude": 38.4237,
  "longitude": 27.1428,
  "venue": "Atatürk Stadı Atletizm Pisti"
}
```

`athlete_ids` mutlaka JSON array olmalidir. Tek sporcu icin bile:

```json
{
  "athlete_ids": ["11111111-1111-1111-1111-111111111111"]
}
```

Response:

```json
{
  "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "status": "created"
}
```

### PATCH /events/{event_id}

```json
{
  "venue": "İzmir Atatürk Stadı",
  "event_date": "2026-06-16T19:00:00+03:00",
  "is_free": true
}
```

Response:

```json
{
  "status": "updated",
  "event": {
    "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
    "venue": "İzmir Atatürk Stadı",
    "event_date": "2026-06-16T19:00:00+03:00",
    "is_free": true
  }
}
```

### DELETE /events/{event_id}

```text
DELETE /events/cccccccc-cccc-cccc-cccc-cccccccccccc
```

Response:

```json
{
  "status": "deleted"
}
```

## Cheers

Mevcut endpoint'ler korunuyor.

### POST /cheers

Taraftar mesajini toksisite kontrolunden gecirir ve kaydeder.

```json
{
  "athlete_id": "11111111-1111-1111-1111-111111111111",
  "fan_id": "22222222-2222-2222-2222-222222222222",
  "message": "Bugün çok iyiydin, devam et!",
  "match_date": "2026-06-15"
}
```

Response:

```json
{
  "status": "ok",
  "is_toxic": false
}
```

### GET /cheers/summary/{athlete_id}/{match_date}

```text
GET /cheers/summary/11111111-1111-1111-1111-111111111111/2026-06-15
```

Response:

```json
{
  "total": 10,
  "safe_count": 9,
  "summary": "Bugün 9 kişi seninleydi...",
  "top_messages": ["Bugün çok iyiydin, devam et!"]
}
```

## AI Matching

### POST /needs/match

Bir sporcu ihtiyacini taraftar yetenekleriyle eslestirir.

```json
{
  "athlete_id": "11111111-1111-1111-1111-111111111111",
  "title": "Fizyoterapi desteği",
  "description": "Sakatlık sonrası toparlanma için egzersiz desteğine ihtiyacım var."
}
```

Response:

```json
{
  "matches": [
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "full_name": "Deniz Kaya",
      "offered_talent": "Fizyoterapi öğrencisiyim...",
      "similarity": 0.82
    }
  ]
}
```

Not: `matches` icindeki kolonlar Supabase `match_talents` RPC response'una gore degisebilir.

## Onerilen Frontend Akislari

### Kayit sonrasi profil olusturma

Auth henuz bagli olmadigi icin simdilik frontend mock auth sonrasi ilgili role gore `POST /profiles` kullanabilir.

```text
signup role athlete -> POST /profiles role=sporcu
signup role fan     -> POST /profiles role=taraftar
signup role brand   -> POST /profiles role=marka
```

### Sporcu dashboard

```text
GET /profiles/{athlete_id}
GET /needs?athlete_id={athlete_id}
GET /journals/{athlete_id}
GET /events/nearby?branch={branch}&city={city}
```

### Taraftar dashboard

```text
GET /profiles?role=sporcu
GET /needs
PATCH /needs/{need_id}/fulfill
POST /cheers
```

### Marka dashboard

```text
GET /profiles?role=sporcu
GET /events
```

`brand_matches` tablosu Supabase'de var ancak backend CRUD endpoint'i yok. Bu tablo sistem uretimi eslesme sonucu gibi duruyor; manuel CRUD olarak kullanilmasi onerilmez.

## Frontend Icin Dikkat Edilecek Alanlar

- `event_date` ISO string olarak gonderilmeli: `2026-06-15T18:00:00+03:00`
- `athlete_ids` array olmali, string degil.
- PATCH request'lerinde sadece degisen alanlari gondermek yeterli.
- Bos PATCH body `400` doner.
- `GET /profiles` ve `GET /needs` response'larinda embedding kolonlari yoktur.
- Delete aksiyonlari icin UI'da confirm modal kullanilmasi onerilir.
- Auth baglanana kadar frontend local state veya mock session ile `profile_id` saklayabilir.
