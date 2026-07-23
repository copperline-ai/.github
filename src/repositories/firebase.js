const { applicationDefault, cert, initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

class FirebaseUserRepository {
  constructor() {
    this.backend = "firebase";
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

  ref(id) {
    return id ? this.db.ref(`users/${id}`) : this.db.ref("users");
  }

  async list() {
    const snapshot = await this.ref().get();
    const value = snapshot.val();
    return value ? Object.values(value) : [];
  }

  async get(id) {
    const snapshot = await this.ref(id).get();
    return snapshot.val() || null;
  }

  async create(data) {
    const ref = this.ref().push();
    const user = { id: ref.key, ...data };
    await ref.set(user);
    return user;
  }

  async update(id, patch) {
    const existing = await this.get(id);
    if (!existing) return null;
    await this.ref(id).update(patch);
    return { ...existing, ...patch };
  }

  async delete(id) {
    const existing = await this.get(id);
    if (!existing) return false;
    await this.ref(id).remove();
    return true;
  }
}

module.exports = { FirebaseUserRepository };
