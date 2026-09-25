import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { PERSONAS } from "@/lib/personas";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MyMausam — personalised weather for every Indian" },
      {
        name: "description",
        content:
          "How MyMausam personalises the Mausam homepage for eight user profiles using live forecast, air quality and marine data.",
      },
      { property: "og:title", content: "About MyMausam" },
      {
        property: "og:description",
        content: "The idea, the data sources and the profiles behind the personalised Mausam homepage.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">About MyMausam</h1>
        <p className="mt-4 text-muted-foreground">
          Today every user of a weather app sees the same screen. A farmer needs soil moisture and
          frost warnings; a runner needs the coolest hour of the morning; a traveller needs packing
          advice. MyMausam asks each person once who they are, then rebuilds the homepage around
          that answer.
        </p>

        <h2 className="mt-10 text-xl font-semibold">The eight profiles</h2>
        <ul className="mt-4 space-y-3">
          {PERSONAS.map((p) => (
            <li key={p.id} className="glass-card rounded-2xl p-4">
              <p className="font-display font-semibold">
                {p.label}
              </p>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Where the data comes from</h2>
        <p className="mt-3 text-muted-foreground">
          Live forecasts, air-quality and pollen estimates, and marine wave and sea-surface models
          are pulled from open meteorological services and refreshed on demand. In production this
          layer would be backed by IMD's own observation and forecast feeds.
        </p>
      </main>
    </div>
  );
}
