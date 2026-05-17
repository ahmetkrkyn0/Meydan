"""
Taraftar profillerinin offered_talent alanlarını Gemini embedding ile
vektörleştirir ve talent_embedding kolonuna yazar.

Eski sürüm offered_talent'in tamamını (yetenek + şehir + müsaitlik + not)
embed ediyordu — şehir/müsaitlik ortak meta kelimeleri yüzünden alâkasız
profiller %70+ skor alıyordu. Bu sürüm sadece "Yetenekler:" ve "Not:"
segmentlerini embed eder; şehir/müsaitlik DB kolonlarında zaten var.

Kullanım: python scripts/embed_talents.py            # boş olanları doldur
          python scripts/embed_talents.py --rebuild  # hepsini yeniden hesapla
"""

import os
import sys

# scripts/ klasöründen çalıştırıldığında backend/ root'una erişim için
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
from supabase import create_client
import gemini_service

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"), override=True)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)


def _semantic_text(offered_talent: str) -> str:
    """offered_talent'ten sadece anlamsal kısımları (Yetenekler + Not) çıkarır.
    main.py'deki _extract_talent_semantic_text ile eş davranmalı."""
    if not offered_talent:
        return ""
    kept: list[str] = []
    for segment in offered_talent.split(" · "):
        key, sep, value = segment.partition(":")
        if not sep:
            continue
        if key.strip() in ("Yetenekler", "Not"):
            cleaned = value.strip()
            if cleaned:
                kept.append(cleaned)
    return ". ".join(kept) if kept else offered_talent


def embed_tüm_taraftarlar(rebuild: bool = False) -> None:
    """Embedding'i boş olan taraftar profillerini vektörleştirir.
    rebuild=True ise mevcut embedding'leri de yeniden hesaplar."""
    query = (
        supabase.table("profiles")
        .select("id, full_name, offered_talent")
        .eq("role", "taraftar")
    )
    if not rebuild:
        query = query.is_("talent_embedding", "null")

    response = query.execute()
    kayitlar = response.data
    print(f"İşlenecek kayıt sayısı: {len(kayitlar)} (rebuild={rebuild})")

    for kayit in kayitlar:
        kullanici_id = kayit["id"]
        isim = kayit.get("full_name", "?")
        yetenek_metni = _semantic_text(kayit.get("offered_talent", ""))

        if not yetenek_metni:
            print(f"  [ATLA] {isim} — offered_talent boş veya anlamsal içerik yok")
            continue

        try:
            embedding = gemini_service.generate_embedding(yetenek_metni)
            supabase.table("profiles").update(
                {"talent_embedding": embedding}
            ).eq("id", kullanici_id).execute()
            print(f"  [OK] {isim} — embedding yazıldı ({len(embedding)} boyut)")
        except Exception as e:
            print(f"  [HATA] {isim} — {e}")

    print("Bitti.")


if __name__ == "__main__":
    embed_tüm_taraftarlar(rebuild="--rebuild" in sys.argv)
