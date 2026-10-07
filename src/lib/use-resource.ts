"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "./api";
import { useAuth } from "./auth";

export function useResource<T>(path: string | null, auth = false) {
  const router = useRouter();
  const { logout } = useAuth();
  const [requestPath, setRequestPath] = useState(path);
  const [nonce, setNonce] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(path));

  if (path !== requestPath) {
    setRequestPath(path);
    setData(null);
    setError(null);
    setStatus(null);
    setLoading(Boolean(path));
  }

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    setNonce((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;

    api<T>(path, { auth })
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
        setStatus(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setData(null);
        if (error instanceof ApiError) {
          setStatus(error.status);
          if (auth && error.status === 401) {
            logout();
            const pathName = window.location.pathname;
            if (pathName !== "/login") {
              const next = `${pathName}${window.location.search}`;
              router.push(`/login?next=${encodeURIComponent(next)}`);
            }
            return;
          }
          setError(error.message);
          return;
        }
        setStatus(null);
        setError("Could not load this page.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, auth, nonce, logout, router]);

  return { data, error, status, loading, reload };
}
