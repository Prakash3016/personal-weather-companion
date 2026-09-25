import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PersonaPicker } from "@/components/weather/PersonaPicker";
import { WidgetGrid } from "@/components/weather/Widgets";
import { LocationSearch } from "@/components/weather/LocationSearch";
import { Button } from "@/components/ui/button";
import {
  LOCATION_STORAGE_KEY,
  PERSONA_BY_ID,
  PERSONA_STORAGE_KEY,
  type PersonaId,
} from "@/lib/personas";
import { DEFAULT_PLACE, describeWeather, fetchWeather, type GeoPlace } from "@/lib/weather";
import heroImage from "@/assets/sky-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyMausam — a weather homepage built around you" },
      {
        name: "description",
        content:
          "Pick your profile — farmer, runner, traveller, parent and more — and see only the weather that matters to you: AQI, UV, rain, soil moisture, sea state and alerts.",
      },
      { property: "og:title", content: "MyMausam — a weather homepage built around you" },
      {
        property: "og:description",
        content: "Personalised weather widgets for health, fitness, farming, travel and commuting.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [place, setPlace] = useState<GeoPlace>(DEFAULT_PLACE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedPersona = localStorage.getItem(PERSONA_STORAGE_KEY) as PersonaId | null;
    if (savedPersona && PERSONA_BY_ID[savedPersona]) setPersona(savedPersona);
    const savedPlace = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (savedPlace) {
      try {
        setPlace(JSON.parse(savedPlace) as GeoPlace);
      } catch {
        /* ignore malformed value */
      }
    }
    setReady(true);
  }, []);

  function choosePersona(id: PersonaId) {
    setPersona(id);
    localStorage.setItem(PERSONA_STORAGE_KEY, id);
  }

  function chooseLocation(next: GeoPlace) {
    setPlace(next);
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(next));
  }

  const weatherQuery = useQuery({
    queryKey: ["weather", place.latitude, place.longitude],
    queryFn: () => fetchWeather(place),
    staleTime: 1000 * 60 * 10,
  });

  const w = weatherQuery.data;
  const activePersona = persona ? PERSONA_BY_ID[persona] : null;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Monsoon clouds over the Indian subcontinent at sunrise"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/55" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-primary-foreground sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
            Ministry of Earth Sciences · India Meteorological Department
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            A weather homepage that changes for every user
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/85">
            A farmer, a runner and a traveller open the same app today. MyMausam shows each of them
            only what matters — live from global forecast, air-quality and marine models.
          </p>
          <div className="mt-7 max-w-xl">
            <LocationSearch onSelect={chooseLocation} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Showing weather for</p>
            <p className="font-display text-xl font-semibold">
              {place.name}
              {place.admin1 ? `, ${place.admin1}` : ""}
            </p>
            {w ? (
              <p className="text-sm text-muted-foreground">
                {Math.round(w.current.temperature)} °C · {describeWeather(w.current.weatherCode)}
              </p>
            ) : null}
          </div>
          <Button
            variant="outline"
            className="transition-smooth"
            onClick={() => weatherQuery.refetch()}
            disabled={weatherQuery.isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold">
            {activePersona ? "Your profile" : "Pick your profile"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your choice is remembered on this device, and saved to your account once you sign in.
          </p>
          <div className="mt-5">
            <PersonaPicker value={persona} onChange={choosePersona} />
          </div>
        </div>

        <div className="mt-10">
          {!ready || weatherQuery.isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading live conditions…
            </div>
          ) : weatherQuery.isError ? (
            <p className="text-sm text-destructive">
              Live weather is unavailable right now. Please try refreshing.
            </p>
          ) : w && activePersona ? (
            <>
              <h2 className="mb-5 text-2xl font-semibold">
                Your {activePersona.label.toLowerCase()} homepage
              </h2>
              <WidgetGrid ids={activePersona.widgets} weather={w} />
            </>
          ) : w ? (
            <>
              <h2 className="mb-5 text-2xl font-semibold">Today at a glance</h2>
              <WidgetGrid ids={["forecast", "rain", "wind", "uv", "humidity", "alerts"]} weather={w} />
            </>
          ) : null}
        </div>

        <div className="mt-12 glass-card rounded-3xl p-6 text-center">
          <h2 className="text-xl font-semibold">Save your profile across devices</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Create a free account to keep your persona, saved places and alerts wherever you sign in.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild className="transition-smooth">
              <Link to="/signup">Create account</Link>
            </Button>
            <Button asChild variant="outline" className="transition-smooth">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        MyMausam · SIH 2026 · Problem statement SIH26076 · Data from IMD-aligned public forecast
        models
      </footer>
    </div>
  );
}
