"""Meydan — FastAPI ana uygulama."""

import re
import secrets
import bcrypt
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

import gemini_service
import ors_service
import supabase_service


_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MIN_PASSWORD_LEN = 6


def _normalize_email(raw: str) -> str:
    """Email'i lowercase + trim eder, formatı doğrular."""
    email = (raw or "").strip().lower()
    if not _EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Geçersiz email biçimi")
    return email


def _validate_password(raw: str) -> str:
    """Şifre minimum uzunluk kontrolü."""
    pw = raw or ""
    if len(pw) < MIN_PASSWORD_LEN:
        raise HTTPException(
            status_code=400,
            detail=f"Şifre en az {MIN_PASSWORD_LEN} karakter olmalı",
        )
    return pw


def _hash_password(plain: str) -> str:
    """bcrypt ile şifreyi hashler."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain: str, hashed: str | None) -> bool:
    """bcrypt ile şifreyi doğrular. hashed yoksa False."""
    if not hashed:
        return False
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def _generate_token() -> str:
    """64 karakter URL-safe rastgele token."""
    return secrets.token_urlsafe(48)


def _extract_talent_semantic_text(offered_talent: str) -> str:
    """Frontend offered_talent'i "Yetenekler: X · Şehir: Y · Müsaitlik: Z · Not: W"
    formatında gönderir. Embedding için sadece anlamsal kısımları (yetenekler + not)
    bırakırız — şehir/müsaitlik DB kolonlarında zaten var, embedding'e girince
    alâkasız profilleri yakınlaştırıyordu (örn. aynı şehirdeki şoför ile video
    editör ihtiyacı %70+ skor alıyordu)."""
    if not offered_talent:
        return ""
    kept: list[str] = []
    for segment in offered_talent.split(" · "):
        key, _, value = segment.partition(":")
        if key.strip() in ("Yetenekler", "Not"):
            cleaned = value.strip()
            if cleaned:
                kept.append(cleaned)
    return ". ".join(kept) if kept else offered_talent


def get_current_profile(authorization: str | None = Header(default=None)) -> dict:
    """Authorization header'ından token okuyup profil döner. Geçersizse 401."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Oturum gerekli")
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Oturum gerekli")
    profile = supabase_service.get_profile_by_token(token)
    if not profile:
        raise HTTPException(status_code=401, detail="Geçersiz oturum")
    return profile


def get_optional_profile(authorization: str | None = Header(default=None)) -> dict | None:
    """Token varsa profili döner, yoksa None. 401 atmaz."""
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None
    return supabase_service.get_profile_by_token(token)

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
    email: str | None = None
    branch: str | None = None
    city: str | None = None
    bio: str | None = None
    ranking: str | None = None
    value_tags: list[str] | None = None
    offered_talent: str | None = None
    brand_budget: int | None = None
    brand_values: str | None = None


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: Literal["sporcu", "taraftar", "marka"]
    branch: str | None = None
    city: str | None = None
    bio: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class NeedCreateRequest(BaseModel):
    athlete_id: str
    title: str
    description: str
    need_type: Literal["money", "talent"] | None = None
    category: str | None = None
    target_amount: int | None = None
    deadline: str | None = None
    talent_needed: str | None = None
    availability: Literal["local", "online"] | None = None
    is_urgent: bool | None = None


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
    need_type: Literal["money", "talent"] | None = None
    category: str | None = None
    target_amount: int | None = None
    collected_amount: int | None = None
    deadline: str | None = None
    talent_needed: str | None = None
    availability: Literal["local", "online"] | None = None
    is_urgent: bool | None = None


class JournalUpdateRequest(BaseModel):
    athlete_id: str | None = None
    content: str | None = None
    audio_url: str | None = None


class FollowRequest(BaseModel):
    follower_profile_id: str
    athlete_profile_id: str


class DonationRequest(BaseModel):
    supporter_profile_id: str
    athlete_profile_id: str
    amount: int
    need_id: str | None = None
    message: str | None = None
    is_recurring: bool | None = False


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

