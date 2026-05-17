"""Gemini AI entegrasyon servisi."""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


_toxicity_cache: dict[str, bool] = {}

# Küfür/hakaret heuristic'i — Gemini çağrılamadığında kullanılır
_TOXIC_KEYWORDS = {
    "sik", "amk", "amına", "amina", "orospu", "piç", "pic", "yarrak",
    "göt", "got", "ibne", "puşt", "pust", "pezevenk", "salak", "aptal",
    "gerizekalı", "gerizekali", "şerefsiz", "serefsiz", "haysiyetsiz",
    "ananı", "anani", "fuck", "shit", "bitch", "asshole",
}


def _fallback_toxicity(message: str) -> bool:
    lowered = message.lower()
    return any(kw in lowered for kw in _TOXIC_KEYWORDS)


def check_toxicity(message: str) -> bool:
    """
    Mesaj toksik mi? True/False döner.
    Sadece küfür, hakaret, taciz, aşağılama toksiktir.
    Yapıcı eleştiri, motivasyon, duygusal destek toksik DEĞİLDİR.
    """
    if message in _toxicity_cache:
        return _toxicity_cache[message]

    prompt = f"""Aşağıdaki Türkçe mesaj bir sporcuya taraftarı tarafından gönderildi.
Görevin: Mesajın TOKSİK olup olmadığına karar vermek.

TOKSİK SAYILANLAR (sadece bunlar):
- Küfür ve argo (s*k, a*ına, p**evenk, vb.)
- Doğrudan hakaret (salak, aptal, pislik, gerizekalı, vb.)
- Aşağılama ve değersizleştirme ("hiçbir işe yaramazsın")
- Tehdit veya taciz
- Cinsiyetçi, ırkçı, ayrımcı dil

TOKSİK SAYILMAYANLAR:
- "Vazgeçme", "pes etme", "devam et" gibi motivasyon mesajları → TEMİZ
- "Seninleyim", "arkandayım", "güveniyorum" → TEMİZ
- Yapıcı eleştiri: "Bugün daha sakin oynayabilirsin" → TEMİZ
- "Bugün kötü oynadın" gibi sade gözlemler → TEMİZ
- Strateji önerileri, tavsiyeler → TEMİZ
- Duygusal destek mesajları → TEMİZ

ÖNEMLİ: Şüpheye düşersen TEMİZ de. Sadece açıkça küfür/hakaret içerenler TOKSİK'tir.

Mesaj: "{message}"

Sadece tek kelime cevap ver: TOKSIK veya TEMIZ
"""

    for model_name in ("gemini-2.5-flash-lite", "gemini-2.5-flash"):
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            result = response.text.strip().upper().replace("İ", "I")
            is_toxic = "TOKSIK" in result
            _toxicity_cache[message] = is_toxic
            return is_toxic
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower() or "rate" in err_str.lower():
                print(f"Toksisite ({model_name}) quota doldu, sıradakine geçiliyor")
                continue
            print(f"Toksisite ({model_name}) hatası: {err_str[:200]}")
            continue

    # Hepsi başarısızsa keyword-based fallback (quota yokken bile küfürü yakala)
    fallback = _fallback_toxicity(message)
    _toxicity_cache[message] = fallback
    return fallback


def generate_embedding(text: str) -> list[float]:
    """Metni 768 boyutlu embedding vektörüne dönüştürür."""
    try:
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document",
            output_dimensionality=768,
        )
        return result["embedding"]
    except Exception as e:
        print(f"Embedding oluşturma hatası: {e}")
        raise


_summary_cache: dict[str, str] = {}


def _fallback_summary(messages: list[str]) -> str:
    """Gemini quota dolduğunda kullanılan deterministik özet."""
    n = len(messages)
    if n == 0:
        return ""
    # En sık geçen 3 kelimeyi çıkar (3+ harf, stopword'leri at)
    stop = {
        "bir", "bu", "şu", "için", "ile", "ama", "veya", "ki", "de", "da",
        "çok", "daha", "gibi", "olarak", "olur", "her", "var", "yok", "ben",
        "sen", "biz", "siz", "onu", "ona", "ne", "ya", "ya da", "the", "and",
    }
    from collections import Counter
    words = []
    for m in messages:
        for w in m.lower().split():
            w = "".join(c for c in w if c.isalpha())
            if len(w) >= 4 and w not in stop:
                words.append(w)
    top = [w for w, _ in Counter(words).most_common(3)]
    tema = ", ".join(top) if top else "destek ve motivasyon"
    return (
        f"Bugün {n} taraftar seninleydi. "
        f"Mesajlarda öne çıkan tema: {tema}. "
        f"Tribün arkanda — sahada yalnız değilsin."
    )


def summarize_cheers(messages: list[str]) -> str:
    """Taraftar mesajlarını özet haline getirir. Quota dolarsa deterministik fallback üretir."""
    n = len(messages)
    if n == 0:
        return ""

    # Aynı mesaj setine ikinci kez Gemini çağrısı atmamak için cache
    cache_key = f"{n}:" + "|".join(sorted(messages))
    if cache_key in _summary_cache:
        return _summary_cache[cache_key]

    mesaj_listesi = "\n".join(f"- {m}" for m in messages)
    prompt = f"""Bir sporcuya {n} taraftar mesaj gönderdi. Mesajların genel temasını 2-3 cümlede özetle.
'Bugün X kişi seninleydi, çoğunluğu Y vurguladı, bir kısmı Z dedi' formatında yaz.
Pozitif ve empatik bir ton kullan.

Mesajlar:
{mesaj_listesi}"""

    # Önce hafif modeli dene (free tier'da daha yüksek RPM), sonra flash, sonra fallback
    for model_name in ("gemini-2.5-flash-lite", "gemini-2.5-flash"):
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            text = response.text.strip()
            _summary_cache[cache_key] = text
            return text
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower() or "rate" in err_str.lower():
                print(f"Özet ({model_name}) quota doldu, sıradakine geçiliyor: {err_str[:120]}")
                continue
            print(f"Özet ({model_name}) hatası: {err_str[:200]}")
            continue

    # Hepsi başarısızsa deterministik fallback
    fallback = _fallback_summary(messages)
    _summary_cache[cache_key] = fallback
    return fallback
