export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const SESSION_TOKEN_KEY = "meydan.authToken";

export function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(SESSION_TOKEN_KEY, token);
    else window.localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // sessiz
  }
}

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
  need_type?: "money" | "talent" | null;
  category?: string | null;
  target_amount?: number | null;
  collected_amount?: number | null;
  deadline?: string | null;
  talent_needed?: string | null;
  availability?: "local" | "online" | null;
  is_urgent?: boolean | null;
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
  skipAuth?: boolean;
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

export class UnauthorizedError extends Error {
  constructor(message = "Oturum gerekli") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, headers, body, skipAuth, ...rest } = options;
  const token = skipAuth ? null : readAuthToken();
  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    if (response.status === 401) {
      // Token geçersiz/eski — temizle ki kullanıcı tekrar girsin.
      writeAuthToken(null);
      throw new UnauthorizedError(detail);
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

// --- Auth ---

export type AuthResponse = {
  token: string;
  profile: BackendProfile;
};

export function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  role: ProfileRole;
  branch?: string;
  city?: string;
  bio?: string;
}) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export function loginUser(data: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export function logoutUser() {
  return apiRequest<{ status: "ok" }>("/auth/logout", {
    method: "POST",
  });
}

export function fetchCurrentProfile() {
  return apiRequest<{ profile: BackendProfile }>("/auth/me");
}

// --- Profiles ---

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
  need_type?: "money" | "talent";
  category?: string;
  target_amount?: number;
  deadline?: string;
  talent_needed?: string;
  availability?: "local" | "online";
  is_urgent?: boolean;
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
  is_free?: boolean | null;
  range?: "week" | "month" | null;
} = {}) {
  return apiRequest<{ events: BackendEvent[] }>("/events/nearby", {
    query: params,
  });
}

export function getEvent(eventId: string) {
  return apiRequest<BackendEvent>(`/events/${eventId}`);
}

// --- Donations ---

export type BackendDonation = {
  id: string;
  supporter_profile_id: string;
  athlete_profile_id: string;
  need_id?: string | null;
  amount: number;
  message?: string | null;
  is_recurring?: boolean | null;
  status: "pending" | "completed" | "failed";
  external_ref?: string | null;
  created_at?: string | null;
};

export type DonationSummary = {
  total_amount: number;
  supporter_count: number;
  donation_count: number;
};

export function createDonation(data: {
  supporter_profile_id: string;
  athlete_profile_id: string;
  amount: number;
  need_id?: string;
  message?: string;
  is_recurring?: boolean;
}) {
  return apiRequest<{ id: string; status: "created"; donation: BackendDonation }>(
    "/donations",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export function listDonationsBySupporter(supporterProfileId: string) {
  return apiRequest<{ donations: BackendDonation[] }>("/donations", {
    query: { supporter_profile_id: supporterProfileId },
  });
}

export function listDonationsByAthlete(athleteProfileId: string) {
  return apiRequest<{ donations: BackendDonation[] }>(
    `/donations/athlete/${athleteProfileId}`,
  );
}

export function getDonationSummary(athleteProfileId: string) {
  return apiRequest<DonationSummary>(`/donations/summary/${athleteProfileId}`);
}

// --- Follows ---

export function listFollowedAthletes(followerProfileId: string) {
  return apiRequest<{ athletes: BackendProfile[] }>("/follows", {
    query: { follower_profile_id: followerProfileId },
  });
}

export function followAthlete(data: {
  follower_profile_id: string;
  athlete_profile_id: string;
}) {
  return apiRequest<{ id: string; status: "followed" }>("/follows", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function unfollowAthlete(data: {
  follower_profile_id: string;
  athlete_profile_id: string;
}) {
  return apiRequest<{ status: "unfollowed" }>("/follows", {
    method: "DELETE",
    query: data,
  });
}

export function checkFollow(data: {
  follower_profile_id: string;
  athlete_profile_id: string;
}) {
  return apiRequest<{ is_following: boolean }>("/follows/check", {
    query: data,
  });
}

export function getFollowerCount(athleteProfileId: string) {
  return apiRequest<{ followers: number }>(`/follows/count/${athleteProfileId}`);
}
