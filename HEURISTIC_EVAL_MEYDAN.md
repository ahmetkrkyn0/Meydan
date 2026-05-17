# Heuristic Evaluation — Meydan

**Tarih:** 2026-05-17  
**Yöntem:** Nielsen 10 Heuristic + Alan Dix Prensipleri + WCAG 2.1 AA  
**Kapsam:** Dashboard, Keşfet, Sporcu Profili, Canlı Maçlar, Giriş, AppShell  
**Denetçi:** Claude (otomatik kod analizi)

---

## Severity Dağılımı

```
Catastrophic (4): 2
Major (3):        7
Minor (2):        8
Cosmetic (1):     4
────────────────────
Toplam:          21
```

---

## Bulgu Tablosu

| # | Heuristic | Bulgu | Konum | Severity | Önerilen Düzeltme | Kanıt |
|---|-----------|-------|-------|----------|-------------------|-------|
| 1 | H1: Sistem durumu görünürlüğü | Dashboard 3 sorgu çekiyor (`profilesQuery`, `eventsQuery`, `followsQuery`) ama hiç loading skeleton yok; sporcu kartları boş array ile anında render olup veri gelince "flash" yaşatıyor | `dashboard.tsx:82–101` | **4** | Her card grid için `isLoading` koşulunda `<Skeleton>` bileşeni ekle; `profilesQuery.isLoading` kontrolü şu an hiç kullanılmıyor | Nielsen H1 |
| 2 | H1: Sistem durumu görünürlüğü | "Takip Et" / "Takip Ediliyor" mutation sırasında butona hiç loading state binmiyor; kullanıcı çift tıklayabilir | `sporcu/$slug/index.tsx:95–115` | **3** | `followMutation.isPending` ile butonu `disabled` + spinner göster | Nielsen H1 |
| 3 | H1: Sistem durumu görünürlüğü | Canlı maçlar (`canli/index.tsx`) gerçek API'ye bağlanmadığında boş state gösteriyor ama "yükleniyor" ile "gerçekten veri yok" ayrımı kullanıcıya belli değil | `canli/index.tsx:27–29` | **2** | `isLoading` durumunda "Maçlar yükleniyor…" yazısı veya skeleton ekle | Nielsen H1 |
| 4 | H2: Gerçek dünya ile eşleşme | "B" kısaltması bin yerine kullanılıyor (`formatNumber`: `1200 → "1.2B"`). Türkçe'de "B" milyar demek, bin değil. "1,2B" → "1.200" veya "1,2B" karışıklık yaratır | `sporcu/$slug/index.tsx:48–51` | **3** | `"B"` → `"B"` yerine `"K"` (kilo) veya `"bin"` kullan: `1200 → "1,2B"` değil `"1.200"` ya da `"1,2K"` | Nielsen H2 / Dix: Consistency |
| 5 | H2: Gerçek dünya ile eşleşme | Dashboard hero live ticker'da "Defne · Tenis · Set 2" ve "Seda · Boks · R3" hardcoded; gerçek canlı veri değil, kullanıcıya yanlış bilgi veriyor | `dashboard.tsx:176–183` | **2** | `liveMatches` array'inden dinamik olarak çek veya açıkça "örnek" etiketi ekle | Nielsen H2 |
| 6 | H2: Gerçek dünya ile eşleşme | "Canlı · Featured" etiketi İngilizce; tüm UI Türkçe | `dashboard.tsx:267` | **1** | `"Canlı · Öne Çıkan"` yap | Nielsen H2 |
| 7 | H3: Kullanıcı kontrolü ve özgürlüğü | Takip etme işlemi için "geri al" (unfollow) akışı var ama hiç onay dialog'u yok; yanlışlıkla takipten çıkılabiliyor | `sporcu/$slug/index.tsx:116–135` | **2** | Unfollow'da `AlertDialog` ile "Takibi bırakmak istediğine emin misin?" onayı ekle | Nielsen H3 / Dix: Recoverability |
| 8 | H3: Kullanıcı kontrolü ve özgürlüğü | Giriş formunda validation hataları form submit'te gösteriliyor; kullanıcı formu doldurup submit'e basana kadar hangi alanların hatalı olduğunu bilemiyor | `giris.tsx:29–42` | **2** | `onBlur` ile alan bazlı inline validation ekle | Nielsen H3 |
| 9 | H3: Kullanıcı kontrolü ve özgürlüğü | Undo mekanizması yok: Destekle işlemi yapıldıktan sonra sayfada "geri al" seçeneği sunulmuyor | `destekle/$slug.tsx` | **3** | İşlem sonrası 5 saniyelik toast "Desteğin gönderildi · Geri al" sunarak iptal penceresi aç | Nielsen H3 / Dix: Recoverability |
| 10 | H4: Tutarlılık ve standartlar | `Sonner` toast altyapısı kurulu (`components/ui/sonner.tsx`) ama takip, destek, mesaj gönderme gibi hiçbir aksiyonda kullanılmıyor; sadece formlarda satır içi hata mesajı var | `sporcu/$slug/index.tsx`, `mesajlar.tsx` | **3** | Başarılı mutationlarda `toast.success()`, hatalarda `toast.error()` çağır | Nielsen H4 / Dix: Consistency |
| 11 | H4: Tutarlılık ve standartlar | "Takip et" butonu keşfet sayfasında `rounded-full bg-violet/12` stilinde, sporcu profilinde ise farklı bir stilde; aynı aksiyon farklı görünüyor | `kesfet/index.tsx:646`, `sporcu/$slug/index.tsx:380` | **2** | Takip aksiyonu için tek bir `FollowButton` bileşeni oluştur | Nielsen H4 / Dix: Consistency |
| 12 | H4: Tutarlılık ve standartlar | Hata mesajları bazen `text-coral` renkte `<p>` olarak (giriş/kayıt), bazen yoktu; uygulama genelinde standart hata gösterimi yok | `giris.tsx:116–118`, `kayit.tsx` | **1** | Merkezi `<ErrorMessage>` bileşeni oluştur, tüm formlarda kullan | Nielsen H4 |
| 13 | H5: Hata önleme | Kayıt formunda şifre gücü göstergesi yok; kullanıcı zayıf şifre giriyor ve sadece submit sonrası hata alıyor | `kayit.tsx` | **2** | Şifre alanına `onInput` ile canlı güç göstergesi (zayıf/orta/güçlü) ekle | Nielsen H5 / Dix: Prevention |
| 14 | H5: Hata önleme | Destekle akışında aylık tutar girildikten sonra "Devam et" yerine direkt submit — kullanıcıya özet onay ekranı gösterilmiyor | `destekle/$slug.tsx` | **3** | Ödeme öncesi "₺X/ay · [Sporcu] · Devam et" özet adımı ekle | Nielsen H5 |
| 15 | H6: Tanıma, hatırlama değil | Keşfet filtre bar'ında aktif filtreler sadece chip üzerinde renk değişimiyle gösteriliyor; toplam kaç filtrenin aktif olduğu header'da görünmüyor | `kesfet/index.tsx:275–370` | **2** | Aktif filtre sayısını filtre başlığının yanında badge olarak göster: `Filtrele (2)` | Nielsen H6 / Dix: Visibility |
| 16 | H6: Tanıma, hatırlama değil | Sporcu profili sekmeler (Yolculuk, Günlük, İhtiyaçlar) arasında dolaşırken hangi sekmede olunduğu `Link` aktif stili ile belirtilmiş ama sekme içeriği yüklenirken geçiş animasyonu sayfa içeriğini silip yeniden yükleyebiliyor; kullanıcı konumunu kaybedebiliyor | `sporcu/$slug/index.tsx:220–260` | **1** | Sekme geçişlerinde scroll pozisyonunu koru (`scrollRestoration`) | Nielsen H6 |
| 17 | H7: Esneklik ve verimlilik | Keşfet sayfasında sporcu aramak için arama kutusu yok; yalnızca filtre + liste var; güçlü kullanıcılar isimle arama yapamıyor | `kesfet/index.tsx` | **3** | Filtre bar'ına sporcu adıyla arama input'u ekle | Nielsen H7 / Dix: Accessibility |
| 18 | H7: Esneklik ve verimlilik | Dashboard'da "Takip ettiklerimi göster" / "Tümünü göster" toggle'ı yok; takip edilen sporcular ile önerilen sporcular tek listede karışık görünüyor | `dashboard.tsx:93–101` | **2** | `followsAreReal` durumunu toggle ile kullanıcıya kontrol sun | Nielsen H7 |
| 19 | H8: Estetik ve minimalist tasarım | Canlı maçlar sayfasında `featured` + `rest` grid + `ended` olmak üzere 3 ayrı bölüm var; aralarındaki ayrım görsel olarak yeterince güçlü değil, sayfanın tamamı tek bir blok gibi akıyor | `canli/index.tsx:40–120` | **1** | Bölümler arası `<hr>` veya farklı arkaplan bantları ile ayrım güçlendir | Nielsen H8 |
| 20 | H9: Hata mesajları | Giriş formu yanlış şifrede "Giriş başarısız." diyor; hangi alanın hatalı olduğu, ne yapılması gerektiği belirtilmiyor — WCAG 3.3.1 AA ihlali | `giris.tsx:40–42` | **4** | `"E-posta veya şifre hatalı. Şifreni sıfırlamak ister misin?"` gibi açıklayıcı + yönlendirici mesaj yaz. **WCAG 3.3.1 AA** | Nielsen H9 / WCAG 3.3.1 |
| 21 | H10: Yardım ve dokümantasyon | Yeni kullanıcı ilk girişte ne yapacağını bilemiyor; "Sessiz Tezahürat", "Yetenek Bağışı" gibi platforma özgü kavramları açıklayan onboarding akışı veya tooltip yok | `dashboard.tsx`, `AppShell.tsx` | **2** | İlk girişte kavramları kısaca açıklayan tek seferlik onboarding overlay veya "?" tooltip ekle | Nielsen H10 / Dix: Learnability |

