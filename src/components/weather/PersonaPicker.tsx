import { PERSONAS, type PersonaId } from "@/lib/personas";

export function PersonaPicker({
  value,
  onChange,
}: {
  value: PersonaId | null;
  onChange: (id: PersonaId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {PERSONAS.map((p) => {
        const active = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            aria-pressed={active}
            className={`group rounded-2xl border p-4 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft ${
              active
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card"
            }`}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className="mt-2 block font-display text-sm font-semibold">{p.label}</span>
            <span
              className={`mt-1 block text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
            >
              {p.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
