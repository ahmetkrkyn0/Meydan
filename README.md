# Meydan

> Her sporun bir meydanı var.

Meydan, Türkiye'de futbol dışı branşlarda emek veren sporcuları taraftarlar, gönüllü yetenekler ve markalarla buluşturan dijital bir spor platformudur. Amaç basit: daha fazla görünürlük, daha doğru destek ve sporcunun yolculuğunu yalnız bırakmayan bir topluluk.

## Neden Meydan?

Birçok sporcu başarıya giderken ekipmana, sponsora, görünürlüğe, motivasyona ya da doğru kişiye ulaşmaya ihtiyaç duyuyor. Meydan bu ihtiyacı tek bir deneyimde toplar: sporcu hikayesini anlatır, taraftar destek verir, markalar anlamlı eşleşmeler bulur.

## Öne Çıkanlar

- **Sporcu keşfi:** Branş, şehir ve profil odaklı modern keşif deneyimi.
- **Sessiz tezahürat:** Taraftar mesajlarını güvenli şekilde toplama ve maç sonrası özetleme.
- **İhtiyaç ve destek akışı:** Sporcuların maddi veya yetenek bazlı ihtiyaçlarını yayınlaması.
- **AI destekli eşleşme:** Sporcu ihtiyaçlarını uygun taraftar yetenekleriyle buluşturan akıllı eşleşme yapısı.
- **Şehrimde spor:** Yakındaki etkinlikleri harita, filtre ve ulaşılabilirlik mantığıyla gösterme.
- **Rol bazlı paneller:** Sporcu, taraftar ve marka için ayrı akışlar.

## Teknoloji

**Frontend**

- React 19
- TanStack Start, TanStack Router, TanStack Query
- Tailwind CSS 4
- Radix UI, shadcn/ui yaklaşımı
- Framer Motion
- Leaflet, Recharts

**Backend**

- FastAPI
- Supabase
- Gemini API
- OpenRouteService
- bcrypt tabanlı şifreleme

## Hızlı Başlangıç

### Frontend

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak Vite geliştirme sunucusunda çalışır.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend çalıştığında Swagger arayüzü:

```text
http://localhost:8000/docs
```

## Ortam Değişkenleri

Frontend için:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Backend için `backend/.env` içinde:

```env
SUPABASE_URL=
SUPABASE_KEY=
GEMINI_API_KEY=
ORS_API_KEY=
```

## Kullanışlı Komutlar

```bash
npm run dev              # Geliştirme sunucusu
npm run build            # Production build
npm run preview          # Build önizleme
npm run lint             # Kod kalitesi kontrolü
npm run format           # Prettier formatlama
npm run audit:contrast   # Kontrast denetimi
```

## Proje Yapısı

```text
src/routes              Sayfalar ve route yapısı
src/components/meydan   Meydan'a özel arayüz bileşenleri
src/components/ui       Ortak UI bileşenleri
src/lib                 API, session ve veri dönüştürücü yardımcıları
src/assets              Görseller ve sahne varlıkları
backend                 FastAPI servisleri ve veritabanı entegrasyonu
backend/migrations      Supabase veritabanı geçişleri
```

## Ürün Ruhunun Özeti

Meydan yalnızca bir bağış ya da profil platformu değil; sporcunun hikayesini, taraftarın desteğini ve markanın katkısını aynı sahada buluşturan bir deneyimdir.

## Lisans

Bu proje Apache License 2.0 ile lisanslanmıştır.
