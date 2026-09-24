import { Link } from "@tanstack/react-router";
import { CloudSun } from "lucide-react";

export function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 transition-smooth hover:opacity-85">
      <span
        className={`gradient-sky grid place-items-center rounded-2xl text-primary-foreground shadow-soft ${
          size === "lg" ? "h-12 w-12" : "h-9 w-9"
        }`}
      >
        <CloudSun className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display font-semibold tracking-tight ${
            size === "lg" ? "text-2xl" : "text-lg"
          }`}
        >
          MyMausam
        </span>
        <span className="block text-[11px] text-muted-foreground">Personalised weather</span>
      </span>
    </Link>
  );
}
