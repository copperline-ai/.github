import { FormEvent, useEffect, useState } from "react";
import { User } from "../types";

interface Props {
  editingUser: User | null;
  busy: boolean;
  onSubmit: (name: string, zipCode: string) => Promise<void>;
  onCancelEdit: () => void;
}

export function UserForm({ editingUser, busy, onSubmit, onCancelEdit }: Props) {
  const [name, setName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(editingUser?.name ?? "");
    setZipCode(editingUser?.zipCode ?? "");
    setError(null);
  }, [editingUser]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(name, zipCode);
      if (!editingUser) {
        setName("");
        setZipCode("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className="user-form card" onSubmit={handleSubmit}>
      <h2>{editingUser ? `Edit ${editingUser.name}` : "Add a user"}</h2>
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
          required
        />
      </label>
      <label>
        Zip code
        <input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="10001"
          required
          pattern="\d{5}(-\d{4})?"
          title="US zip code, e.g. 10001"
        />
      </label>
      <p className="hint">
        Latitude, longitude, and timezone are looked up automatically from the zip code.
      </p>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="submit" disabled={busy}>
          {busy ? "Saving…" : editingUser ? "Save changes" : "Create user"}
        </button>
        {editingUser && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
