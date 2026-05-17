"""Supabase veritabanı işlemleri."""

import os
from datetime import datetime, timezone
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)


def insert_cheer(cheer_data: dict, is_toxic: bool) -> None:
    """Tezahürat mesajını cheers tablosuna ekler."""
    try:
        kayit = {**cheer_data, "is_toxic": is_toxic}
        supabase.table("cheers").insert(kayit).execute()
    except Exception as e:
        print(f"Tezahürat ekleme hatası: {e}")
        raise


def get_cheers_for_match(athlete_id: str, match_date: str) -> list[dict]:
    """Belirli sporcu ve maç tarihi için tüm tezahüratları getirir."""
    try:
        response = (
            supabase.table("cheers")
            .select("*")
            .eq("athlete_id", athlete_id)
            .eq("match_date", match_date)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Tezahürat getirme hatası: {e}")
        raise


def find_matching_talents(query_embedding: list[float], athlete_id: str) -> list[dict]:
    """pgvector ile en yakın taraftar yeteneklerini bulur."""
    try:
        response = supabase.rpc(
            "match_talents",
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.3,
                "match_count": 3,
            },
        ).execute()
        return response.data
    except Exception as e:
        print(f"Yetenek eşleştirme hatası: {e}")
        raise


def _embedding_kolonlarini_cikar(kayit: dict) -> dict:
    """Embedding kolonlarını ve auth_token'ı dışarıya açmaz."""
    return {
        anahtar: deger
        for anahtar, deger in kayit.items()
        if not anahtar.endswith("_embedding")
        and anahtar != "embedding"
        and anahtar != "auth_token"
    }


def list_profiles(role=None, city=None, branch=None) -> list[dict]:
    """Profil kayıtlarını verilen filtrelere göre listeler."""
    try:
        query = supabase.table("profiles").select("*")
        if role:
            query = query.eq("role", role)
        if city:
            query = query.eq("city", city)
        if branch:
            query = query.eq("branch", branch)

        response = query.execute()
        return [_embedding_kolonlarini_cikar(kayit) for kayit in response.data]
    except Exception as e:
        print(f"Profil listeleme hatası: {e}")
        raise


