import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { PersonaPicker } from "@/components/weather/PersonaPicker";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PERSONA_STORAGE_KEY, type PersonaId } from "@/lib/personas";

export const Route = createFileRoute("/_authenticated/my-mausam")({
  head: () => ({
    meta: [
      { title: "My Mausam — your profile" },
      { name: "description", content: "Manage your MyMausam account details and default weather profile." },
      { property: "og:title", content: "My Mausam — your profile" },
      { property: "og:description", content: "Your account details and default weather profile." },
    ],
  }),
  component: MyMausam,
});

function MyMausam() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [persona, setPersona] = useState<PersonaId | null>(null);

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, email, persona, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem(PERSONA_STORAGE_KEY) as PersonaId | null)
      : null);
    setPersona((profileQuery.data?.persona as PersonaId | null) ?? stored ?? null);
  }, [profileQuery.data]);

  const savePersona = useMutation({
    mutationFn: async (id: PersonaId) => {
      const { error } = await supabase.from("profiles").update({ persona: id }).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: (_d, id) => {
      localStorage.setItem(PERSONA_STORAGE_KEY, id);
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Default profile saved");
    },
    onError: () => toast.error("Could not save your profile. Please try again."),
  });

  const profile = profileQuery.data;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold">My Mausam</h1>
        <p className="mt-1 text-muted-foreground">Your account and default weather profile.</p>

        <section className="glass-card mt-8 rounded-3xl p-6">
          <h2 className="text-lg font-semibold">Account details</h2>
          {profileQuery.isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Full name</dt>
                <dd className="font-medium">{profile?.full_name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Username</dt>
                <dd className="font-medium">{profile?.username ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
                <dd className="font-medium">{profile?.email ?? user?.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Member since</dt>
                <dd className="font-medium">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
            </dl>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Default profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This decides which widgets appear on your homepage.
          </p>
          <div className="mt-4">
            <PersonaPicker value={persona} onChange={(id) => setPersona(id)} />
          </div>
          <Button
            className="mt-5 transition-smooth"
            disabled={!persona || savePersona.isPending}
            onClick={() => persona && savePersona.mutate(persona)}
          >
            {savePersona.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save default profile
          </Button>
        </section>
      </main>
    </div>
  );
}
