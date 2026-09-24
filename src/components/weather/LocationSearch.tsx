import { useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchPlaces, type GeoPlace } from "@/lib/weather";

export function LocationSearch({ onSelect }: { onSelect: (place: GeoPlace) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const places = await searchPlaces(query.trim());
      setResults(places);
      if (!places.length) toast.error("No place found with that name.");
    } catch {
      toast.error("Could not search right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast.error("Location is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSelect({
          name: "My location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setResults([]);
      },
      () => toast.error("Location permission denied."),
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a city, e.g. Chennai"
            aria-label="Search location"
            className="h-11 pl-9 transition-smooth"
          />
        </div>
        <Button type="submit" className="h-11 transition-smooth" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 transition-smooth"
          onClick={useMyLocation}
          aria-label="Use my location"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </form>
      {results.length > 0 ? (
        <ul className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {results.map((p) => (
            <li key={`${p.latitude},${p.longitude}`}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm transition-smooth hover:bg-secondary"
                onClick={() => {
                  onSelect(p);
                  setResults([]);
                  setQuery("");
                }}
              >
                {p.name}
                <span className="text-muted-foreground">
                  {p.admin1 ? `, ${p.admin1}` : ""}
                  {p.country ? `, ${p.country}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
