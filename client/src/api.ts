import { League, ScoreboardGame, User } from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body; keep the generic message
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listUsers: () => request<User[]>("/api/users"),

  createUser: (name: string, zipCode: string) =>
    request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, zipCode }),
    }),

  updateUser: (id: string, name: string, zipCode: string) =>
    request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, zipCode }),
    }),

  deleteUser: (id: string) =>
    request<void>(`/api/users/${id}`, { method: "DELETE" }),

  scoreboard: (league: League) =>
    request<{ league: League; games: ScoreboardGame[] }>(
      `/api/scoreboard?league=${league}`
    ),
};
