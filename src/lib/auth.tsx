"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ApiError, TOKEN_KEY, api } from "./api";
import type { AuthSession, UserProfile } from "./types";

const tokenListeners = new Set<() => void>();

function subscribeToken(listener: () => void) {
  tokenListeners.add(listener);
  return () => tokenListeners.delete(listener);
}

function notifyToken() {
  tokenListeners.forEach((listener) => listener());
}

function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  notifyToken();
}

function getServerToken() {
  return null;
}

type AuthContextValue = {
  user: UserProfile | null;
  ready: boolean;
  profileError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionUser(session: AuthSession): UserProfile {
  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    phone: "",
    role: session.role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribeToken, readToken, getServerToken);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const ready = !token || user !== null || checked;

  const refresh = useCallback(async () => {
    const current = readToken();
    if (!current) {
      setUser(null);
      setProfileError(null);
      setChecked(true);
      return;
    }

    try {
      const profile = await api<UserProfile>("/api/auth/me");
      setUser(profile);
      setProfileError(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setStoredToken(null);
        setUser(null);
        setProfileError(null);
        const path = window.location.pathname;
        if (path !== "/login" && path !== "/register") {
          const next = `${path}${window.location.search}`;
          router.push(`/login?next=${encodeURIComponent(next)}`);
        }
        return;
      }
      setProfileError(error instanceof Error ? error.message : "Could not confirm your account.");
    } finally {
      setChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!token || user) return;
    let cancelled = false;
    api<UserProfile>("/api/auth/me")
      .then((profile) => {
        if (!cancelled) {
          setUser(profile);
          setProfileError(null);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          setStoredToken(null);
          setUser(null);
          setProfileError(null);
          const path = window.location.pathname;
          if (path !== "/login" && path !== "/register") {
            const next = `${path}${window.location.search}`;
            router.push(`/login?next=${encodeURIComponent(next)}`);
          }
          return;
        }
        setProfileError(error instanceof Error ? error.message : "Could not confirm your account.");
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token, user, router]);

  const establish = useCallback(async (session: AuthSession) => {
    setStoredToken(session.token);
    setUser(sessionUser(session));
    setProfileError(null);
    setChecked(true);
    const profile = await api<UserProfile>("/api/auth/me");
    setUser(profile);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await api<AuthSession>("/api/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password }),
      });
      await establish(session);
    },
    [establish],
  );

  const register = useCallback(
    async (input: { name: string; email: string; phone: string; password: string }) => {
      const session = await api<AuthSession>("/api/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify(input),
      });
      await establish(session);
    },
    [establish],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    setProfileError(null);
    setChecked(true);
  }, []);

  const value = useMemo(
    () => ({ user, ready, profileError, login, register, logout, refresh }),
    [user, ready, profileError, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
