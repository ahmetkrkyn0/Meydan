# Frontend - Backend Baglanti Raporu

Tarih: 17 Mayis 2026 (son guncelleme)

Bu dokuman, frontend mock datadan backend uyumlu veri akisine gecis icin yapilanlari ve kalan isleri ozetler.

## Son tur duzeltmeleri (2026-05-17)

Bu turda asagidaki kritik problemler kapatildi:

1. **Aktif sporcu / aktif taraftar varsayimi** kaldirildi. Auth yok, ama yerine
   `useActiveAthlete` ve `useActiveFan` hook'lari + `ActiveAthletePicker` widget'i
   geldi. localStorage'da `meydan.activeAthleteId` / `meydan.activeFanId` saklaniyor.
   Sporcu paneli ve canli tribun artik "ilk profili kap" davranmiyor.
2. **Canli tribun cheer kopuklugu** giderildi. Backend'de sporcu profili yoksa
   kullaniciya kirmizi uyari gosteriliyor; sessiz duser bug'i yok.
3. **Etkinlik koordinat goruntuleme bug'i** duzeltildi. Mapper ekran koordinati
   ureticek olan `coords`'u uretmeye devam ediyor ama orijinal lat/lon da
   `event.latitude`/`event.longitude` olarak korunup detay sayfasinda dogru
   bicimde gosteriliyor.
4. **Sehrimde double-filter** kaldirildi. Backend `/events/nearby` artik
   `is_free` ve `range` filtrelerini de destekliyor. Frontend client tarafi
   filtre sadece mock fallback'te calisiyor.
5. **Need create payload zenginlestirildi.** `need_type`, `category`,
   `target_amount`, `deadline`, `talent_needed`, `availability`, `is_urgent`
   alanlari artik backend'e structured olarak gidiyor. Migration 001 calistirilmali.
6. **Takip sistemi** eklendi. `follows` tablosu + `/follows*` endpoint'leri.
   Sporcu profil sayfasindaki "Takip Et" butonu artik canli. Dashboard "Senin
   sporcularin" artik gercek takip listesini gosteriyor. Migration 002 calistirilmali.
7. **Donations** akisi eklendi. `donations` tablosu + `/donations*` endpoint'leri.
   `/destekle/$slug` bagis kaydi atmaya basladi (odeme entegrasyonu HENUZ YOK).
   `/desteklerim` gercek bagis gecmisini gosteriyor. Migration 003 calistirilmali.
8. **Backend roadmap** dokumani yazildi: `backend/BACKEND_ROADMAP.md`.

## Calistirilmasi gereken SQL migration'lar

Supabase Studio > SQL Editor uzerinden tek seferlik:

- `backend/migrations/001_needs_extended_fields.sql`
- `backend/migrations/002_follows_table.sql`
- `backend/migrations/003_donations_table.sql`

Migration calistirilmadan once `/needs` POST ve `/follows*`, `/donations*`
endpoint'leri "column does not exist" / "relation does not exist" hatasi verir.

## Hala mock olan ekranlar

- Login / register / session
- Mesajlar, bildirimler, rozet kazanma
- Marka paneli (kampanyalar, teklifler, eslesme)
- Canli mac listesi/skor datasi
- Yetenek eslesme detay sayfasi

Bu ekranlar icin endpoint ve tablo plani: `backend/BACKEND_ROADMAP.md`.

---

## Orijinal rapor (gecmis)

## Kisa Durum

Planlanan ilk baglanti fazi yapildi.

Frontend artik backend endpointlerine dogrudan daginik sekilde baglanmiyor. Bunun yerine iki merkezi katman kullaniliyor:

- `src/lib/api.ts`: Backend HTTP istekleri burada toplandi.
- `src/lib/api-mappers.ts`: Backend'in sade response datasi frontend'in mevcut UI tiplerine burada donusturuluyor.

Bu yapi sayesinde backend schema degisirse veya auth eklendiginde her ekrani tek tek bozmak yerine cogunlukla bu iki dosya uzerinden ilerlemek mumkun olacak.

## Backend Base URL

Frontend API adresini su sirayla aliyor:

```ts
VITE_API_BASE_URL || "http://localhost:8000"
```

Local calisma icin backend `http://localhost:8000`, frontend `http://127.0.0.1:5173` uzerinden calisabilir.

## Eklenen Frontend API Fonksiyonlari

`src/lib/api.ts` icinde:

- `listProfiles`
- `getProfile`
- `listNeeds`
- `createNeed`
- `listJournals`
- `listNearbyEvents`
- `getEvent`
- `createCheer`

