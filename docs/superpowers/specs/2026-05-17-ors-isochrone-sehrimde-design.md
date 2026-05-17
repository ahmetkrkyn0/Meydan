# OpenRouteService Isochrone — "Şehrimde Ne Var?" Harita Tasarımı

**Tarih:** 2026-05-17
**Sayfa:** `/sehrimde`
**Kapsam:** Mevcut SVG mock haritayı gerçek Leaflet haritasıyla değiştirmek ve ORS isochrone API'siyle "şehir merkezinden X dakika içinde gidilebilen etkinlikler" filtresi eklemek.

## Hedef

Kullanıcı bir şehir seçtiğinde, o şehrin merkezinden seçtiği ulaşım modu (yürüyüş/bisiklet/araç) ile seçtiği süre (15/30/45 dk) içinde ulaşılabilir bölgeyi haritada polygon olarak görür ve sadece o polygon içindeki etkinlikler listede kalır.

## Mimari — Hibrit (B)

```
Browser ─► GET /geo/isochrone?city=İstanbul&mode=foot-walking&minutes=30
                                ▼
                        Backend (FastAPI)
                          - ORS_API_KEY env'den okur
                          - CITY_CENTERS sözlüğünden lat/lng bulur
                          - 24h TTL in-memory cache
                          - POST openrouteservice.org/v2/isochrones/{profile}
                          - Polygon GeoJSON döner
                                ▼
Browser ◄── { center: [lat,lng], polygon: GeoJSON }
Browser: Turf.js booleanPointInPolygon ile etkinlikleri filtreler.
Browser: Leaflet'te tile + polygon + marker katmanlarını çizer.
```

**API key güvenliği:** Key ASLA frontend bundle'a girmez. Backend proxy ile gizlenir.

## Kontrat — Yeni Backend Endpoint

`GET /geo/isochrone`

**Query params:**
- `city` (str, required) — `CITY_OPTIONS` içinden bir şehir adı
- `mode` (enum, required) — `foot-walking` | `cycling-regular` | `driving-car`
- `minutes` (int, required) — 15 | 30 | 45

**Response 200:**
```json
{
  "center": [41.0082, 28.9784],
  "polygon": { "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [[...]] }, "properties": {} },
  "cached": true
}
```

**Hata durumları:**
- 400 — şehir tanınmıyor / mode/minutes geçersiz
- 502 — ORS upstream hatası
- 503 — ORS_API_KEY env yok

## Backend Bileşenleri

### 1. `backend/.env` ve `.env.example`
`ORS_API_KEY=` satırı eklenir. `.env` git'e gitmiyor (kontrol edilecek).

### 2. `backend/ors_service.py` (yeni dosya)
- `CITY_CENTERS: dict[str, tuple[float, float]]` — 81 il merkezi (lat, lng)
- `_cache: dict[str, tuple[float, dict]]` — basit in-memory TTL cache (24h)
- `get_isochrone(city, mode, minutes) -> dict`:
  - Şehir lookup → KeyError → 400 raise
  - Cache key: `f"{city}|{mode}|{minutes}"`
  - Cache hit + TTL geçerli → cached=True döner
  - Miss → ORS HTTP POST → Polygon Feature parse → cache'e koy
