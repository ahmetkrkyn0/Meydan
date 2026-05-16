"""Meydan — FastAPI ana uygulama."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import gemini_service
import supabase_service

app = FastAPI(title="Meydan Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request modelleri ---

class CheerRequest(BaseModel):
    athlete_id: str
    fan_id: str
    message: str
    match_date: str


class NeedMatchRequest(BaseModel):
    athlete_id: str
    title: str
    description: str


# --- Endpoint'ler ---

@app.post("/cheers")
def post_cheer(body: CheerRequest):
    """Taraftar tezahüratını toksisite kontrolünden geçirip kaydeder."""
    try:
        is_toxic = gemini_service.check_toxicity(body.message)
        cheer_data = {
            "athlete_id": body.athlete_id,
            "fan_id": body.fan_id,
            "message": body.message,
            "match_date": body.match_date,
        }
        supabase_service.insert_cheer(cheer_data, is_toxic)
        return {"status": "ok", "is_toxic": is_toxic}
    except Exception as e:
        print(f"/cheers hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cheers/summary/{athlete_id}/{match_date}")
def get_cheer_summary(athlete_id: str, match_date: str):
    """Maç için temiz tezahüratları özetler."""
    try:
        tumü = supabase_service.get_cheers_for_match(athlete_id, match_date)
        temizler = [c for c in tumü if not c.get("is_toxic", True)]
        mesajlar = [c["message"] for c in temizler]

        summary = gemini_service.summarize_cheers(mesajlar) if mesajlar else ""
        top_messages = mesajlar[:5]

        return {
            "total": len(tumü),
            "safe_count": len(temizler),
            "summary": summary,
            "top_messages": top_messages,
        }
    except Exception as e:
        print(f"/cheers/summary hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/needs/match")
def match_need(body: NeedMatchRequest):
    """Sporcu ihtiyacını taraftar yetenekleriyle eşleştirir."""
    try:
        metin = body.title + ". " + body.description
        embedding = gemini_service.generate_embedding(metin)
        matches = supabase_service.find_matching_talents(embedding, body.athlete_id)
        return {"matches": matches}
    except Exception as e:
        print(f"/needs/match hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))
