"""Gemini AI entegrasyon servisi."""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def check_toxicity(message: str) -> bool:
    """
    Mesaj toksik mi? True/False döner.
    Sadece küfür, hakaret, taciz, aşağılama toksiktir.
    Yapıcı eleştiri, motivasyon, duygusal destek toksik DEĞİLDİR.
    """
    model = genai.GenerativeModel('gemini-2.5-flash')
    
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
    
    try:
        response = model.generate_content(prompt)
        result = response.text.strip().upper().replace("İ", "I")
        return "TOKSIK" in result
    except Exception as e:
        print(f"Toksisite kontrolü hatası: {e}")
        return False  # Hata olursa güvenli tarafta kal, mesaj geçsin


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


def summarize_cheers(messages: list[str]) -> str:
    """Taraftar mesajlarını özet haline getirir."""
    model = genai.GenerativeModel("gemini-2.5-flash")
    n = len(messages)
    mesaj_listesi = "\n".join(f"- {m}" for m in messages)

    prompt = f"""Bir sporcuya {n} taraftar mesaj gönderdi. Mesajların genel temasını 2-3 cümlede özetle.
'Bugün X kişi seninleydi, çoğunluğu Y vurguladı, bir kısmı Z dedi' formatında yaz.
Pozitif ve empatik bir ton kullan.

Mesajlar:
{mesaj_listesi}"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Özet oluşturma hatası: {e}")
        raise
