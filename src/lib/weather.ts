export interface GeoPlace {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface WeatherBundle {
  place: GeoPlace;
  current: {
    temperature: number;
    apparent: number;
    humidity: number;
    windSpeed: number;
    windGusts: number;
    precipitation: number;
    weatherCode: number;
    visibility: number;
    isDay: boolean;
  };
  hourly: {
    time: string[];
    temperature: number[];
    uvIndex: number[];
    precipProbability: number[];
    windSpeed: number[];
    humidity: number[];
    visibility: number[];
    soilMoisture: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    tempMax: number[];
    tempMin: number[];
    precipSum: number[];
    precipProbability: number[];
    uvMax: number[];
    sunrise: string[];
    sunset: string[];
  };
  air: {
    usAqi: number | null;
    pm25: number | null;
    pm10: number | null;
    pollen: number | null;
  };
  marine: {
    waveHeight: number | null;
    wavePeriod: number | null;
    seaTemperature: number | null;
    available: boolean;
  };
}

const WEATHER_TEXT: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

export function describeWeather(code: number) {
  return WEATHER_TEXT[code] ?? "Mixed conditions";
}

export async function searchPlaces(query: string): Promise<GeoPlace[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
  );
  if (!res.ok) throw new Error("Could not search places");
  const json = (await res.json()) as { results?: Array<Record<string, unknown>> };
  return (json.results ?? []).map((r) => ({
    name: String(r['name']),
    admin1: r['admin1'] ? String(r['admin1']) : undefined,
    country: r['country'] ? String(r['country']) : undefined,
    latitude: Number(r['latitude']),
    longitude: Number(r['longitude']),
  }));
}

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather service unavailable");
  return res.json();
}