# --- Auth (Demo: email + token, şifresiz) ---

@app.post("/auth/register")
def auth_register(body: RegisterRequest):
    """Yeni profil oluşturur (email + şifre) ve token döner. Email unique."""
    try:
        email = _normalize_email(body.email)
        password = _validate_password(body.password)
        existing = supabase_service.get_profile_by_email(email)
        if existing is not None:
            raise HTTPException(
                status_code=409,
                detail="Bu email zaten kayıtlı. Giriş yapmayı dene.",
            )

        token = _generate_token()
        data: dict = {
            "role": body.role,
            "full_name": body.full_name,
            "email": email,
            "auth_token": token,
            "password_hash": _hash_password(password),
        }
        if body.branch is not None:
            data["branch"] = body.branch
        if body.city is not None:
            data["city"] = body.city
        if body.bio is not None:
            data["bio"] = body.bio

        profile_id = supabase_service.create_profile(data)
        profile = supabase_service.get_profile(profile_id)
        return {
            "token": token,
            "profile": profile,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"/auth/register hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/login")
def auth_login(body: LoginRequest):
    """Email + şifre ile giriş yapar, yeni token üretip döner."""
    try:
        email = _normalize_email(body.email)
        password = (body.password or "").strip()
        if not password:
            raise HTTPException(status_code=400, detail="Şifre gerekli")

        # Şifre hash'ini görmek için raw kaydı istiyoruz — by_email helper
        # _embedding_kolonlarini_cikar'dan geçtiği için password_hash görünmez.
        # Bu yüzden burada doğrudan tabloyu sorgulamak yerine helper'ı
        # değiştireceğiz: get_profile_with_secrets_by_email kullan.
        secret = supabase_service.get_profile_with_secrets_by_email(email)
        if secret is None:
            # Email bulunamasa bile aynı generic mesaj — enumeration sızıntısı yok.
            raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
        if not _verify_password(password, secret.get("password_hash")):
            raise HTTPException(status_code=401, detail="Email veya şifre hatalı")

        token = _generate_token()
        updated = supabase_service.update_profile(secret["id"], {"auth_token": token})
        return {
            "token": token,
            "profile": updated,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"/auth/login hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/logout")
def auth_logout(current: dict = Depends(get_current_profile)):
    """Token'ı invalidate eder."""
    try:
        supabase_service.update_profile(current["id"], {"auth_token": None})
        return {"status": "ok"}
    except Exception as e:
        print(f"/auth/logout hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/auth/me")
def auth_me(current: dict = Depends(get_current_profile)):
    """Oturum sahibi profili döner."""
    return {"profile": current}


@app.post("/auth/demo-login")
def auth_demo_login(role: Literal["sporcu", "taraftar", "marka"]):
    """Demo amaçlı: verilen role göre backend'deki ilk profili bulup
    yeni token üretir. Gerçek bir kullanıcı doğrulaması yapmaz —
    UI'daki rol picker bunu çağırarak demo oturumu açar."""
    try:
        profiles = supabase_service.list_profiles(role=role)
        if not profiles:
            raise HTTPException(
                status_code=404,
                detail=f"{role} rolünde demo profil bulunamadı",
            )
        target = profiles[0]
        token = _generate_token()
        updated = supabase_service.update_profile(target["id"], {"auth_token": token})
        return {"token": token, "profile": updated}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/auth/demo-login hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cheers")
