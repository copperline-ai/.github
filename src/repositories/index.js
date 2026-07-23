const { FirebaseUserRepository } = require("./firebase");
const { InMemoryUserRepository } = require("./memory");

// Uses Firebase Realtime Database when configured, otherwise an in-memory
// store so the app runs with zero setup.
function createRepository() {
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

module.exports = { createRepository };
