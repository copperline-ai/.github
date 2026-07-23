const DEFAULT_API_KEY = "7afa46f2e91768e7eeeb9001ce40de19";

export interface GeoData {
  latitude: number;
  longitude: number;
  /** UTC offset in seconds */
  timezone: number;
  city?: string;
}

export class ZipNotFoundError extends Error {
  constructor(zipCode: string) {
    super(`Zip code "${zipCode}" was not found`);
    this.name = "ZipNotFoundError";
  }
}

interface OwmCurrentWeatherResponse {
  coord: { lat: number; lon: number };
  timezone: number;
  name?: string;
}

/**
 * Resolves a zip code to latitude/longitude/timezone using the
 * OpenWeatherMap current-weather API (https://openweathermap.org/current).
 */
export async function fetchGeoForZip(zipCode: string, country = "US"): Promise<GeoData> {
  const apiKey = process.env.OPENWEATHER_API_KEY ?? DEFAULT_API_KEY;
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

  const data = (await res.json()) as OwmCurrentWeatherResponse;
  return {
    latitude: data.coord.lat,
    longitude: data.coord.lon,
    timezone: data.timezone,
    city: data.name || undefined,
  };
}
