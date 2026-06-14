"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  role: string;
  avatar: string;
  schedule: { start: string; end: string };
  attendance: { date: string; clockIn: string; clockOut: string };
};

const SESSION_KEY = "absence_user_id";

export function getSessionUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(id: string) {
  window.localStorage.setItem(SESSION_KEY, id);
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function useCurrentUser(redirectIfMissing = true) {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getSessionUserId();

    if (!id) {
      if (redirectIfMissing) router.replace("/");
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        clearSession();
        if (redirectIfMissing) router.replace("/");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, setUser, loading };
}
