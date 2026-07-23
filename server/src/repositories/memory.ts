import { randomUUID } from "node:crypto";
import { NewUser, User, UserPatch, UserRepository } from "./types";

export class InMemoryUserRepository implements UserRepository {
  readonly backend = "in-memory";
  private users = new Map<string, User>();

  async list(): Promise<User[]> {
    return [...this.users.values()];
  }

  async get(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async create(data: NewUser): Promise<User> {
    const user: User = { id: randomUUID(), ...data };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, patch: UserPatch): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
