"""
Tek seferlik script: taraftar profillerinin offered_talent alanlarını
Gemini embedding ile vektörleştirir ve talent_embedding kolonuna yazar.

Kullanım: python scripts/embed_talents.py
"""

import os
import sys

# scripts/ klasöründen çalıştırıldığında backend/ root'una erişim için
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
from supabase import create_client
import gemini_service

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)


def embed_tüm_taraftarlar() -> None:
    """Embedding'i boş olan taraftar profillerini vektörleştirir."""
    # Sadece taraftar rolündeki ve embedding'i henüz olmayan kayıtları al
    response = (
        supabase.table("profiles")
        .select("id, full_name, offered_talent")
        .eq("role", "taraftar")
        .is_("talent_embedding", "null")
        .execute()
    )

    kayitlar = response.data
    print(f"İşlenecek kayıt sayısı: {len(kayitlar)}")

    for kayit in kayitlar:
        kullanici_id = kayit["id"]
        isim = kayit.get("full_name", "?")
        yetenek_metni = kayit.get("offered_talent", "")

        if not yetenek_metni:
            print(f"  [ATLA] {isim} — offered_talent boş")
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
    embed_tüm_taraftarlar()
