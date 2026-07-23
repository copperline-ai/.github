import { User } from "../types";

interface Props {
  users: User[];
  selectedId: string | null;
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function formatOffset(seconds: number): string {
  const sign = seconds < 0 ? "-" : "+";
  const abs = Math.abs(seconds);
  const hours = Math.floor(abs / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
}

export function UserList({ users, selectedId, onSelect, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p className="empty">No users yet — add one above.</p>;
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li
          key={user.id}
          className={`card user-card${user.id === selectedId ? " selected" : ""}`}
          onClick={() => onSelect(user)}
        >
          <div className="user-card-header">
            <strong>{user.name}</strong>
            <span className="pill">{formatOffset(user.timezone)}</span>
          </div>
          <div className="user-card-meta">
            <span>
              {user.city ? `${user.city}, ` : ""}
              {user.zipCode}
            </span>
            <span>
              {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
            </span>
          </div>
          <div className="user-card-actions">
            <button
              className="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
              }}
            >
              Edit
            </button>
            <button
              className="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