export async function fetchWeather(place: GeoPlace): Promise<WeatherBundle> {
  const { latitude: lat, longitude: lon } = place;

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,visibility,is_day` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,uv_index,wind_speed_10m,visibility,soil_moisture_0_to_1cm` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset` +
    `&timezone=auto&forecast_days=7`;

  const airUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
    `&current=us_aqi,pm2_5,pm10,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&timezone=auto`;

  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
    `&current=wave_height,wave_period,sea_surface_temperature&timezone=auto`;

  const [forecast, air, marine] = await Promise.all([
    getJson(forecastUrl),
    getJson(airUrl).catch(() => null),
    getJson(marineUrl).catch(() => null),
  ]);

  const pollenValues = [
    air?.current?.alder_pollen,
    air?.current?.birch_pollen,
    air?.current?.grass_pollen,
    air?.current?.ragweed_pollen,
  ].filter((v) => typeof v === "number") as number[];

  return {
    place,
    current: {
      temperature: forecast.current.temperature_2m,
      apparent: forecast.current.apparent_temperature,
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: forecast.current.wind_speed_10m,
      windGusts: forecast.current.wind_gusts_10m,
      precipitation: forecast.current.precipitation,
      weatherCode: forecast.current.weather_code,
      visibility: forecast.current.visibility,
      isDay: forecast.current.is_day === 1,
    },
    hourly: {
      time: forecast.hourly.time,
      temperature: forecast.hourly.temperature_2m,
      uvIndex: forecast.hourly.uv_index,
      precipProbability: forecast.hourly.precipitation_probability,
      windSpeed: forecast.hourly.wind_speed_10m,
      humidity: forecast.hourly.relative_humidity_2m,
      visibility: forecast.hourly.visibility,
      soilMoisture: forecast.hourly.soil_moisture_0_to_1cm ?? [],
    },
    daily: {
      time: forecast.daily.time,
      weatherCode: forecast.daily.weather_code,
      tempMax: forecast.daily.temperature_2m_max,
      tempMin: forecast.daily.temperature_2m_min,
      precipSum: forecast.daily.precipitation_sum,
      precipProbability: forecast.daily.precipitation_probability_max,
      uvMax: forecast.daily.uv_index_max,
      sunrise: forecast.daily.sunrise,
      sunset: forecast.daily.sunset,
    },
    air: {
      usAqi: air?.current?.us_aqi ?? null,
      pm25: air?.current?.pm2_5 ?? null,
      pm10: air?.current?.pm10 ?? null,
      pollen: pollenValues.length ? Math.max(...pollenValues) : null,
    },
    marine: {
      waveHeight: marine?.current?.wave_height ?? null,
      wavePeriod: marine?.current?.wave_period ?? null,
      seaTemperature: marine?.current?.sea_surface_temperature ?? null,
      available: typeof marine?.current?.wave_height === "number",
    },
  };
}

export function aqiBand(aqi: number | null) {
  if (aqi == null) return { label: "Unavailable", tone: "muted" as const };
  if (aqi <= 50) return { label: "Good", tone: "success" as const };
  if (aqi <= 100) return { label: "Moderate", tone: "warning" as const };
  if (aqi <= 150) return { label: "Unhealthy for sensitive groups", tone: "warning" as const };
  if (aqi <= 200) return { label: "Unhealthy", tone: "destructive" as const };
  return { label: "Very unhealthy", tone: "destructive" as const };
}

export function uvBand(uv: number) {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

/** Next hours ranked for outdoor running: cool, low UV, low rain chance, calm wind. */
export function bestRunHours(w: WeatherBundle) {
  const now = Date.now();
  const scored = w.hourly.time
    .map((t, i) => ({
      time: t,
      index: i,
      score:
        Math.abs((w.hourly.temperature[i] ?? 25) - 20) +
        (w.hourly.uvIndex[i] ?? 0) * 1.5 +
        (w.hourly.precipProbability[i] ?? 0) / 8 +
        (w.hourly.windSpeed[i] ?? 0) / 6,
    }))
    .filter((h) => {
      const ts = new Date(h.time).getTime();
      return ts > now && ts < now + 1000 * 60 * 60 * 30;
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  return scored.map((h) => ({
    time: h.time,
    temperature: w.hourly.temperature[h.index] ?? 0,
    rainChance: w.hourly.precipProbability[h.index] ?? 0,
  }));
}

/** 0-100 outdoor comfort index from temperature, humidity, wind and rain odds. */
export function comfortIndex(w: WeatherBundle) {
  const t = w.current.apparent;
  const tempPenalty = Math.min(50, Math.abs(t - 24) * 3);
  const humidityPenalty = Math.max(0, w.current.humidity - 65) * 0.5;
  const windPenalty = Math.max(0, w.current.windSpeed - 20) * 0.8;
  const rainPenalty = (w.daily.precipProbability[0] ?? 0) * 0.2;
  return Math.max(
    0,
    Math.round(100 - tempPenalty - humidityPenalty - windPenalty - rainPenalty),
  );
}

export function packingTips(w: WeatherBundle) {
  const tips: string[] = [];
  const rain = w.daily.precipProbability.slice(0, 3).some((p) => (p ?? 0) > 40);
  const cold = Math.min(...w.daily.tempMin.slice(0, 3)) < 15;
  const hot = Math.max(...w.daily.tempMax.slice(0, 3)) > 33;
  const uv = Math.max(...w.daily.uvMax.slice(0, 3));
  if (rain) tips.push("Carry a raincoat or compact umbrella");
  if (cold) tips.push("Pack a warm layer for the evenings");
  if (hot) tips.push("Light cottons and a refillable water bottle");
  if (uv >= 6) tips.push("Sunscreen SPF 30+ and sunglasses");
  if ((w.air.usAqi ?? 0) > 100) tips.push("An N95 mask for hazy days");
  if (!tips.length) tips.push("Comfortable clothing is enough — conditions look easy");
  return tips;
}

export function severeAlerts(w: WeatherBundle) {
  const alerts: { title: string; detail: string; tone: "warning" | "destructive" }[] = [];
  const code = w.current.weatherCode;
  if ([95, 96, 99].includes(code))
    alerts.push({ title: "Thunderstorm", detail: "Storm activity reported now — avoid open ground.", tone: "destructive" });
  if ([45, 48].includes(code) || w.current.visibility < 1000)
    alerts.push({ title: "Low visibility / fog", detail: "Drive slowly and use fog lights.", tone: "warning" });
  if (w.current.apparent >= 40)
    alerts.push({ title: "Heat alert", detail: "Feels like 40 °C or more — stay hydrated and indoors at noon.", tone: "destructive" });
  if (Math.min(...w.daily.tempMin.slice(0, 3)) <= 2)
    alerts.push({ title: "Frost risk", detail: "Night temperatures near freezing — protect young crops.", tone: "warning" });
  if ((w.daily.precipSum[0] ?? 0) > 50)
    alerts.push({ title: "Heavy rainfall", detail: "Over 50 mm expected today — expect waterlogging.", tone: "destructive" });
  if (w.current.windGusts > 60)
    alerts.push({ title: "Strong winds", detail: "Gusts above 60 km/h — secure loose objects.", tone: "warning" });
  return alerts;
}

export function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: "short" });
}

export const DEFAULT_PLACE: GeoPlace = {
  name: "New Delhi",
  admin1: "Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
};
