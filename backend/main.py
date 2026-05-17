"""Meydan — FastAPI ana uygulama."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

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


class ProfileCreateRequest(BaseModel):
    role: Literal["sporcu", "taraftar", "marka"]
    full_name: str
    branch: str | None = None
    city: str | None = None
    bio: str | None = None
    ranking: str | None = None
    value_tags: list[str] | None = None
    offered_talent: str | None = None
    brand_budget: int | None = None
    brand_values: str | None = None


class NeedCreateRequest(BaseModel):
    athlete_id: str
    title: str
    description: str


class NeedFulfillRequest(BaseModel):
    fulfilled_by: str


class JournalCreateRequest(BaseModel):
    athlete_id: str
    content: str
    audio_url: str | None = None


class ProfileUpdateRequest(BaseModel):
    role: Literal["sporcu", "taraftar", "marka"] | None = None
    full_name: str | None = None
    branch: str | None = None
    city: str | None = None
    bio: str | None = None
    ranking: str | None = None
    value_tags: list[str] | None = None
    offered_talent: str | None = None
    brand_budget: int | None = None
    brand_values: str | None = None


class NeedUpdateRequest(BaseModel):
    athlete_id: str | None = None
    title: str | None = None
    description: str | None = None
    is_fulfilled: bool | None = None
    fulfilled_by: str | None = None


class JournalUpdateRequest(BaseModel):
    athlete_id: str | None = None
    content: str | None = None
    audio_url: str | None = None


class EventCreateRequest(BaseModel):
    title: str
    athlete_ids: list[str] | None = None
    branch: str | None = None
    city: str | None = None
    event_date: str | None = None
    is_free: bool | None = None
    latitude: float | None = None
    longitude: float | None = None
    venue: str | None = None


class EventUpdateRequest(BaseModel):
    title: str | None = None
    athlete_ids: list[str] | None = None
    branch: str | None = None
    city: str | None = None
    event_date: str | None = None
    is_free: bool | None = None
    latitude: float | None = None
    longitude: float | None = None
    venue: str | None = None


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


@app.get("/profiles")
def get_profiles(
    role: Literal["sporcu", "taraftar", "marka"] | None = None,
    city: str | None = None,
    branch: str | None = None,
):
    """Profilleri opsiyonel filtrelerle listeler."""
    try:
        profiles = supabase_service.list_profiles(role=role, city=city, branch=branch)
        return {"profiles": profiles}
    except Exception as e:
        print(f"/profiles listeleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/profiles/{profile_id}")
def get_profile(profile_id: str):
    """Tek bir profili id ile getirir."""
    try:
        profile = supabase_service.get_profile(profile_id)
        if profile is None:
            raise HTTPException(status_code=404, detail="Profil bulunamadı")
        return profile
    except HTTPException:
        raise
    except Exception as e:
        print(f"/profiles/{profile_id} getirme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/profiles")
def post_profile(body: ProfileCreateRequest):
    """Yeni profil oluşturur."""
    try:
        data = body.model_dump(exclude_none=True)
        if body.role != "taraftar":
            data.pop("offered_talent", None)
        if body.role != "marka":
            data.pop("brand_budget", None)
            data.pop("brand_values", None)

        if body.role == "taraftar" and body.offered_talent:
            data["talent_embedding"] = gemini_service.generate_embedding(body.offered_talent)

        profile_id = supabase_service.create_profile(data)
        return {"id": profile_id, "status": "created"}
    except Exception as e:
        print(f"/profiles oluşturma hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/needs")
def get_needs(athlete_id: str | None = None):
    """İhtiyaçları opsiyonel sporcu filtresiyle listeler."""
    try:
        needs = supabase_service.list_needs(athlete_id=athlete_id)
        return {"needs": needs}
    except Exception as e:
        print(f"/needs listeleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/needs")
def post_need(body: NeedCreateRequest):
    """Yeni sporcu ihtiyacı oluşturur."""
    try:
        data = body.model_dump()
        metin = body.title + ". " + body.description
        data["need_embedding"] = gemini_service.generate_embedding(metin)

        need_id = supabase_service.create_need(data)
        return {"id": need_id, "status": "created"}
    except Exception as e:
        print(f"/needs oluşturma hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/needs/{need_id}/fulfill")
def patch_need_fulfill(need_id: str, body: NeedFulfillRequest):
    """Bir ihtiyacı karşılandı olarak işaretler."""
    try:
        supabase_service.fulfill_need(need_id, body.fulfilled_by)
        return {"status": "fulfilled"}
    except Exception as e:
        print(f"/needs/{need_id}/fulfill hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/journals/{athlete_id}")
def get_journals(athlete_id: str):
    """Sporcunun günlük kayıtlarını listeler."""
    try:
        journals = supabase_service.list_journals(athlete_id)
        return {"journals": journals}
    except Exception as e:
        print(f"/journals/{athlete_id} listeleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/journals")
def post_journal(body: JournalCreateRequest):
    """Yeni günlük kaydı oluşturur."""
    try:
        data = body.model_dump(exclude_none=True)
        journal_id = supabase_service.create_journal(data)
        return {"id": journal_id, "status": "created"}
    except Exception as e:
        print(f"/journals oluşturma hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/profiles/{profile_id}")
def patch_profile(profile_id: str, body: ProfileUpdateRequest):
    """Profil bilgilerini günceller."""
    try:
        current = supabase_service.get_profile(profile_id)
        if current is None:
            raise HTTPException(status_code=404, detail="Profil bulunamadı")

        data = body.model_dump(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

        role = data.get("role", current.get("role"))
        if role != "taraftar":
            if "role" in data:
                data["offered_talent"] = None
                data["talent_embedding"] = None
            else:
                data.pop("offered_talent", None)
        if role != "marka":
            if "role" in data:
                data["brand_budget"] = None
                data["brand_values"] = None
            else:
                data.pop("brand_budget", None)
                data.pop("brand_values", None)

        if role == "taraftar" and "offered_talent" in data:
            data["talent_embedding"] = (
                gemini_service.generate_embedding(data["offered_talent"])
                if data["offered_talent"]
                else None
            )

        profile = supabase_service.update_profile(profile_id, data)
        if profile is None:
            raise HTTPException(status_code=404, detail="Profil bulunamadı")
        return {"status": "updated", "profile": profile}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/profiles/{profile_id} güncelleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/profiles/{profile_id}")
def delete_profile(profile_id: str):
    """Profil kaydını siler."""
    try:
        deleted = supabase_service.delete_profile(profile_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Profil bulunamadı")
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/profiles/{profile_id} silme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/needs/{need_id}")
def patch_need(need_id: str, body: NeedUpdateRequest):
    """İhtiyaç kaydını günceller."""
    try:
        current = supabase_service.get_need(need_id)
        if current is None:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")

        data = body.model_dump(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

        if "title" in data or "description" in data:
            title = data.get("title", current.get("title", ""))
            description = data.get("description", current.get("description", ""))
            data["need_embedding"] = gemini_service.generate_embedding(title + ". " + description)

        need = supabase_service.update_need(need_id, data)
        if need is None:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")
        return {"status": "updated", "need": need}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/needs/{need_id} güncelleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/needs/{need_id}")
def delete_need(need_id: str):
    """İhtiyaç kaydını siler."""
    try:
        deleted = supabase_service.delete_need(need_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/needs/{need_id} silme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/journals/{journal_id}")
def patch_journal(journal_id: str, body: JournalUpdateRequest):
    """Günlük kaydını günceller."""
    try:
        data = body.model_dump(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

        journal = supabase_service.update_journal(journal_id, data)
        if journal is None:
            raise HTTPException(status_code=404, detail="Günlük bulunamadı")
        return {"status": "updated", "journal": journal}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/journals/{journal_id} güncelleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/journals/{journal_id}")
def delete_journal(journal_id: str):
    """Günlük kaydını siler."""
    try:
        deleted = supabase_service.delete_journal(journal_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Günlük bulunamadı")
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/journals/{journal_id} silme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/events")
def get_events(
    city: str | None = None,
    branch: str | None = None,
    is_free: bool | None = None,
):
    """Etkinlikleri opsiyonel filtrelerle listeler."""
    try:
        events = supabase_service.list_events(city=city, branch=branch, is_free=is_free)
        return {"events": events}
    except Exception as e:
        print(f"/events listeleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/events/{event_id}")
def get_event(event_id: str):
    """Tek bir etkinliği id ile getirir."""
    try:
        event = supabase_service.get_event(event_id)
        if event is None:
            raise HTTPException(status_code=404, detail="Etkinlik bulunamadı")
        return event
    except HTTPException:
        raise
    except Exception as e:
        print(f"/events/{event_id} getirme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/events")
def post_event(body: EventCreateRequest):
    """Yeni etkinlik oluşturur."""
    try:
        data = body.model_dump(exclude_none=True)
        event_id = supabase_service.create_event(data)
        return {"id": event_id, "status": "created"}
    except Exception as e:
        print(f"/events oluşturma hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/events/{event_id}")
def patch_event(event_id: str, body: EventUpdateRequest):
    """Etkinlik kaydını günceller."""
    try:
        data = body.model_dump(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

        event = supabase_service.update_event(event_id, data)
        if event is None:
            raise HTTPException(status_code=404, detail="Etkinlik bulunamadı")
        return {"status": "updated", "event": event}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/events/{event_id} güncelleme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/events/{event_id}")
def delete_event(event_id: str):
    """Etkinlik kaydını siler."""
    try:
        deleted = supabase_service.delete_event(event_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Etkinlik bulunamadı")
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/events/{event_id} silme hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))