---

## Heuristic Özeti

| Heuristic | Taranan | Bulgu Sayısı | En Yüksek Severity |
|-----------|---------|--------------|-------------------|
| H1: Sistem durumu | ✅ | 3 | 4 |
| H2: Gerçek dünya | ✅ | 3 | 3 |
| H3: Kullanıcı kontrolü | ✅ | 3 | 3 |
| H4: Tutarlılık | ✅ | 3 | 3 |
| H5: Hata önleme | ✅ | 2 | 3 |
| H6: Tanıma | ✅ | 2 | 2 |
| H7: Esneklik | ✅ | 2 | 3 |
| H8: Estetik | ✅ | 1 | 1 |
| H9: Hata mesajları | ✅ | 1 | 4 |
| H10: Yardım | ✅ | 1 | 2 |

---

## Kritik Öncelikler (Severity 4)

### 🔴 #1 — Dashboard Skeleton Yok (Severity 4)
`dashboard.tsx:82–101` — 3 async sorgu doldurulmamış kartlarla render olup veri gelince layout kayıyor. Kullanıcı "platform bozuk" algısı edinebilir.  
**Hızlı çözüm:** `profilesQuery.isLoading` → sporcu grid'ine `<Skeleton className="h-48 rounded-3xl" />` kartları bast.

