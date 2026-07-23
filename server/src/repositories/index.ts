import { FirebaseUserRepository } from "./firebase";
import { InMemoryUserRepository } from "./memory";
import { UserRepository } from "./types";

export function createRepository(): UserRepository {
  if (process.env.FIREBASE_DATABASE_URL) {
    try {
      return new FirebaseUserRepository();
    } catch (err) {
      console.warn(
        "Failed to initialize Firebase, falling back to in-memory store:",
        err instanceof Error ? err.message : err
      );
    }
  }
  return new InMemoryUserRepository();
}
