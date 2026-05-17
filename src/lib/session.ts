import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
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
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
};

export function useSession(): SessionState {
  const token = typeof window === "undefined" ? null : readAuthToken();

  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => fetchCurrentProfile().then((r) => r.profile),
    enabled: Boolean(token),
    retry: false,
  });

  const profile = token ? query.data ?? null : null;
  return {
    profile,
    role: (profile?.role as ProfileRole | undefined) ?? null,
    isLoading: Boolean(token) && query.isLoading,
    isAuthenticated: Boolean(profile),
    isError: query.isError && !(query.error instanceof UnauthorizedError),
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return async (email: string): Promise<AuthResponse> => {
    const result = await loginUser({ email });
    writeAuthToken(result.token);
    queryClient.setQueryData(SESSION_QUERY_KEY, result.profile);
    return result;
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  return async (data: {
    email: string;
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