- `httpx` veya `requests` ile çağırır (requirements.txt'ye eklenir).

### 3. `backend/main.py`
- `@app.get("/geo/isochrone")` endpoint'i.
- Pydantic `Literal` ile mode validation.
- Auth gerektirmez (public — kullanıcı login olmadan haritayı görür).

## Frontend Bileşenleri

### 1. Bağımlılıklar
- `leaflet` + `@types/leaflet` — gerçek harita kütüphanesi (~40KB)
- `@turf/boolean-point-in-polygon` — point-in-polygon (~8KB, tek fonksiyon import)

### 2. `src/lib/api.ts`
- `IsochroneMode` type
- `getIsochrone({ city, mode, minutes })` fonksiyonu — `{ center, polygon, cached }` döner.

### 3. `src/routes/sehrimde.tsx` (yeniden yazılır)
- SVG mock kalkar.
- Leaflet `<MapContainer>` ekler — react-leaflet KULLANMIYORUZ (extra dep), useEffect içinde imperatif Leaflet API çağırılır:
  ```ts
  const map = L.map(divRef.current).setView(center, 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
  ```
- Yeni state: `mode: "foot-walking" | "cycling-regular" | "driving-car"`, `minutes: 15 | 30 | 45`
- `useQuery(['isochrone', city, mode, minutes], () => getIsochrone(...))`
  - `enabled: city !== ALL_CITIES` — tüm şehirler seçiliyse isochrone yok.
- Polygon layer ve marker'lar useEffect içinde haritaya `addLayer/removeLayer` ile eklenir/temizlenir.
- Filtre: `useMemo` — sadece koordinatı olan + polygon içindekileri tutar. ALL_CITIES seçiliyse tüm event'leri pin olarak göster, polygon yok.

### 4. Mode + süre chip UI
Mevcut filtre satırının altına ek satır:
```
🚶 Yürüyerek  🚴 Bisikletle  🚗 Araçla  │  15 dk  30 dk  45 dk
```

## Şehir Merkezleri — İlk Sürüm

İlk implementasyonda Türkiye'nin 7 büyük şehri (mevcut FEATURED_CITIES ve test event'leriyle örtüşür):
İstanbul, Ankara, İzmir, Bursa, Antalya, Eskişehir, Adana.
Geri kalan 74 il için bir sonraki PR'da CSV'den seed edilir. ALL_CITIES için isochrone fonksiyonu devre dışı (tüm Türkiye haritası gösterilir).

## Veri Stratejisi

Backend `events` tablosundaki kayıtların çoğunda `latitude/longitude` boş. Migration `006_event_coords_backfill.sql`:
- `latitude IS NULL AND longitude IS NULL` olan eventler için `city` kolonuna göre `CITY_CENTERS` koordinatlarını UPDATE eder.
- Yeni event'ler için kolon eklemeye gerek yok — mevcut.

Polygon içinde olmayan veya koordinatsız event'ler haritada görünmez ama liste tarafında "şehir filtresine uyanlar" olarak görünür (kullanıcı kafası karışmasın diye küçük badge: "Konum yok").

## Hata / Edge Case'ler

| Durum | Davranış |
|---|---|
| `city = "Tüm şehirler"` | Isochrone çağrısı yapılma, tüm Türkiye haritası göster, tüm pin'leri çiz |
| ORS 5xx | Toast: "Harita servisi geçici olarak çalışmıyor, etkinlikler listeden görüntülenebilir." Polygon çizme, pin'leri çiz |
| Event lat/lng null | Pin koyma; liste tarafında badge ile göster |
| Şehir CITY_CENTERS'da yok | 400 — UI: "Bu şehir için harita henüz hazır değil" |
| Cache miss + kullanıcı çok hızlı tıklarsa | useQuery deduplikasyonu zaten halleder |

## Test Stratejisi

Manuel doğrulama akışı (`npm run dev` + `uvicorn`):
1. `/sehrimde` aç → İstanbul + Yürüyerek + 30dk → polygon çizilir, sadece içindeki event'ler kalır
2. Mode değiştir Araç → 30dk → polygon büyür, daha çok event görünür
3. Şehir Bursa → polygon Bursa merkezinde
4. ALL_CITIES → polygon kalkar, tüm event'ler görünür
5. Backend .env'den ORS_API_KEY sil + restart → graceful "harita servisi çalışmıyor"

## Out of Scope (Bu PR'da Yok)

- Manuel "haritaya tıkla başlangıç noktası belirle"
- navigator.geolocation kullanımı
- Yön tarifi (directions)
- Adres → koordinat (geocoding)
- Tüm 81 il merkezi (sadece 7 büyük il bu PR'da)
- ORS quota monitoring/alerting
- Redis cache (in-memory yeterli demo için)

## Sonraki Adımlar

İmplementasyon planına bu spec eşlik edecek. Sıra: backend env → backend endpoint → migration → frontend deps → frontend rewrite → manuel test.
