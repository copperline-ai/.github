import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { Database, getDatabase } from "firebase-admin/database";
import { NewUser, User, UserPatch, UserRepository } from "./types";

export class FirebaseUserRepository implements UserRepository {
  readonly backend = "firebase";
  private db: Database;

  constructor() {
    const databaseURL = process.env.FIREBASE_DATABASE_URL;
    if (!databaseURL) {
      throw new Error("FIREBASE_DATABASE_URL is not set");
    }
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    const app = initializeApp({
      credential: serviceAccount ? cert(JSON.parse(serviceAccount)) : applicationDefault(),
      databaseURL,
    });
    this.db = getDatabase(app);
  }

  private ref(id?: string) {
    return id ? this.db.ref(`users/${id}`) : this.db.ref("users");
  }

  async list(): Promise<User[]> {
    const snapshot = await this.ref().get();
    const value = snapshot.val() as Record<string, User> | null;
    return value ? Object.values(value) : [];
  }

  async get(id: string): Promise<User | null> {
    const snapshot = await this.ref(id).get();
    return (snapshot.val() as User | null) ?? null;
  }

  async create(data: NewUser): Promise<User> {
    const ref = this.ref().push();
    const user: User = { id: ref.key as string, ...data };
    await ref.set(user);
    return user;
  }

  async update(id: string, patch: UserPatch): Promise<User | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    await this.ref(id).update(patch);
    return { ...existing, ...patch };
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.get(id);
    if (!existing) return false;
    await this.ref(id).remove();
    return true;
  }
}
