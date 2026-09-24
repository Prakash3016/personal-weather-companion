export type PersonaId =
  | "health"
  | "fitness"
  | "beach"
  | "travel"
  | "family"
  | "agriculture"
  | "commute"
  | "events";

export interface Persona {
  id: PersonaId;
  label: string;
  tagline: string;
  emoji: string;
  widgets: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: "health",
    label: "Health conscious",
    tagline: "Air quality, pollen, UV and humidity",
    emoji: "🫁",
    widgets: ["aqi", "pollen", "uv", "humidity"],
  },
  {
    id: "fitness",
    label: "Outdoor fitness",
    tagline: "Best running hours, wind and heat alerts",
    emoji: "🏃",
    widgets: ["runhours", "sun", "wind", "heat"],
  },
  {
    id: "beach",
    label: "Beach & surf",
    tagline: "Waves, tides and water temperature",
    emoji: "🏖️",
    widgets: ["waves", "tide", "seatemp", "uv"],
  },
  {
    id: "travel",
    label: "Traveller",
    tagline: "Saved places, alerts and packing tips",
    emoji: "✈️",
    widgets: ["saved", "alerts", "packing", "forecast"],
  },
  {
    id: "family",
    label: "Parents & family",
    tagline: "School commute, rain and warnings",
    emoji: "👨‍👩‍👧",
    widgets: ["schoolrun", "rain", "alerts", "uv"],
  },
  {
    id: "agriculture",
    label: "Farm & garden",
    tagline: "Soil moisture, rainfall and frost alerts",
    emoji: "🌾",
    widgets: ["soil", "rainfall", "frost", "planting"],
  },
  {
    id: "commute",
    label: "Commuter",
    tagline: "Visibility, fog and storm travel alerts",
    emoji: "🚗",
    widgets: ["visibility", "rain", "wind", "alerts"],
  },
  {
    id: "events",
    label: "Event planner",
    tagline: "Extended forecast, rain odds, comfort index",
    emoji: "🎪",
    widgets: ["forecast", "rainchance", "comfort", "wind"],
  },
];

export const PERSONA_BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p])) as Record<
  PersonaId,
  Persona
>;

export const PERSONA_STORAGE_KEY = "mymausam.persona";
export const LOCATION_STORAGE_KEY = "mymausam.location";
