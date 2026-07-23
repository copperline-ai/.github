const SUPPORTED_LEAGUES = {
  nfl: "football/nfl",
  nba: "basketball/nba",
  mlb: "baseball/mlb",
  nhl: "hockey/nhl",
};

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map();

/**
 * Fetches today's scoreboard for a league from ESPN's public (undocumented)
 * site API and trims it down to what the front-end needs. Cached for 60s.
 */
async function fetchScoreboard(league) {
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

  const data = await res.json();
  const games = (data.events || []).map((event) => {
    const competition = (event.competitions || [])[0] || {};
    return {
      id: String(event.id),
      name: event.name || "",
      shortName: event.shortName || "",
      date: event.date || "",
      state: (event.status && event.status.type && event.status.type.state) || "pre",
      statusDetail: (event.status && event.status.type && event.status.type.shortDetail) || "",
      competitors: (competition.competitors || []).map((c) => ({
        name: (c.team && c.team.displayName) || "",
        abbreviation: (c.team && c.team.abbreviation) || "",
        score: c.score || "",
        logo: c.team && c.team.logo,
        homeAway: c.homeAway || "",
        winner: c.winner,
      })),
    };
  });

  cache.set(league, { at: Date.now(), games });
  return games;
}

module.exports = { SUPPORTED_LEAGUES, fetchScoreboard };
