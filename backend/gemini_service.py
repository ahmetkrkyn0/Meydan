"""Gemini AI entegrasyon servisi."""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def check_toxicity(message: str) -> bool:
    """Mesajın toksik olup olmadığını kontrol eder. True = toksik."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""Aşağıdaki mesajın bir sporcuya yönelik küfür, hakaret veya taciz içerip içermediğini değerlendir.

Önemli: Yapıcı eleştiri, hayal kırıklığı ifadesi veya nazik uyarılar TOKSİK DEĞİLDİR.
Sadece yıkıcı, aşağılayıcı veya küfür içeren dil TOKSİKTİR.

Mesaj: "{message}"

Sadece tek kelime yanıt ver: TOKSIK veya TEMIZ"""

    try:
        response = model.generate_content(prompt)
        sonuc = response.text.strip().upper()
        return "TOKSIK" in sonuc
    except Exception as e:
        print(f"Toksisite kontrolü hatası: {e}")
        # Hata durumunda güvenli tarafta kal
        return True


def generate_embedding(text: str) -> list[float]:
    """Metni 768 boyutlu embedding vektörüne dönüştürür."""
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception as e:
        print(f"Embedding oluşturma hatası: {e}")
        raise


def summarize_cheers(messages: list[str]) -> str:
    """Taraftar mesajlarını özet haline getirir."""
    model = genai.GenerativeModel("gemini-1.5-flash")
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
