"""Supabase veritabanı işlemleri."""

import os
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
