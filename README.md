# User Endpoints Challenge

Full-stack CRUD app for the "User endpoints" coding challenge: an Express +
TypeScript API with users stored in a NoSQL database (Firebase Realtime
Database, with an automatic in-memory fallback), geo-enriched via
OpenWeatherMap, plus a ReactJS front-end.

## What it does

- **CRUD endpoints** for users: `id, name, zipCode, latitude, longitude, timezone`
- **Create/update by name + zip code only** — latitude, longitude, and timezone
  (UTC offset in seconds) are fetched from the
  [OpenWeatherMap current-weather API](https://openweathermap.org/current)
- **On update, geo data is re-fetched only if the zip code changed**
- **NoSQL storage**: Firebase Realtime Database when configured, otherwise an
  in-memory store so the app runs with zero setup
- **React front-end**: create, edit, and delete users; each card shows the
  resolved city, coordinates, and UTC offset
- **Creative extra — "Today in sports"**: live NFL/NBA/MLB/NHL scoreboards from
  ESPN's public (undocumented) API. Select a user and every game's start time
  is rendered in *that user's* stored timezone; games featuring a team from the
  user's city get a "local" badge.

## Quick start

Requires Node 18+ (built on Node 22). Two terminals:

```bash
# Terminal 1 — API on :8080
cd server
npm install
npm run dev

# Terminal 2 — React app on :5173 (proxies /api to :8080)
cd client
npm install
npm run dev
```

Open http://localhost:5173. No configuration is required — the server defaults
to the challenge-provided OpenWeatherMap key and the in-memory store.

## API

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/users` | Create. Body: `{"name": "Ada", "zipCode": "10001"}` → 201 with the full user (geo fields populated) |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get one user (404 if missing) |
| `PUT` | `/api/users/:id` | Update `name` and/or `zipCode`. Geo fields are re-fetched **only when the zip code changes** |
| `DELETE` | `/api/users/:id` | Delete (204) |
| `GET` | `/api/scoreboard?league=nba` | Today's games for `nfl` \| `nba` \| `mlb` \| `nhl` (ESPN proxy, cached 60s) |

Errors are JSON: `{"error": "..."}` — 400 for validation failures and unknown
zip codes, 404 for missing users, 502 when an upstream API is unavailable.

## Configuration

Copy `server/.env.example` to `server/.env` and adjust as needed:

| Variable | Default | Purpose |
|---|---|---|
| `OPENWEATHER_API_KEY` | challenge-provided key | OpenWeatherMap API key |
| `PORT` | `8080` | API port |
| `FIREBASE_DATABASE_URL` | *(unset)* | Set to your RTDB URL (e.g. `https://<project>-default-rtdb.firebaseio.com`) to enable Firebase storage |
| `FIREBASE_SERVICE_ACCOUNT` | *(unset)* | Service-account JSON as a string; alternatively set `GOOGLE_APPLICATION_CREDENTIALS` to a key-file path |

On startup the server logs which store is active (`firebase` or `in-memory`).
Both implement the same `UserRepository` interface
(`server/src/repositories/`), so the rest of the app is storage-agnostic.

## Project layout

```
server/src/
  index.ts               app bootstrap + error handling
  validation.ts          zod schemas for create/update payloads
  routes/users.ts        CRUD routes
  routes/scoreboard.ts   ESPN scoreboard proxy
  services/geo.ts        zip -> lat/lon/timezone via OpenWeatherMap
  services/espn.ts       ESPN scoreboard client (60s cache)
  repositories/          Firebase + in-memory stores behind one interface
client/src/
  App.tsx                layout and state
  api.ts                 typed API client
  components/            UserForm, UserList, Scoreboard
```
