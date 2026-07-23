export interface User {
  id: string;
  name: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  /** UTC offset in seconds */
  timezone: number;
  city?: string;
}

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
  date: string;
  state: "pre" | "in" | "post";
  statusDetail: string;
  competitors: ScoreboardCompetitor[];
}

export type League = "nfl" | "nba" | "mlb" | "nhl";
