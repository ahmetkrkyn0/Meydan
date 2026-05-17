"""OpenRouteService (ORS) entegrasyonu — isochrone API proxy + cache.

Frontend ORS'a doğrudan istek atmaz; API key burada tutulur, polygon GeoJSON
istemciye proxy'lenir. Aynı (şehir, mode, dakika) için günlük TTL'li in-memory
cache ile kota tasarrufu sağlanır.
"""

import os
import time
from typing import Literal

import httpx

IsochroneMode = Literal["foot-walking", "cycling-regular", "driving-car"]
AllowedMinutes = Literal[15, 30, 45]

# Türkiye'nin 7 büyük şehri — ilk sürüm. Geri kalan 74 il sonraki PR.
# (lat, lng) — Wikipedia il merkez koordinatları.
CITY_CENTERS: dict[str, tuple[float, float]] = {
    "İstanbul": (41.0082, 28.9784),
    "Ankara": (39.9334, 32.8597),
    "İzmir": (38.4192, 27.1287),
    "Bursa": (40.1828, 29.0665),
    "Antalya": (36.8969, 30.7133),
    "Eskişehir": (39.7767, 30.5206),
    "Adana": (37.0000, 35.3213),
    # Etkinlik test verisinde geçen ek noktalar:
    "Bodrum": (37.0344, 27.4305),
}

_ORS_BASE = "https://api.openrouteservice.org/v2/isochrones"
_CACHE_TTL_SECONDS = 24 * 60 * 60  # 24 saat

# key: "city|mode|minutes" → (expires_at_epoch, payload_dict)
_cache: dict[str, tuple[float, dict]] = {}


class ORSConfigError(RuntimeError):
    """ORS_API_KEY env değişkeni yok."""


class ORSUpstreamError(RuntimeError):
    """ORS API'sinden 2xx dışı yanıt geldi."""


class UnknownCityError(KeyError):
    """CITY_CENTERS sözlüğünde olmayan bir şehir istendi."""


def _api_key() -> str:
    key = os.getenv("ORS_API_KEY")
    if not key:
        raise ORSConfigError("ORS_API_KEY env değişkeni ayarlanmamış")
    return key


def get_isochrone(city: str, mode: IsochroneMode, minutes: int) -> dict:
    """Bir şehir merkezi etrafında verilen mod ve süre için isochrone polygonu döner.

    Dönen sözlük:
        {
            "center": [lat, lng],
            "polygon": GeoJSON Feature (Polygon),
            "cached": bool,
        }

    ORS endpoint: POST /v2/isochrones/{profile}
    Body: { "locations": [[lng, lat]], "range": [seconds], "range_type": "time" }
    """
    if city not in CITY_CENTERS:
        raise UnknownCityError(city)

    cache_key = f"{city}|{mode}|{minutes}"
    now = time.time()
    cached = _cache.get(cache_key)
    if cached is not None:
        expires_at, payload = cached
        if expires_at > now:
            return {**payload, "cached": True}

    lat, lng = CITY_CENTERS[city]
    api_key = _api_key()
    body = {
        # ORS lng,lat sırasını ister — GeoJSON convention.
        "locations": [[lng, lat]],
        "range": [minutes * 60],
        "range_type": "time",
    }
    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json",
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                f"{_ORS_BASE}/{mode}",
                json=body,
                headers=headers,
            )
    except httpx.HTTPError as e:
        raise ORSUpstreamError(f"ORS bağlantı hatası: {e}") from e

    if response.status_code != 200:
        raise ORSUpstreamError(
            f"ORS {response.status_code}: {response.text[:200]}"
        )

    data = response.json()
    features = data.get("features") or []
    if not features:
        raise ORSUpstreamError("ORS boş features döndü")

    polygon = features[0]
    payload = {
        "center": [lat, lng],
        "polygon": polygon,
    }
    _cache[cache_key] = (now + _CACHE_TTL_SECONDS, payload)
    return {**payload, "cached": False}
