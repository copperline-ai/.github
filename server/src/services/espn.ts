export const SUPPORTED_LEAGUES: Record<string, string> = {
  nfl: "football/nfl",
  nba: "basketball/nba",
  mlb: "baseball/mlb",
  nhl: "hockey/nhl",
};

export interface ScoreboardCompetitor {
  name: string;
  abbreviation: string;
  score: string;
  logo?: string;
  homeAway: string;
  winner?: boolean;
}

export interface ScoreboardGame {
  id: string;
  name: string;
  shortName: string;
  /** ISO start time (UTC) */
  date: string;
  state: "pre" | "in" | "post";
  statusDetail: string;
  competitors: ScoreboardCompetitor[];
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; games: ScoreboardGame[] }>();

/**
 * Fetches today's scoreboard for a league from ESPN's public (undocumented)
 * site API and trims it down to what the front-end needs. Cached for 60s.
 */
export async function fetchScoreboard(league: string): Promise<ScoreboardGame[]> {
  const path = SUPPORTED_LEAGUES[league];
  if (!path) {
    throw new Error(`Unsupported league "${league}"`);
  }

  const cached = cache.get(league);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.games;
  }

  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard`);
  if (!res.ok) {
    throw new Error(`ESPN scoreboard request failed with status ${res.status}`);
  }

  const data = (await res.json()) as any;
  const games: ScoreboardGame[] = (data.events ?? []).map((event: any) => {
    const competition = event.competitions?.[0] ?? {};
    return {
      id: String(event.id),
      name: event.name ?? "",
      shortName: event.shortName ?? "",
      date: event.date ?? "",
      state: event.status?.type?.state ?? "pre",
      statusDetail: event.status?.type?.shortDetail ?? "",
      competitors: (competition.competitors ?? []).map((c: any) => ({
        name: c.team?.displayName ?? "",
        abbreviation: c.team?.abbreviation ?? "",
        score: c.score ?? "",
        logo: c.team?.logo,
        homeAway: c.homeAway ?? "",
        winner: c.winner,
      })),
    };
  });

  cache.set(league, { at: Date.now(), games });
  return games;
}
