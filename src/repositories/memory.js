const { randomUUID } = require("node:crypto");

class InMemoryUserRepository {
  constructor() {
    this.backend = "in-memory";
    this.users = new Map();
  }

  async list() {
    return [...this.users.values()];
  }

  async get(id) {
    return this.users.get(id) || null;
  }

  async create(data) {
    const user = { id: randomUUID(), ...data };
    this.users.set(user.id, user);
    return user;
  }

  async update(id, patch) {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id) {
    return this.users.delete(id);
  }
}

module.exports = { InMemoryUserRepository };