## Eklenen Mapper Fonksiyonlari

`src/lib/api-mappers.ts` icinde:

- Backend profile -> frontend athlete donusumu
- Backend event -> frontend event donusumu
- Backend need -> frontend need donusumu
- Backend journal -> frontend diary entry donusumu
- Slug ile backend profile/athlete bulma yardimcilari

Onemli karar: Backend datasinda frontend'in bekledigi her gorsel/zengin alan yok. Bu yuzden mapper katmani eksik alanlari mevcut mock datadan fallback ile tamamliyor. Bu bilincli bir karar; UI'nin kirilmasini engelliyor.

## Backend'e Baglanan Ekranlar

### Kesfet

Dosya: `src/routes/kesfet/index.tsx`

Backend:

- `GET /profiles?role=sporcu`

Davranis:

- Sporcu kartlari backend profillerinden uretiliyor.
- Backend kapaliysa veya data yoksa mock sporcular gosteriliyor.
- Filtreleme frontend tarafinda mevcut sekilde calisiyor.

### Dashboard

Dosya: `src/routes/dashboard.tsx`

Backend:

- `GET /profiles?role=sporcu`
- `GET /events/nearby`

Davranis:

- Takip edilen sporcu kartlari backend profillerinden beslenebiliyor.
- Yaklasan etkinlikler backend event datasindan beslenebiliyor.
- Backend yoksa mock fallback korunuyor.

### Sporcu Profil

Dosya: `src/routes/sporcu/$slug/index.tsx`

Backend:

- `GET /profiles?role=sporcu`

Davranis:

- URL slug'i backend profile `full_name` alanindan uretiliyor.
- Eski mock slug'lar da calismaya devam ediyor.
- Backend profilindeki eksik UI alanlari mapper tarafinda mock fallback ile tamamlanıyor.

### Sporcu Ihtiyaclari

Dosya: `src/routes/sporcu/$slug/ihtiyaclar.tsx`

Backend:

- `GET /profiles?role=sporcu`
- `GET /needs?athlete_id={profile_id}`

Davranis:

- Sporcu slug'i backend profile id'ye cevriliyor.
- O sporcunun ihtiyaclari backend'den cekiliyor.
- Backend data gelmezse eski mock/fallback akisi korunuyor.

### Sporcu Gunluk

Dosya: `src/routes/sporcu/$slug/gunluk.tsx`

Backend:

- `GET /profiles?role=sporcu`
- `GET /journals/{athlete_id}`

Davranis:

- Sporcu slug'i backend profile id'ye cevriliyor.
- Gunluk kayitlari backend'den cekiliyor.
- Backend data yoksa placeholder/mock akisi korunuyor.

### Sporcu Panel - Ihtiyaclarim

Dosya: `src/routes/sporcu-panel/ihtiyaclar.tsx`

Backend:

- `GET /profiles?role=sporcu`
- `GET /needs?athlete_id={profile_id}`

Davranis:

- Auth henuz olmadigi icin aktif sporcu gecici olarak backend'den gelen ilk `role=sporcu` profil kabul ediliyor.
- Bu varsayim ileride auth gelince session'daki `profile_id` ile degistirilmeli.

### Sporcu Panel - Ihtiyac Olustur

Dosya: `src/routes/sporcu-panel/ihtiyac-olustur.tsx`

Backend:

- `GET /profiles?role=sporcu`
- `POST /needs`

Davranis:

- Formdaki zengin UI alanlari backend'in mevcut `title` ve `description` yapisina sigacak sekilde description icine detay olarak ekleniyor.
- Backend'de en az bir sporcu profili yoksa yayinlama yapilmaz.
- Auth olmadigi icin aktif sporcu yine ilk backend sporcu profili olarak kabul edildi.

### Sehrimde

Dosya: `src/routes/sehrimde.tsx`

Backend:

- `GET /events/nearby?city={city}&branch={branch}`

Davranis:

- Sehir ve brans filtreleri backend query param olarak gonderiliyor.
- Harita ve liste backend event datasindan besleniyor.
- Backend yoksa demo event fallback calisiyor.

### Etkinlik Detay

Dosya: `src/routes/etkinlik/$id.tsx`

Backend:

- `GET /events/{event_id}`

Davranis:

- Event detay sayfasi backend event datasini kullanabiliyor.
- Eski mock event id'leriyle acilan sayfalarda fallback korunuyor.

### Yetenek Bagisi

Dosya: `src/routes/yetenek/index.tsx`

