import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const VIBES = [
  "Food & Culture",
  "Adventure",
  "Relaxation",
  "Learning",
  "Nightlife",
  "Art & Museums",
] as const;

const schema = z.object({
  first_name: z.string().trim().min(2, "Please enter your first name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  city: z.enum(["Lagos", "Abuja", "Other"], {
    errorMap: () => ({ message: "Please choose a city" }),
  }),
  referral_source: z.string().max(50).optional(),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function WaitlistForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [vibes, setVibes] = useState<string[]>([]);

  function toggleVibe(v: string) {
    setVibes((cur) =>
      cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const raw = {
      first_name: String(fd.get("first_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      referral_source: String(fd.get("referral_source") ?? "") || undefined,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("waitlist_signups").insert({
      ...parsed.data,
      travel_vibes: vibes.length ? vibes : null,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        setServerError("You're already on the list — we'll be in touch!");
        setDone(true);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-card p-8 sm:p-10 shadow-[var(--shadow-soft)] border text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
          <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold">You're on the list</h3>
        <p className="mt-2 text-muted-foreground">
          {serverError ?? "Thanks for joining! Check your email for updates and insider news."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)] border space-y-5"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            name="first_name"
            placeholder="Your first name"
            aria-invalid={!!errors.first_name}
            aria-describedby={errors.first_name ? "first_name-err" : undefined}
            required
          />
          {errors.first_name && (
            <p id="first_name-err" className="text-sm text-destructive">{errors.first_name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-err" : undefined}
            required
          />
          {errors.email && (
            <p id="email-err" className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City of interest</Label>
          <Select name="city">
            <SelectTrigger id="city" aria-invalid={!!errors.city}>
              <SelectValue placeholder="Choose a city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lagos">Lagos</SelectItem>
              <SelectItem value="Abuja">Abuja</SelectItem>
              <SelectItem value="Other">Interested in other cities</SelectItem>
            </SelectContent>
          </Select>
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral_source">How did you hear about us? <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Select name="referral_source">
            <SelectTrigger id="referral_source">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Social media">Social media</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Search">Search</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Your travel vibe <span className="text-muted-foreground font-normal">(optional, pick any)</span></Label>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => {
            const active = vibes.includes(v);
            return (
              <button
                type="button"
                key={v}
                onClick={() => toggleVibe(v)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-primary-soft hover:border-primary/40"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {serverError && !done && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full h-12 text-base font-medium shadow-[var(--shadow-glow)]"
      >
        {submitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining…</>
        ) : (
          "Join the Waitlist"
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        No spam. We'll only email you about MyJourny.
      </p>
    </form>
  );
}
