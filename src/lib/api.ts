export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type ProfileRole = "sporcu" | "taraftar" | "marka";

export type BackendProfile = {
  id: string;
  role: ProfileRole;
  full_name: string;
  branch?: string | null;
  city?: string | null;
  bio?: string | null;
  ranking?: string | null;
  value_tags?: string[] | null;
  offered_talent?: string | null;
  brand_budget?: number | null;
  brand_values?: string | null;
  avatar_url?: string | null;
  social_links?: Record<string, string> | null;
  created_at?: string | null;
};

export type BackendNeed = {
  id: string;
  athlete_id: string;
  title: string;
  description?: string | null;
  is_fulfilled?: boolean | null;
  fulfilled_by?: string | null;
  created_at?: string | null;
};

export type BackendJournal = {
  id: string;
  athlete_id: string;
  content: string;
  audio_url?: string | null;
  created_at?: string | null;
};

export type BackendEvent = {
  id: string;
  title: string;
  athlete_ids?: string[] | null;
  branch?: string | null;
  city?: string | null;
  event_date?: string | null;
  is_free?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  venue?: string | null;
  created_at?: string | null;
};

type RequestOptions = RequestInit & {
  query?: Record<string, string | number | boolean | null | undefined>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(path, API_BASE_URL);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, headers, body, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body,
  });

  if (!response.ok) {
    let detail = `API isteği başarısız: ${response.status}`;
    try {
      const error = await response.json();
      detail = typeof error.detail === "string" ? error.detail : detail;
    } catch {
      // JSON olmayan hata cevaplarında status mesajı yeterli.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export function listProfiles(params: {
  role?: ProfileRole;
  city?: string | null;
  branch?: string | null;
} = {}) {
  return apiRequest<{ profiles: BackendProfile[] }>("/profiles", { query: params });
}

export function getProfile(profileId: string) {
  return apiRequest<BackendProfile>(`/profiles/${profileId}`);
}

export function listNeeds(athleteId?: string | null) {
  return apiRequest<{ needs: BackendNeed[] }>("/needs", {
    query: { athlete_id: athleteId },
  });
}

export function createNeed(data: {
  athlete_id: string;
  title: string;
  description: string;
}) {
  return apiRequest<{ id: string; status: "created" }>("/needs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createCheer(data: {
  athlete_id: string;
  fan_id: string;
  message: string;
  match_date: string;
}) {
  return apiRequest<{ status: "ok"; is_toxic: boolean }>("/cheers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listJournals(athleteId: string) {
  return apiRequest<{ journals: BackendJournal[] }>(`/journals/${athleteId}`);
}

export function listNearbyEvents(params: {
  city?: string | null;
  branch?: string | null;
} = {}) {
  return apiRequest<{ events: BackendEvent[] }>("/events/nearby", {
    query: params,
  });
}

export function getEvent(eventId: string) {
  return apiRequest<BackendEvent>(`/events/${eventId}`);
}
