import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import heroImage from "@/assets/sky-hero.jpg";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="gradient-soft absolute inset-0 opacity-80" aria-hidden="true" />
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="mb-6 flex justify-center">
          <Brand size="lg" />
        </div>
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-5 text-center text-sm">{footer}</div> : null}
      </div>
    </main>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium tracking-wide text-muted-foreground">OR</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
