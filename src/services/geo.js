// API key provided with the challenge prompt; override with OPENWEATHER_API_KEY
const DEFAULT_API_KEY = "7afa46f2e91768e7eeeb9001ce40de19";

class ZipNotFoundError extends Error {
  constructor(zipCode) {
    super(`Zip code "${zipCode}" was not found`);
    this.name = "ZipNotFoundError";
  }
}

/**
 * Resolves a zip code to { latitude, longitude, timezone, city } using the
 * OpenWeatherMap current-weather API (https://openweathermap.org/current).
 * `timezone` is the UTC offset in seconds.
 */
async function fetchGeoForZip(zipCode, country = "US") {
  const apiKey = process.env.OPENWEATHER_API_KEY || DEFAULT_API_KEY;
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("zip", `${zipCode},${country}`);
  url.searchParams.set("appid", apiKey);

  const res = await fetch(url);
  if (res.status === 404) {
    throw new ZipNotFoundError(zipCode);
  }
  if (!res.ok) {
    throw new Error(`OpenWeatherMap request failed with status ${res.status}`);
  }

  const data = await res.json();
  return {
    latitude: data.coord.lat,
    longitude: data.coord.lon,
    timezone: data.timezone,
    city: data.name || undefined,
  };
}

module.exports = { fetchGeoForZip, ZipNotFoundError };
