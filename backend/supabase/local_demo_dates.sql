-- =============================================================
-- Yerel demo: geçmişte kalan seed etkinliklerini ileri kaydırır
-- =============================================================
-- 007_ankara_events_seed.sql etkinlikleri Mayıs-Haziran 2026'ya
-- tarihli. /events/nearby sadece gelecekteki etkinlikleri döndüğü
-- için bunlar geçmişte kalınca /sehrimde haritası boş görünür.
-- Burada hepsi aynı gün farkıyla kaydırılır: en erkeni bugünden
-- 7 gün sonraya gelir, aralarındaki gün ve saatler korunur.
-- Sadece yerel veritabanını etkiler; repodaki seed dosyasına dokunmaz.
-- =============================================================

update public.events
set event_date = event_date + (
  date_trunc('day', now() + interval '7 days')
  - date_trunc('day', (select min(event_date) from public.events))
)
where (select min(event_date) from public.events) < now();
