import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProfiles, type BackendProfile, type ProfileRole } from "@/lib/api";
import { profileToAthlete, slugifyProfile } from "@/lib/api-mappers";
import { useSession } from "@/lib/session";
import type { Athlete } from "@/lib/mock-data";

const STORAGE_KEY_FOR: Record<ProfileRole, string> = {
  sporcu: "meydan.activeAthleteId",
  taraftar: "meydan.activeFanId",
  marka: "meydan.activeBrandId",
};

function readStoredId(role: ProfileRole): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY_FOR[role]);
  } catch {
    return null;
  }
}

function writeStoredId(role: ProfileRole, id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY_FOR[role], id);
    else window.localStorage.removeItem(STORAGE_KEY_FOR[role]);
  } catch {
    // localStorage kapalı/quota dolu olabilir; sessiz geç.
  }
}

export type ActiveAthleteState = {
  profile: BackendProfile | null;
  athlete: Athlete | null;
  athleteOptions: { profile: BackendProfile; athlete: Athlete }[];
  isLoading: boolean;
  isError: boolean;
  hasBackend: boolean;
  setActiveId: (id: string | null) => void;
};

function useActiveProfileForRole(role: ProfileRole) {
  const profilesQuery = useQuery({
    queryKey: ["profiles", role],
    queryFn: () => listProfiles({ role }),
    retry: 1,
  });

  const profiles = profilesQuery.data?.profiles ?? [];

  // Hydration-safe: ilk render'da null; mount sonrası localStorage'tan oku.
  const [activeId, setActiveIdState] = useState<string | null>(null);

  useEffect(() => {
    setActiveIdState(readStoredId(role));
  }, [role]);

  useEffect(() => {
    if (!profiles.length) return;
    const exists = profiles.some((p) => p.id === activeId);
    if (!exists) {
      const firstId = profiles[0].id;
      setActiveIdState(firstId);
      writeStoredId(role, firstId);
    }
  }, [profiles, activeId, role]);

  const setActiveId = (id: string | null) => {
    setActiveIdState(id);
    writeStoredId(role, id);
  };

  return {
    profiles,
    activeId,
    setActiveId,
    isLoading: profilesQuery.isLoading,
    isError: profilesQuery.isError,
  };
}

export function useActiveAthlete(): ActiveAthleteState {
  const session = useSession();
  const fallback = useActiveProfileForRole("sporcu");

  // Login yapıldıysa session profilini kullan; picker tamamen devre dışı.
  if (session.isAuthenticated && session.role === "sporcu" && session.profile) {
    const sessionAthlete = profileToAthlete(session.profile, 0);
    return {
      profile: session.profile,
      athlete: sessionAthlete,
      athleteOptions: [{ profile: session.profile, athlete: sessionAthlete }],
      isLoading: false,
      isError: false,
      hasBackend: true,
      setActiveId: () => undefined,
    };
  }

  const athleteOptions = fallback.profiles.map((profile, index) => ({
    profile,
    athlete: profileToAthlete(profile, index),
  }));

  const active = athleteOptions.find((o) => o.profile.id === fallback.activeId) ?? null;

  return {
    profile: active?.profile ?? null,
    athlete: active?.athlete ?? null,
    athleteOptions,
    isLoading: fallback.isLoading || session.isLoading,
    isError: fallback.isError,
    hasBackend: athleteOptions.length > 0,
    setActiveId: fallback.setActiveId,
  };
}

export type ActiveFanState = {
  profile: BackendProfile | null;
  fanOptions: BackendProfile[];
  isLoading: boolean;
  isError: boolean;
  hasBackend: boolean;
  setActiveId: (id: string | null) => void;
};

export function useActiveFan(): ActiveFanState {
  const session = useSession();
  const fallback = useActiveProfileForRole("taraftar");

  // Login yapıldıysa session profilini kullan.
  if (session.isAuthenticated && session.role === "taraftar" && session.profile) {
    return {
      profile: session.profile,
      fanOptions: [session.profile],
      isLoading: false,
      isError: false,
      hasBackend: true,
      setActiveId: () => undefined,
    };
  }

  const active = fallback.profiles.find((p) => p.id === fallback.activeId) ?? null;

  return {
    profile: active,
    fanOptions: fallback.profiles,
    isLoading: fallback.isLoading || session.isLoading,
    isError: fallback.isError,
    hasBackend: fallback.profiles.length > 0,
    setActiveId: fallback.setActiveId,
  };
}

export function activeAthleteSlug(profile: BackendProfile | null) {
  return profile ? slugifyProfile(profile) : null;
}
