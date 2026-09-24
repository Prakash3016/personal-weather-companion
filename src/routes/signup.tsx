import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, OrDivider } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { friendlyAuthError, useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your MyMausam account" },
      {
        name: "description",
        content: "Sign up to save your weather profile, places and alerts across devices.",
      },
      { property: "og:title", content: "Create your MyMausam account" },
      { property: "og:description", content: "Sign up for a personalised weather homepage." },
    ],
  }),
  component: SignupPage,
});

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sessionLoading && user) navigate({ to: "/", replace: true });
  }, [user, sessionLoading, navigate]);

  function validate() {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = "Please enter your full name.";
    if (!username.trim()) next.username = "Please choose a username.";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim()))
      next.username = "3–20 characters, letters, numbers or underscore only.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (!password) next.password = "Please create a password.";
    else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
      next.password = "Use at least 8 characters with a letter and a number.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    if (!terms) next.terms = "Please accept the Terms and Conditions.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim(), username: username.trim().toLowerCase() },
      },
    });
    setSubmitting(false);

    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      toast.error("An account with this email already exists.");
      return;
    }
    if (!data.session) {
      setSent(true);
      return;
    }
    toast.success("Account created!");
    navigate({ to: "/", replace: true });
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-up did not complete. Please try again.");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/", replace: true });
    } catch {
      toast.error("Google sign-up did not complete. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="One last step to activate your account"
        footer={
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        }
      >
        <div className="flex items-start gap-3 rounded-2xl bg-secondary p-4 text-sm">
          <MailCheck className="mt-0.5 h-5 w-5 text-primary" />
          <p>
            We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it
            to finish creating your account, then sign in.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Sign up to get started"
      footer={
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            className="h-11 transition-smooth"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName ? <p className="text-xs text-destructive">{errors.fullName}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="h-11 transition-smooth"
            aria-invalid={!!errors.username}
          />
          {errors.username ? <p className="text-xs text-destructive">{errors.username}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="h-11 transition-smooth"
            aria-invalid={!!errors.email}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="h-11 pr-11 transition-smooth"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-smooth hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="h-11 pr-11 transition-smooth"
              aria-invalid={!!errors.confirm}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-smooth hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm ? <p className="text-xs text-destructive">{errors.confirm}</p> : null}
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox
              className="mt-0.5"
              checked={terms}
              onCheckedChange={(v) => setTerms(v === true)}
            />
            I accept the Terms and Conditions and the Privacy Policy.
          </label>
          {errors.terms ? <p className="mt-1 text-xs text-destructive">{errors.terms}</p> : null}
        </div>

        <Button type="submit" className="h-11 w-full transition-smooth" disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <OrDivider />
      <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
    </AuthShell>
  );
}