def post_cheer(body: CheerRequest, current: dict = Depends(get_current_profile)):
    """Taraftar tezahüratını toksisite kontrolünden geçirip kaydeder."""
    try:
        if body.fan_id != current["id"]:
            raise HTTPException(status_code=403, detail="Başkasının adına tezahürat gönderilemez")
        is_toxic = gemini_service.check_toxicity(body.message)
        cheer_data = {
            "athlete_id": body.athlete_id,
            "fan_id": body.fan_id,
            "message": body.message,
            "match_date": body.match_date,
        }
        supabase_service.insert_cheer(cheer_data, is_toxic)
        return {"status": "ok", "is_toxic": is_toxic}
    except HTTPException:
        raise
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
    """[Eski API] Sporcu ihtiyacını title+description'tan yeni embedding üretip
    taraftar yetenekleriyle eşleştirir. Daha verimli olan
    /needs/{need_id}/matches kullanılması önerilir."""
    try:
        metin = body.title + ". " + body.description
        embedding = gemini_service.generate_embedding(metin)
        matches = supabase_service.find_matching_talents(embedding, body.athlete_id)
        return {"matches": matches}
    except Exception as e:
        print(f"/needs/match hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/needs/{need_id}/matches")
def get_need_matches(need_id: str, current_user: dict = Depends(get_current_profile)):
    """Bir ihtiyaç için kayıtlı embedding'i kullanarak en uygun taraftar
    yeteneklerini bulur. Sadece ihtiyacın sahibi sporcu çağırabilir.
    Response need detayını da döner — frontend tek istekle her şeyi alır."""
    try:
        need = supabase_service.get_need_with_embedding(need_id)
        if need is None:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")
        if need.get("athlete_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Bu ihtiyaç sana ait değil")

        embedding = need.get("need_embedding")
        if not embedding:
            # Embedding yoksa title+description'tan üret.
            metin = (need.get("title") or "") + ". " + (need.get("description") or "")
            embedding = gemini_service.generate_embedding(metin.strip())

        # Sporcunun şehri + need'in availability'si + talent kategorisi ile eşleştir.
        athlete_city = (current_user or {}).get("city")
        matches = supabase_service.find_matching_talents(
            embedding,
            need["athlete_id"],
            city=athlete_city,
            availability=need.get("availability"),
            required_talent=need.get("talent_needed"),
        )

        # Need'in embedding'sini ayıklayıp frontend'e safe versiyonu döndür.
        need_safe = {k: v for k, v in need.items() if not k.endswith("_embedding")}

        return {
            "need_id": need_id,
            "need": need_safe,
            "matches": matches,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"/needs/{need_id}/matches hatası: {e}")
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
    """DEPRECATED — `/auth/register` kullanın. Bu endpoint kayıt akışını
    bypass ettiği için artık 410 döner."""
    raise HTTPException(
        status_code=410,
        detail="Bu endpoint kullanım dışı. Yeni profil için /auth/register kullanın.",
    )


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
def post_need(body: NeedCreateRequest, current: dict = Depends(get_current_profile)):
    """Yeni sporcu ihtiyacı oluşturur. Sadece sahibi olduğun athlete_id için."""
    try:
        if body.athlete_id != current["id"]:
            raise HTTPException(status_code=403, detail="Başka bir sporcu adına ihtiyaç oluşturulamaz")
        if current.get("role") != "sporcu":
            raise HTTPException(status_code=403, detail="Sadece sporcu rolündeki kullanıcılar ihtiyaç oluşturabilir")
        data = body.model_dump(exclude_none=True)
        metin = body.title + ". " + body.description
        data["need_embedding"] = gemini_service.generate_embedding(metin)

        need_id = supabase_service.create_need(data)
        return {"id": need_id, "status": "created"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/needs oluşturma hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/needs/{need_id}/fulfill")
def patch_need_fulfill(
    need_id: str,
    body: NeedFulfillRequest,
    current: dict = Depends(get_current_profile),
):
    """Bir ihtiyacı karşılandı olarak işaretler. Sadece ihtiyacın sahibi sporcu."""
    try:
        need = supabase_service.get_need(need_id)
        if need is None:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")
        if need.get("athlete_id") != current["id"]:
            raise HTTPException(status_code=403, detail="Başkasının ihtiyacı kapatılamaz")
        supabase_service.fulfill_need(need_id, body.fulfilled_by)
        return {"status": "fulfilled"}
    except HTTPException:
        raise
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
def post_journal(body: JournalCreateRequest, current: dict = Depends(get_current_profile)):
    """Yeni günlük kaydı oluşturur. Sadece kendi günlüğüne yazabilirsin."""
    try:
        if body.athlete_id != current["id"]:
            raise HTTPException(status_code=403, detail="Başkasının günlüğüne yazılamaz")
        if current.get("role") != "sporcu":
            raise HTTPException(status_code=403, detail="Sadece sporcu rolündeki kullanıcılar günlük yazabilir")
        data = body.model_dump(exclude_none=True)
        journal_id = supabase_service.create_journal(data)
        return {"id": journal_id, "status": "created"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/journals oluşturma hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/profiles/{profile_id}")
def patch_profile(
    profile_id: str,
    body: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_profile),
):
    """Profil bilgilerini günceller. Sadece kendi profilini düzenleyebilirsin."""
    try:
        if profile_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının profili düzenlenemez")
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
                gemini_service.generate_embedding(
                    _extract_talent_semantic_text(data["offered_talent"])
                )
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
def delete_profile(profile_id: str, current_user: dict = Depends(get_current_profile)):
    """Profil kaydını siler. Sadece kendi profilini silebilirsin."""
    try:
        if profile_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının profili silinemez")
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
def patch_need(
    need_id: str,
    body: NeedUpdateRequest,
    current_user: dict = Depends(get_current_profile),
):
    """İhtiyaç kaydını günceller. Sadece sahibi sporcu düzenleyebilir."""
    try:
        existing = supabase_service.get_need(need_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")
        if existing.get("athlete_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının ihtiyacı düzenlenemez")

        data = body.model_dump(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

        if "title" in data or "description" in data:
            title = data.get("title", existing.get("title", ""))
            description = data.get("description", existing.get("description", ""))
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
def delete_need(need_id: str, current_user: dict = Depends(get_current_profile)):
    """İhtiyaç kaydını siler. Sadece sahibi sporcu silebilir."""
    try:
        existing = supabase_service.get_need(need_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="İhtiyaç bulunamadı")
        if existing.get("athlete_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının ihtiyacı silinemez")
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
def patch_journal(
    journal_id: str,
    body: JournalUpdateRequest,
    current_user: dict = Depends(get_current_profile),
):
    """Günlük kaydını günceller. Sadece sahibi sporcu."""
    try:
        existing = supabase_service.get_journal(journal_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Günlük bulunamadı")
        if existing.get("athlete_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının günlüğü düzenlenemez")

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
def delete_journal(journal_id: str, current_user: dict = Depends(get_current_profile)):
    """Günlük kaydını siler. Sadece sahibi sporcu."""
    try:
        existing = supabase_service.get_journal(journal_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Günlük bulunamadı")
        if existing.get("athlete_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının günlüğü silinemez")
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


@app.get("/events/nearby")
def get_nearby_events(
    city: str | None = None,
    branch: str | None = None,
    is_free: bool | None = None,
    range: Literal["week", "month"] | None = None,
):
    """Yaklaşan spor etkinliklerini şehir, branş, ücret ve zaman aralığı filtresiyle listeler."""
    try:
        events = supabase_service.list_nearby_events(
            city=city, branch=branch, is_free=is_free, range_window=range
        )
        return {"events": events}
    except Exception as e:
        print(f"/events/nearby listeleme hatası: {e}")
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


@app.get("/geo/isochrone")
def get_geo_isochrone(
    city: str,
    mode: Literal["foot-walking", "cycling-regular", "driving-car"],
    minutes: Literal[15, 30, 45],
):
    """Şehir merkezinden verilen mod+süre ile ulaşılabilir bölge polygonu.

    ORS API key backend'de saklı; cevap 24h boyunca cache'lenir.
    """
    try:
        return ors_service.get_isochrone(city=city, mode=mode, minutes=minutes)
    except ors_service.UnknownCityError:
        raise HTTPException(
            status_code=400,
            detail=f"'{city}' için harita henüz hazır değil",
        )
    except ors_service.ORSConfigError as e:
        print(f"/geo/isochrone config hatası: {e}")
        raise HTTPException(status_code=503, detail="Harita servisi yapılandırılmamış")
    except ors_service.ORSUpstreamError as e:
        print(f"/geo/isochrone upstream hatası: {e}")
        raise HTTPException(status_code=502, detail="Harita servisi geçici olarak erişilemiyor")


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


# --- Donations ---

@app.post("/donations")
def post_donation(body: DonationRequest, current_user: dict = Depends(get_current_profile)):
    """Bağış kaydı oluşturur. Şimdilik ödeme gateway yok; status='completed'."""
    try:
        if body.supporter_profile_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkası adına bağış yapılamaz")
        if body.amount <= 0:
            raise HTTPException(status_code=400, detail="Bağış miktarı pozitif olmalı")
        data = body.model_dump(exclude_none=True)
        data["status"] = "completed"
        donation = supabase_service.create_donation(data)
        return {"id": donation["id"], "status": "created", "donation": donation}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/donations POST hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/donations")
def get_donations_by_supporter(supporter_profile_id: str):
    """Bir taraftarın yaptığı bağışları listeler."""
    try:
        donations = supabase_service.list_donations_by_supporter(supporter_profile_id)
        return {"donations": donations}
    except Exception as e:
        print(f"/donations GET hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/donations/athlete/{athlete_profile_id}")
def get_donations_by_athlete(athlete_profile_id: str):
    """Bir sporcunun aldığı bağışları listeler."""
    try:
        donations = supabase_service.list_donations_by_athlete(athlete_profile_id)
        return {"donations": donations}
    except Exception as e:
        print(f"/donations/athlete/{athlete_profile_id} hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/donations/summary/{athlete_profile_id}")
def get_donation_summary(athlete_profile_id: str):
    """Bir sporcunun toplam destek özetini döner."""
    try:
        summary = supabase_service.athlete_donation_summary(athlete_profile_id)
        return summary
    except Exception as e:
        print(f"/donations/summary/{athlete_profile_id} hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- Follows ---

@app.post("/follows")
def post_follow(body: FollowRequest, current_user: dict = Depends(get_current_profile)):
    """Bir taraftar bir sporcuyu takip eder. Sadece kendi adına."""
    try:
        if body.follower_profile_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkası adına takip yapılamaz")
        follow_id = supabase_service.follow_athlete(
            body.follower_profile_id, body.athlete_profile_id
        )
        return {"id": follow_id, "status": "followed"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/follows POST hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/follows")
def delete_follow(
    follower_profile_id: str,
    athlete_profile_id: str,
    current_user: dict = Depends(get_current_profile),
):
    """Takip ilişkisini siler. Sadece kendi takiplerini kaldırabilirsin."""
    try:
        if follower_profile_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Başkasının takibi kaldırılamaz")
        deleted = supabase_service.unfollow_athlete(follower_profile_id, athlete_profile_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Takip kaydı bulunamadı")
        return {"status": "unfollowed"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"/follows DELETE hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/follows")
def get_follows(follower_profile_id: str):
    """Verilen taraftarın takip ettiği sporcu profillerini listeler."""
    try:
        athletes = supabase_service.list_followed_athletes(follower_profile_id)
        return {"athletes": athletes}
    except Exception as e:
        print(f"/follows GET hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/follows/check")
def check_follow(follower_profile_id: str, athlete_profile_id: str):
    """İki profil arasında takip ilişkisi var mı kontrol eder."""
    try:
        following = supabase_service.is_following(follower_profile_id, athlete_profile_id)
        return {"is_following": following}
    except Exception as e:
        print(f"/follows/check hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/follows/count/{athlete_profile_id}")
def count_follows(athlete_profile_id: str):
    """Bir sporcunun takipçi sayısını döner."""
    try:
        count = supabase_service.count_athlete_followers(athlete_profile_id)
        return {"followers": count}
    except Exception as e:
        print(f"/follows/count/{athlete_profile_id} hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))
