import type { ReactNode } from "react";
import {
  aqiBand,
  bestRunHours,
  comfortIndex,
  describeWeather,
  formatDay,
  formatHour,
  packingTips,
  severeAlerts,
  uvBand,
  type WeatherBundle,
} from "@/lib/weather";
import { Progress } from "@/components/ui/progress";

function Widget({
  title,
  hint,
  children,
  wide,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={`glass-card rounded-3xl p-5 transition-smooth hover:-translate-y-0.5 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BigValue({ value, unit, note }: { value: string; unit?: string; note?: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold">
        {value}
        {unit ? <span className="ml-1 text-base text-muted-foreground">{unit}</span> : null}
      </p>
      {note ? <p className="mt-1 text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export function WidgetGrid({ ids, weather }: { ids: string[]; weather: WeatherBundle }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((id) => (
        <Widget2 key={id} id={id} weather={weather} />
      ))}
    </div>
  );
}

function Widget2({ id, weather: w }: { id: string; weather: WeatherBundle }) {
  switch (id) {
    case "aqi": {
      const band = aqiBand(w.air.usAqi);
      return (
        <Widget title="Air quality" hint={band.label}>
          <BigValue
            value={w.air.usAqi != null ? String(Math.round(w.air.usAqi)) : "—"}
            unit="AQI"
            note={
              w.air.pm25 != null
                ? `PM2.5 ${Math.round(w.air.pm25)} µg/m³ · PM10 ${Math.round(w.air.pm10 ?? 0)} µg/m³`
                : "Not reported for this location"
            }
          />
          <Progress className="mt-3" value={Math.min(100, ((w.air.usAqi ?? 0) / 300) * 100)} />
        </Widget>
      );
    }
    case "pollen":
      return (
        <Widget title="Pollen count" hint="Grain/m³">
          <BigValue
            value={w.air.pollen != null ? String(Math.round(w.air.pollen)) : "—"}
            note={
              w.air.pollen == null
                ? "Pollen data is not published for this area"
                : w.air.pollen > 50
                  ? "High — allergy sufferers should limit outdoor time"
                  : "Low to moderate levels right now"
            }
          />
        </Widget>
      );
    case "uv": {
      const uvNow = Math.max(...w.hourly.uvIndex.slice(0, 12).map((v) => v ?? 0));
      return (
        <Widget title="UV index" hint={uvBand(uvNow)}>
          <BigValue
            value={uvNow.toFixed(1)}
            note={uvNow >= 6 ? "Use sunscreen and cover up outdoors" : "Safe for normal exposure"}
          />
        </Widget>
      );
    }
    case "humidity":
      return (
        <Widget title="Humidity" hint="Now">
          <BigValue
            value={String(Math.round(w.current.humidity))}
            unit="%"
            note={`Feels like ${Math.round(w.current.apparent)} °C`}
          />
        </Widget>
      );
    case "runhours": {
      const hours = bestRunHours(w);
      return (
        <Widget title="Best running hours" hint="Next 30 h" wide>
          <ul className="space-y-2">
            {hours.map((h) => (
              <li
                key={h.time}
                className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-sm"
              >
                <span className="font-medium">{formatHour(h.time)}</span>
                <span className="text-muted-foreground">
                  {Math.round(h.temperature)} °C · {h.rainChance}% rain
                </span>
              </li>
            ))}
          </ul>
        </Widget>
      );
    }
    case "sun":
      return (
        <Widget title="Sunrise & sunset">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="font-display text-xl font-semibold">{formatHour(w.daily.sunrise[0]!)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sunset</p>
              <p className="font-display text-xl font-semibold">{formatHour(w.daily.sunset[0]!)}</p>
            </div>
          </div>
        </Widget>
      );
    case "wind":
      return (
        <Widget title="Wind" hint="Now">
          <BigValue
            value={String(Math.round(w.current.windSpeed))}
            unit="km/h"
            note={`Gusts up to ${Math.round(w.current.windGusts)} km/h`}
          />
        </Widget>
      );
    case "heat":
      return (
        <Widget title="Heat alert">
          <BigValue
            value={`${Math.round(w.current.apparent)} °C`}
            note={
              w.current.apparent >= 38
                ? "High heat stress — avoid midday activity"
                : "No heat stress expected today"
            }
          />
        </Widget>
      );
    case "waves":
      return (
        <Widget title="Wave height">
          <BigValue
            value={w.marine.available ? `${w.marine.waveHeight?.toFixed(1)}` : "—"}
            unit="m"
            note={
              w.marine.available
                ? `Wave period ${w.marine.wavePeriod?.toFixed(0) ?? "—"} s`
                : "Pick a coastal location for sea conditions"
            }
          />
        </Widget>
      );
    case "tide":
      return (
        <Widget title="Sea state" hint="Marine model">
          <BigValue
            value={
              w.marine.available
                ? (w.marine.waveHeight ?? 0) < 1
                  ? "Calm"
                  : (w.marine.waveHeight ?? 0) < 2
                    ? "Moderate"
                    : "Rough"
                : "—"
            }
            note={
              w.marine.available
                ? "Based on live wave height and period"
                : "Available near coastlines only"
            }
          />
        </Widget>
      );
    case "seatemp":
      return (
        <Widget title="Water temperature">
          <BigValue
            value={
              w.marine.seaTemperature != null ? w.marine.seaTemperature.toFixed(1) : "—"
            }
            unit="°C"
            note={w.marine.available ? "Sea surface" : "Coastal locations only"}
          />
        </Widget>
      );
    case "saved":
      return (
        <Widget title="Quick trip check">
          <p className="text-sm text-muted-foreground">
            Search any destination above to preview its conditions instantly, then save it to your
            profile once you sign in.
          </p>
        </Widget>
      );
    case "alerts": {
      const alerts = severeAlerts(w);
      return (
        <Widget title="Severe weather alerts" wide>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active warnings for this location.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li
                  key={a.title}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    a.tone === "destructive"
                      ? "bg-destructive/12 text-destructive"
                      : "bg-warning/20 text-warning-foreground"
                  }`}
                >
                  <span className="font-semibold">{a.title}</span> — {a.detail}
                </li>
              ))}
            </ul>
          )}
        </Widget>
      );
    }
    case "packing":
      return (
        <Widget title="Packing suggestions" wide>
          <ul className="space-y-1.5 text-sm">
            {packingTips(w).map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden="true">•</span>
                {t}
              </li>
            ))}
          </ul>
        </Widget>
      );
    case "forecast":
      return (
        <Widget title="7-day outlook" wide>
          <div className="flex justify-between gap-2 overflow-x-auto">
            {w.daily.time.map((d, i) => (
              <div key={d} className="min-w-14 text-center">
                <p className="text-xs text-muted-foreground">{formatDay(d)}</p>
                <p className="mt-1 font-display text-sm font-semibold">
                  {Math.round(w.daily.tempMax[i] ?? 0)}°
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(w.daily.tempMin[i] ?? 0)}°
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {w.daily.precipProbability[i] ?? 0}%
                </p>
              </div>
            ))}
          </div>
        </Widget>
      );
    case "schoolrun": {
      const idx = w.hourly.time.findIndex((t) => new Date(t).getHours() === 8);
      return (
        <Widget title="School commute (8 AM)">
          <BigValue
            value={idx >= 0 ? `${Math.round(w.hourly.temperature[idx] ?? 0)} °C` : "—"}
            note={
              idx >= 0
                ? `${w.hourly.precipProbability[idx] ?? 0}% chance of rain · visibility ${Math.round(
                    (w.hourly.visibility[idx] ?? 0) / 1000,
                  )} km`
                : "Morning data unavailable"
            }
          />
        </Widget>
      );
    }
    case "rain":
      return (
        <Widget title="Rain today">
          <BigValue
            value={`${w.daily.precipProbability[0] ?? 0}%`}
            note={`${(w.daily.precipSum[0] ?? 0).toFixed(1)} mm expected`}
          />
        </Widget>
      );
    case "soil": {
      const soil = w.hourly.soilMoisture[0];
      return (
        <Widget title="Soil moisture" hint="Top layer">
          <BigValue
            value={typeof soil === "number" ? soil.toFixed(2) : "—"}
            unit="m³/m³"
            note={
              typeof soil === "number" && soil < 0.15
                ? "Dry — irrigation likely needed"
                : "Adequate moisture in the top soil"
            }
          />
        </Widget>
      );
    }
    case "rainfall":
      return (
        <Widget title="Rainfall (7 days)" wide>
          <div className="flex items-end gap-2">
            {w.daily.time.map((d, i) => {
              const mm = w.daily.precipSum[i] ?? 0;
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-accent"
                    style={{ height: `${Math.min(80, mm * 4 + 4)}px` }}
                  />
                  <span className="text-[11px] text-muted-foreground">{formatDay(d)}</span>
                  <span className="text-[11px] font-medium">{mm.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
        </Widget>
      );
    case "frost": {
      const minTemp = Math.min(...w.daily.tempMin.slice(0, 5));
      return (
        <Widget title="Frost alert">
          <BigValue
            value={`${Math.round(minTemp)} °C`}
            note={minTemp <= 2 ? "Frost risk in the next 5 nights" : "No frost risk this week"}
          />
        </Widget>
      );
    }
    case "planting":
      return (
        <Widget title="Planting guidance">
          <p className="text-sm text-muted-foreground">
            {(w.daily.precipSum.slice(0, 5).reduce((a, b) => a + (b ?? 0), 0)) > 25
              ? "Good soil wetting expected — favourable window for sowing rain-fed crops."
              : "Dry spell ahead — plan irrigation before sowing or transplanting."}
          </p>
        </Widget>
      );
    case "visibility":
      return (
        <Widget title="Visibility" hint="Now">
          <BigValue
            value={(w.current.visibility / 1000).toFixed(1)}
            unit="km"
            note={
              w.current.visibility < 2000
                ? "Poor visibility — drive with caution"
                : "Clear driving conditions"
            }
          />
        </Widget>
      );
    case "rainchance":
      return (
        <Widget title="Probability of rain" hint="Next 3 days">
          <div className="space-y-2">
            {w.daily.time.slice(0, 3).map((d, i) => (
              <div key={d} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-muted-foreground">{formatDay(d)}</span>
                <Progress value={w.daily.precipProbability[i] ?? 0} className="flex-1" />
                <span className="w-10 text-right font-medium">
                  {w.daily.precipProbability[i] ?? 0}%
                </span>
              </div>
            ))}
          </div>
        </Widget>
      );
    case "comfort": {
      const score = comfortIndex(w);
      return (
        <Widget title="Comfort index" hint="Outdoor gatherings">
          <BigValue
            value={String(score)}
            unit="/100"
            note={score > 75 ? "Great for an outdoor event" : score > 50 ? "Acceptable — plan shade and water" : "Consider an indoor backup"}
          />
          <Progress className="mt-3" value={score} />
        </Widget>
      );
    }
    default:
      return (
        <Widget title="Conditions">
          <BigValue
            value={`${Math.round(w.current.temperature)} °C`}
            note={describeWeather(w.current.weatherCode)}
          />
        </Widget>
      );
  }
}
