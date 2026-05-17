import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  demoLogin,
  fetchCurrentProfile,
  loginUser,
  logoutUser,
  readAuthToken,
  registerUser,
  writeAuthToken,
  UnauthorizedError,
  type AuthResponse,
  type BackendProfile,
  type ProfileRole,
} from "@/lib/api";

const SESSION_QUERY_KEY = ["session", "me"] as const;

export type SessionState = {
  profile: BackendProfile | null;
  role: ProfileRole | null;
  /** Hydration tamamlandı + (varsa) session fetch'i tamamlandı mı? */
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  /** Client-side mount oldu mu? false ise SSR'da veya ilk hydrate öncesindeyiz. */
  hydrated: boolean;
};

/**
 * Hydration-safe session hook.
 *
 * Server'da localStorage yok, bu yüzden token bilgisini SSR'da kullanırsak
 * hydration mismatch oluşur. Çözüm: mount olana kadar token'ı null kabul
 * et; mount sonrası gerçek değeri oku ve session fetch'ini tetikle.
 */
export function useSession(): SessionState {
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(readAuthToken());
    setHydrated(true);
  }, []);

  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => fetchCurrentProfile().then((r) => r.profile),
    // Hydration tamamlanmadan istek atma — SSR'da fetch çalışmaz, sadece
    // ilk client render'da çalışsın.
    enabled: hydrated && Boolean(token),
    retry: false,
  });

  const profile = hydrated && token ? query.data ?? null : null;

  return {
    profile,
    role: (profile?.role as ProfileRole | undefined) ?? null,
    // Hydration olana kadar yükleniyor say; sonra query loading'i izle.
    isLoading: !hydrated || (Boolean(token) && query.isLoading),
    isAuthenticated: Boolean(profile),
    isError: query.isError && !(query.error instanceof UnauthorizedError),
    hydrated,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return async (email: string, password: string): Promise<AuthResponse> => {
    const result = await loginUser({ email, password });
    writeAuthToken(result.token);
    queryClient.setQueryData(SESSION_QUERY_KEY, result.profile);
    return result;
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  return async (data: {
    email: string;
    password: string;
    full_name: string;
    role: ProfileRole;
    branch?: string;
    city?: string;
    bio?: string;
  }): Promise<AuthResponse> => {
    const result = await registerUser(data);
    writeAuthToken(result.token);
    queryClient.setQueryData(SESSION_QUERY_KEY, result.profile);
    return result;
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  return async () => {
    try {
      await logoutUser();
    } catch {
      // Network hatasında bile lokal temizliği yap.
    }
    writeAuthToken(null);
    queryClient.setQueryData(SESSION_QUERY_KEY, null);
    queryClient.removeQueries();
  };
}

export function useDemoLogin() {
  const queryClient = useQueryClient();
  return async (role: ProfileRole): Promise<AuthResponse> => {
    const result = await demoLogin(role);
    writeAuthToken(result.token);
    queryClient.setQueryData(SESSION_QUERY_KEY, result.profile);
    return result;
  };
}

/** Rol için ön panele uygun varsayılan rota. */
export function defaultRouteForRole(role: ProfileRole | null): string {
  switch (role) {
    case "sporcu":
      return "/sporcu-panel";
    case "marka":
      return "/marka-panel";
    case "taraftar":
    default:
      return "/dashboard";
  }
}
