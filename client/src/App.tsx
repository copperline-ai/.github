import { useEffect, useState } from "react";
import { api } from "./api";
import { Scoreboard } from "./components/Scoreboard";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import { User } from "./types";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .listUsers()
      .then(setUsers)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "Failed to load users")
      );
  }, []);

  const selectedUser = users.find((u) => u.id === selectedId) ?? null;

  async function handleSubmit(name: string, zipCode: string) {
    setBusy(true);
    try {
      if (editingUser) {
        const updated = await api.updateUser(editingUser.id, name, zipCode);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditingUser(null);
      } else {
        const created = await api.createUser(name, zipCode);
        setUsers((prev) => [...prev, created]);
        setSelectedId(created.id);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    await api.deleteUser(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    if (selectedId === user.id) setSelectedId(null);
    if (editingUser?.id === user.id) setEditingUser(null);
  }

  return (
    <div className="layout">
      <header>
        <h1>User Directory</h1>
        <p className="subtitle">
          CRUD users by name + zip code; location and timezone are fetched from
          OpenWeatherMap. Select a user to see live scores in their timezone.
        </p>
      </header>
      <main>
        <div className="column">
          <UserForm
            editingUser={editingUser}
            busy={busy}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingUser(null)}
          />
          {loadError && <p className="error">{loadError}</p>}
          <UserList
            users={users}
            selectedId={selectedId}
            onSelect={(u) => setSelectedId(u.id)}
            onEdit={setEditingUser}
            onDelete={handleDelete}
          />
        </div>
        <div className="column">
          {selectedUser ? (
            <Scoreboard user={selectedUser} />
          ) : (
            <section className="card placeholder">
              <h2>Today in sports</h2>
              <p className="empty">Select a user to see games in their local time.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