def get_profile(profile_id: str) -> dict | None:
    """Tek bir profil kaydını id ile getirir."""
    try:
        response = (
            supabase.table("profiles")
            .select("*")
            .eq("id", profile_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return _embedding_kolonlarini_cikar(response.data[0])
    except Exception as e:
        print(f"Profil getirme hatası: {e}")
        raise


def get_profile_by_email(email: str) -> dict | None:
    """Email ile profil bulur (lowercase normalize edilmiş email beklenir)."""
    try:
        response = (
            supabase.table("profiles")
            .select("*")
            .ilike("email", email)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return _embedding_kolonlarini_cikar(response.data[0])
    except Exception as e:
        print(f"Email ile profil getirme hatası: {e}")
        raise


def get_profile_by_token(token: str) -> dict | None:
    """Auth token ile profil bulur."""
    try:
        response = (
            supabase.table("profiles")
            .select("*")
            .eq("auth_token", token)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return _embedding_kolonlarini_cikar(response.data[0])
    except Exception as e:
        print(f"Token ile profil getirme hatası: {e}")
        raise


def create_profile(data: dict) -> str:
    """Yeni profil kaydı oluşturur ve id değerini döner."""
    try:
        response = supabase.table("profiles").insert(data).execute()
        return response.data[0]["id"]
    except Exception as e:
        print(f"Profil oluşturma hatası: {e}")
        raise


def list_needs(athlete_id=None) -> list[dict]:
    """Sporcu ihtiyaçlarını doluluk durumuna göre listeler."""
    try:
        query = supabase.table("needs").select("*")
        if athlete_id:
            query = query.eq("athlete_id", athlete_id)

        response = query.order("is_fulfilled", desc=False).execute()
        return [_embedding_kolonlarini_cikar(kayit) for kayit in response.data]
    except Exception as e:
        print(f"İhtiyaç listeleme hatası: {e}")
        raise


def create_need(data: dict) -> str:
    """Yeni sporcu ihtiyacı oluşturur ve id değerini döner."""
    try:
        response = supabase.table("needs").insert(data).execute()
        return response.data[0]["id"]
    except Exception as e:
        print(f"İhtiyaç oluşturma hatası: {e}")
        raise


def fulfill_need(need_id: str, fulfilled_by: str):
    """Bir ihtiyacı karşılandı olarak işaretler."""
    try:
        (
            supabase.table("needs")
            .update({"is_fulfilled": True, "fulfilled_by": fulfilled_by})
            .eq("id", need_id)
            .execute()
        )
    except Exception as e:
        print(f"İhtiyaç karşılama hatası: {e}")
        raise


def list_journals(athlete_id: str) -> list[dict]:
    """Sporcunun günlük kayıtlarını en yeniden eskiye listeler."""
    try:
        response = (
            supabase.table("journals")
            .select("*")
            .eq("athlete_id", athlete_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Günlük listeleme hatası: {e}")
        raise


def create_journal(data: dict) -> str:
    """Yeni günlük kaydı oluşturur ve id değerini döner."""
    try:
        response = supabase.table("journals").insert(data).execute()
        return response.data[0]["id"]
    except Exception as e:
        print(f"Günlük oluşturma hatası: {e}")
        raise


def update_profile(profile_id: str, data: dict) -> dict | None:
    """Profil kaydını günceller ve güncel kaydı döner."""
    try:
        response = (
            supabase.table("profiles")
            .update(data)
            .eq("id", profile_id)
            .execute()
        )
        if not response.data:
            return None
        return _embedding_kolonlarini_cikar(response.data[0])
    except Exception as e:
        print(f"Profil güncelleme hatası: {e}")
        raise


def delete_profile(profile_id: str) -> bool:
    """Profil kaydını siler ve sonuç bilgisini döner."""
    try:
        response = supabase.table("profiles").delete().eq("id", profile_id).execute()
        return bool(response.data)
    except Exception as e:
        print(f"Profil silme hatası: {e}")
        raise


def get_need(need_id: str) -> dict | None:
    """Tek bir ihtiyaç kaydını id ile getirir."""
    try:
        response = (
            supabase.table("needs")
            .select("*")
            .eq("id", need_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return _embedding_kolonlarini_cikar(response.data[0])
    except Exception as e:
        print(f"İhtiyaç getirme hatası: {e}")
        raise


def update_need(need_id: str, data: dict) -> dict | None:
    """İhtiyaç kaydını günceller ve güncel kaydı döner."""
    try:
        response = supabase.table("needs").update(data).eq("id", need_id).execute()
        if not response.data:
            return None
        return _embedding_kolonlarini_cikar(response.data[0])
    except Exception as e:
        print(f"İhtiyaç güncelleme hatası: {e}")
        raise


def delete_need(need_id: str) -> bool:
    """İhtiyaç kaydını siler ve sonuç bilgisini döner."""
    try:
        response = supabase.table("needs").delete().eq("id", need_id).execute()
        return bool(response.data)
    except Exception as e:
        print(f"İhtiyaç silme hatası: {e}")
        raise


def get_journal(journal_id: str) -> dict | None:
    """Tek bir günlük kaydını id ile getirir."""
    try:
        response = (
            supabase.table("journals")
            .select("*")
            .eq("id", journal_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return response.data[0]
    except Exception as e:
        print(f"Günlük getirme hatası: {e}")
        raise


def update_journal(journal_id: str, data: dict) -> dict | None:
    """Günlük kaydını günceller ve güncel kaydı döner."""
    try:
        response = supabase.table("journals").update(data).eq("id", journal_id).execute()
        if not response.data:
            return None
        return response.data[0]
    except Exception as e:
        print(f"Günlük güncelleme hatası: {e}")
        raise


def delete_journal(journal_id: str) -> bool:
    """Günlük kaydını siler ve sonuç bilgisini döner."""
    try:
        response = supabase.table("journals").delete().eq("id", journal_id).execute()
        return bool(response.data)
    except Exception as e:
        print(f"Günlük silme hatası: {e}")
        raise


def create_donation(data: dict) -> dict:
    """Yeni bir bağış kaydı oluşturur. Need_id verilmişse o ihtiyacın
    collected_amount alanını günceller."""
    try:
        response = supabase.table("donations").insert(data).execute()
        donation = response.data[0]

        if data.get("need_id") and data.get("status", "completed") == "completed":
            # collected_amount artır.
            need = get_need(data["need_id"])
            if need is not None:
                current = need.get("collected_amount") or 0
                new_value = current + int(data["amount"])
                update_need(data["need_id"], {"collected_amount": new_value})

        return donation
    except Exception as e:
        print(f"Bağış oluşturma hatası: {e}")
        raise


def list_donations_by_supporter(supporter_profile_id: str) -> list[dict]:
    """Taraftarın yaptığı bağışları listeler."""
    try:
        response = (
            supabase.table("donations")
            .select("*")
            .eq("supporter_profile_id", supporter_profile_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []
    except Exception as e:
        print(f"Bağış listeleme hatası (supporter): {e}")
        raise


def list_donations_by_athlete(athlete_profile_id: str) -> list[dict]:
    """Bir sporcunun aldığı bağışları listeler."""
    try:
        response = (
            supabase.table("donations")
            .select("*")
            .eq("athlete_profile_id", athlete_profile_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []
    except Exception as e:
        print(f"Bağış listeleme hatası (athlete): {e}")
        raise


def athlete_donation_summary(athlete_profile_id: str) -> dict:
    """Bir sporcunun toplam ve destekçi sayısı özetini döner."""
    try:
        rows = list_donations_by_athlete(athlete_profile_id)
        total = sum(int(r.get("amount", 0)) for r in rows if r.get("status") == "completed")
        unique_supporters = len({r.get("supporter_profile_id") for r in rows if r.get("status") == "completed"})
        return {
            "total_amount": total,
            "supporter_count": unique_supporters,
            "donation_count": len([r for r in rows if r.get("status") == "completed"]),
        }
    except Exception as e:
        print(f"Bağış özeti hatası: {e}")
        raise


def follow_athlete(follower_profile_id: str, athlete_profile_id: str) -> str:
    """Bir taraftarın bir sporcuyu takip etmesini kaydeder. Aynı kayıt varsa korur."""
    try:
        response = (
            supabase.table("follows")
            .upsert(
                {
                    "follower_profile_id": follower_profile_id,
                    "athlete_profile_id": athlete_profile_id,
                },
                on_conflict="follower_profile_id,athlete_profile_id",
            )
            .execute()
        )
        return response.data[0]["id"] if response.data else ""
    except Exception as e:
        print(f"Takip ekleme hatası: {e}")
        raise


def unfollow_athlete(follower_profile_id: str, athlete_profile_id: str) -> bool:
    """Takip ilişkisini siler."""
    try:
        response = (
            supabase.table("follows")
            .delete()
            .eq("follower_profile_id", follower_profile_id)
            .eq("athlete_profile_id", athlete_profile_id)
            .execute()
        )
        return bool(response.data)
    except Exception as e:
        print(f"Takip silme hatası: {e}")
        raise


def list_followed_athletes(follower_profile_id: str) -> list[dict]:
    """Verilen kullanıcının takip ettiği sporcu profillerini döner."""
    try:
        follow_response = (
            supabase.table("follows")
            .select("athlete_profile_id")
            .eq("follower_profile_id", follower_profile_id)
            .execute()
        )
        athlete_ids = [row["athlete_profile_id"] for row in (follow_response.data or [])]
        if not athlete_ids:
            return []

        profile_response = (
            supabase.table("profiles")
            .select("*")
            .in_("id", athlete_ids)
            .execute()
        )
        return [_embedding_kolonlarini_cikar(p) for p in (profile_response.data or [])]
    except Exception as e:
        print(f"Takip listeleme hatası: {e}")
        raise


def count_athlete_followers(athlete_profile_id: str) -> int:
    """Bir sporcunun takipçi sayısını döner."""
    try:
        response = (
            supabase.table("follows")
            .select("id", count="exact")
            .eq("athlete_profile_id", athlete_profile_id)
            .execute()
        )
        return response.count or 0
    except Exception as e:
        print(f"Takipçi sayısı hatası: {e}")
        raise


def is_following(follower_profile_id: str, athlete_profile_id: str) -> bool:
    """Verilen taraftar bu sporcuyu takip ediyor mu?"""
    try:
        response = (
            supabase.table("follows")
            .select("id")
            .eq("follower_profile_id", follower_profile_id)
            .eq("athlete_profile_id", athlete_profile_id)
            .limit(1)
            .execute()
        )
        return bool(response.data)
    except Exception as e:
        print(f"Takip kontrol hatası: {e}")
        raise


def list_events(city=None, branch=None, is_free=None) -> list[dict]:
    """Etkinlik kayıtlarını verilen filtrelere göre listeler."""
    try:
        query = supabase.table("events").select("*")
        if city:
            query = query.eq("city", city)
        if branch:
            query = query.eq("branch", branch)
        if is_free is not None:
            query = query.eq("is_free", is_free)

        response = query.order("event_date", desc=False).execute()
        return response.data
    except Exception as e:
        print(f"Etkinlik listeleme hatası: {e}")
        raise


def list_nearby_events(city=None, branch=None, is_free=None, range_window=None) -> list[dict]:
    """Yaklaşan etkinlikleri şehir, branş, ücret ve zaman aralığı filtresiyle listeler."""
    try:
        from datetime import timedelta

        now_dt = datetime.now(timezone.utc)
        now = now_dt.isoformat()
        query = supabase.table("events").select("*").gte("event_date", now)

        if range_window == "week":
            upper = (now_dt + timedelta(days=7)).isoformat()
            query = query.lte("event_date", upper)
        elif range_window == "month":
            upper = (now_dt + timedelta(days=31)).isoformat()
            query = query.lte("event_date", upper)

        if city:
            query = query.eq("city", city)
        if branch:
            query = query.eq("branch", branch)
        if is_free is not None:
            query = query.eq("is_free", is_free)

        response = query.order("event_date", desc=False).execute()
        return response.data
    except Exception as e:
        print(f"Yakındaki etkinlik listeleme hatası: {e}")
        raise


def get_event(event_id: str) -> dict | None:
    """Tek bir etkinlik kaydını id ile getirir."""
    try:
        response = (
            supabase.table("events")
            .select("*")
            .eq("id", event_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return response.data[0]
    except Exception as e:
        print(f"Etkinlik getirme hatası: {e}")
        raise


def create_event(data: dict) -> str:
    """Yeni etkinlik kaydı oluşturur ve id değerini döner."""
    try:
        response = supabase.table("events").insert(data).execute()
        return response.data[0]["id"]
    except Exception as e:
        print(f"Etkinlik oluşturma hatası: {e}")
        raise


def update_event(event_id: str, data: dict) -> dict | None:
    """Etkinlik kaydını günceller ve güncel kaydı döner."""
    try:
        response = supabase.table("events").update(data).eq("id", event_id).execute()
        if not response.data:
            return None
        return response.data[0]
    except Exception as e:
        print(f"Etkinlik güncelleme hatası: {e}")
        raise


def delete_event(event_id: str) -> bool:
    """Etkinlik kaydını siler ve sonuç bilgisini döner."""
    try:
        response = supabase.table("events").delete().eq("id", event_id).execute()
        return bool(response.data)
    except Exception as e:
        print(f"Etkinlik silme hatası: {e}")
        raise
