import { useEffect, useState } from "react";
import { api } from "../api";
import { League, ScoreboardGame, User } from "../types";

const LEAGUES: League[] = ["nfl", "nba", "mlb", "nhl"];

interface Props {
  user: User;
}

/** Formats a UTC instant in the user's stored timezone (UTC offset in seconds). */
function formatInUserTimezone(iso: string, offsetSeconds: number): string {
  const shifted = new Date(new Date(iso).getTime() + offsetSeconds * 1000);
  return shifted.toLocaleString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isLocalTeam(game: ScoreboardGame, city?: string): boolean {
  if (!city) return false;
  return game.competitors.some((c) => c.name.toLowerCase().includes(city.toLowerCase()));
}

export function Scoreboard({ user }: Props) {
  const [league, setLeague] = useState<League>("nba");
  const [games, setGames] = useState<ScoreboardGame[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setGames(null);
    setError(null);
    api
      .scoreboard(league)
      .then((data) => {
        if (!cancelled) setGames(data.games);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load scores");
      });
    return () => {
      cancelled = true;
    };
  }, [league]);

  return (
    <section className="card scoreboard">
      <h2>Today in sports</h2>
      <p className="hint">
        Game times shown in <strong>{user.name}</strong>&rsquo;s local time
        {user.city ? ` (${user.city})` : ""}. Data from ESPN&rsquo;s public API.
      </p>
      <div className="league-tabs">
        {LEAGUES.map((l) => (
          <button
            key={l}
            className={l === league ? "tab active" : "tab"}
            onClick={() => setLeague(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {!error && games === null && <p className="empty">Loading scores…</p>}
      {games !== null && games.length === 0 && (
        <p className="empty">No {league.toUpperCase()} games on today&rsquo;s slate.</p>
      )}

      <ul className="game-list">
        {(games ?? []).map((game) => (
          <li
            key={game.id}
            className={`game${isLocalTeam(game, user.city) ? " local" : ""}`}
          >
            <div className="game-teams">
              {game.competitors.map((c) => (
                <div key={c.abbreviation + c.homeAway} className="team">
                  {c.logo && <img src={c.logo} alt="" width={22} height={22} />}
                  <span className={c.winner ? "team-name winner" : "team-name"}>
                    {c.name}
                  </span>
                  {game.state !== "pre" && <span className="score">{c.score}</span>}
                </div>
              ))}
            </div>
            <div className="game-status">
              {game.state === "pre"
                ? formatInUserTimezone(game.date, user.timezone)
                : game.statusDetail}
              {isLocalTeam(game, user.city) && <span className="pill">local</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