### 🔴 #2 — Hata Mesajı Açıklayıcı Değil · WCAG 3.3.1 (Severity 4)
`giris.tsx:40–42` — "Giriş başarısız." mesajı kullanıcıya ne yapması gerektiğini söylemiyor. WCAG 3.3.1 AA gerektirir: hata mesajı sorunu ve çözümü açıklamalı.  
**Hızlı çözüm:** `"E-posta veya şifre hatalı. Şifreni unuttuysan →"` + şifre sıfırlama linki.

---

## Alan Dix Prensip Eşleştirmesi

| Dix Prensibi | İlgili Bulgular |
|--------------|----------------|
| **Visibility** (ne yapılabileceği görünür olmalı) | #1, #15, #17 |
| **Consistency** (benzer şeyler benzer görünmeli) | #4, #10, #11, #12 |
| **Recoverability** (hatadan dönülebilmeli) | #7, #9 |
| **Learnability** (yeni kullanıcı öğrenebilmeli) | #21 |
| **Prevention** (hata oluşmadan önlenmeli) | #13, #14 |
| **Accessibility** (tüm kullanıcılara erişilebilir) | #17, #20 |

---

*Sonraki adım: `/sevgi-ai:usability-eval-plan` ile gerçek kullanıcı testi senaryoları oluştur.*