Backend:

- `GET /needs`
- `GET /profiles?role=sporcu`

Davranis:

- Aktif yetenek ihtiyaclari backend needs listesinden uretiliyor.
- Need kaydindaki `athlete_id`, backend profile ile eslestirilip kart bilgileri tamamlanıyor.
- Backend yoksa mock fallback korunuyor.

### Canli Tribun

Dosya: `src/routes/canli/$id.tsx`

Backend:

- `GET /profiles?role=sporcu`
- `POST /cheers`

Davranis:

- Mesaj UI'da aninda feed'e ekleniyor.
- Backend'de ilgili sporcu profili bulunursa ayni mesaj `/cheers` endpoint'ine gonderiliyor.
- Auth olmadigi icin `fan_id` gecici olarak `demo-fan`.
- Canli mac datasi henuz backend'den gelmiyor, mock kaldi.

## Bilincli Olarak Mock Kalan Alanlar

Bu alanlar henuz backend schema/endpoint olarak net olmadigi icin baglanmadi:

- Register / login / session
- Gercek kullanici profili secimi
- Canli mac listesi ve skor datası
- Marka akademik eslestirme
- Kampanyalar
- Marka teklifleri
- Rozetler
- Destek/odeme akisi
- Bildirimler
- Mesajlar
- Yetenek eslesme detaylari

Bu alanlara frontend'de sahte API baglantisi eklemek dogru olmaz; once backend modeli netlesmeli.

## Mevcut Gecici Varsayimlar

### Aktif Sporcu

Auth olmadigi icin sporcu panelinde aktif sporcu:

```txt
GET /profiles?role=sporcu sonucu gelen ilk profil
```

olarak kabul edildi.

Auth eklendiginde bu mantik:

```txt
session.user.profile_id
```

veya benzeri bir profile id kaynagina baglanmali.

### Aktif Taraftar

Canli tezahurat gonderiminde `fan_id` gecici olarak:

```txt
demo-fan
```

Auth eklendiginde backend'e gercek taraftar profile id gonderilmeli.

### Frontend Zengin Alanlari

Backend profile tablosunda su anda frontend'in bekledigi her alan yok:

- avatar/cutout gorselleri
- takipci sayisi
- destekci sayisi
- basarilar
- son mac sonuclari
- sosyal metrikler
- UI accent bilgileri

Bu alanlar simdilik mock fallback ile tamamlanıyor. Ileride gerekiyorsa backend schema genisletilebilir.

## Dogrulama

Calistirilan kontroller:

```bash
npm run build
```

Sonuc: Basarili.

Tarayicida acilan route'lar:

- `/kesfet`
- `/sehrimde`
- `/sporcu-panel/ihtiyaclar`
- `/sporcu-panel/ihtiyac-olustur`
- `/yetenek`
- `/canli/m1`

Sonuc: Sayfalar acildi, bos sayfa veya console error gorulmedi.

Calistirilan ek kontrol:

```bash
npm run lint
```

Sonuc: Basarisiz, fakat sebep bu baglanti isinden bagimsiz repo genelindeki lint/prettier ayarlari. Lint su anda `backend/venv` icini de tarıyor ve CRLF/Prettier hatalari basıyor. Bunun icin ayri bir lint config duzeltmesi gerekiyor.

## Siradaki Mantikli Adimlar

1. Backend ve frontend birlikte local calistirilip gercek Supabase datasi ile manuel ekran testi yapilmali.
2. Backend'de en az bir `role=sporcu` profil, birkac `needs`, birkac `journals`, birkac `events` kaydi oldugundan emin olunmali.
3. Auth/register/login karari verilmeli. Supabase Auth mu, custom profile-only demo mu netlesmeli.
4. Auth geldikten sonra `demo-fan` ve "ilk sporcu profili" varsayimlari kaldirilmali.
5. Marka eslestirme icin Deep Research sonucu geldikten sonra backend endpoint ve frontend ekran birlikte tasarlanmali.
6. Canli mac / skor datasi icin backend modeli kararlastirilmali veya Supabase Realtime tarafina ayrilmali.
7. Lint icin `backend/venv`, `dist`, build ciktilari ve gerekli generated dosyalar ignore edilmeli.

## Test Icin Hizli Not

Frontend dev server:

```txt
http://127.0.0.1:5173
```

Backend default:

```txt
http://localhost:8000
```

Frontend farkli backend adresine baglanacaksa `.env` icine:

```env
VITE_API_BASE_URL=http://localhost:8000
```

eklenebilir.
