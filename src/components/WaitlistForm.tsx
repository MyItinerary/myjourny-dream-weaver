import { useEffect, useRef, useState } from "react";
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
import { CheckCircle2, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";

const STORAGE_KEY = "myjourny_waitlist_draft_v1";
const TOTAL_STEPS = 4;

const TRAVEL_FREQUENCY = [
  "Monthly or more",
  "2–4 times a year",
  "Once a year",
  "I don't travel at all",
] as const;

const TRAVEL_PAIN_POINTS = [
  "Too many generic options, hard to choose",
  "Recommendations don't match my personality/vibe",
  "Can't find authentic local experiences",
  "Prices are unclear or hidden",
  "Don't trust the reviews/recommendations",
  "Waste too much time researching",
  "Other",
] as const;

const TRAVEL_PERSONALITY = [
  "The Foodie (food, cuisine, culinary experiences)",
  "The Cultural Explorer (history, art, traditions, museums)",
  "The Adventurer (outdoor, hiking, active experiences)",
  "The Relaxer (beach, wellness, slow travel)",
  "The Social Butterfly (nightlife, parties, meeting people)",
  "The Knowledge Seeker (learning, local talks, workshops)",
  "A mix of everything",
] as const;

const LOCAL_FREQUENCY = [
  "Weekly or more",
  "Few times a month",
  "Monthly",
  "Few times a year",
  "Rarely",
  "Never (and not interested)",
] as const;

const LOCAL_CHALLENGES = [
  "Don't know where to start",
  "Hard to find authentic/non-touristy spots",
  "Too many generic options",
  "No personalized recommendations",
  "Word-of-mouth is unreliable",
  "Takes too much time to research",
  "I don't have this problem / not applicable",
  "Other",
] as const;

const LOCAL_METHODS = [
  "Google Maps / Google Local",
  "Instagram / Social media",
  "Friends & recommendations",
  "Eventbrite / Event apps",
  "Facebook Groups",
  "Local lifestyle blogs",
  "Word of mouth",
  "I don't actively look",
] as const;

const USE_CASES = [
  "Planning trips to other cities/countries",
  "Discovering new experiences in my current city",
  "Weekend getaways near me",
  "Finding things to do with friends/family locally",
  "All of the above",
] as const;

const BUDGETS = [
  "Low (₦0–₦8,000/day) ~$5–20",
  "Mid (₦8,000–₦24,000/day) ~$20–60",
  "Premium (₦24,000+/day) ~$60+",
  "Varies per trip/activity",
] as const;

const HOST_INTEREST = [
  "Yes, I'm interested",
  "Maybe, tell me more",
  "No, I'm just looking to discover",
] as const;

type FormState = {
  first_name: string;
  email: string;
  city: "" | "Lagos" | "Abuja" | "Other";
  city_other: string;
  travel_frequency: string;
  travel_pain_point: string;
  travel_pain_point_other: string;
  travel_personality: string;
  local_frequency: string;
  local_challenges: string[];
  local_challenges_other: string;
  local_methods: string[];
  use_cases: string[];
  budget_level: string;
  host_interest: string;
};

const initialState: FormState = {
  first_name: "",
  email: "",
  city: "",
  city_other: "",
  travel_frequency: "",
  travel_pain_point: "",
  travel_pain_point_other: "",
  travel_personality: "",
  local_frequency: "",
  local_challenges: [],
  local_challenges_other: "",
  local_methods: [],
  use_cases: [],
  budget_level: "",
  host_interest: "",
};

const step1Schema = z.object({
  first_name: z.string().trim().min(2, "Please enter your first name (min 2 characters)").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  city: z.enum(["Lagos", "Abuja", "Other"], {
    errorMap: () => ({ message: "Please select a city" }),
  }),
});

type Errors = Record<string, string>;

export function WaitlistForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [resumed, setResumed] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Restore draft
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) setData({ ...initialState, ...parsed.data });
        if (parsed?.step && parsed.step > 1 && parsed.step <= TOTAL_STEPS) {
          setStep(parsed.step);
          setResumed(true);
        }
      }
    } catch {}
  }, []);

  // Persist draft
  useEffect(() => {
    if (typeof window === "undefined" || done) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch {}
  }, [step, data, done]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const { [key as string]: _, ...rest } = e;
      return rest;
    });
  }

  function toggleArray(key: "local_challenges" | "local_methods" | "use_cases", value: string, max?: number) {
    setData((d) => {
      const cur = d[key];
      if (cur.includes(value)) return { ...d, [key]: cur.filter((v) => v !== value) };
      if (max && cur.length >= max) return d;
      return { ...d, [key]: [...cur, value] };
    });
  }

  function validateStep(s: number): boolean {
    const errs: Errors = {};
    if (s === 1) {
      const parsed = step1Schema.safeParse({
        first_name: data.first_name,
        email: data.email,
        city: data.city,
      });
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const k = issue.path[0] as string;
          if (!errs[k]) errs[k] = issue.message;
        }
      }
      if (data.city === "Other" && !data.city_other.trim()) {
        errs.city_other = "Please specify your city";
      }
    }
    if (s === 2) {
      if (!data.travel_frequency) errs.travel_frequency = "Please select your travel frequency";
      if (!data.travel_pain_point) errs.travel_pain_point = "Please select your biggest frustration";
    }
    if (s === 3) {
      if (!data.local_frequency) errs.local_frequency = "Please select your local exploration frequency";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function next() {
    if (!validateStep(step)) return;
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      await submit();
    }
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  async function submit() {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    setSubmitting(true);
    setServerMsg(null);
    const painPoint =
      data.travel_pain_point === "Other" && data.travel_pain_point_other.trim()
        ? `Other: ${data.travel_pain_point_other.trim()}`
        : data.travel_pain_point || null;
    const localChallenges =
      data.local_challenges.length
        ? data.local_challenges.map((c) =>
            c === "Other" && data.local_challenges_other.trim()
              ? `Other: ${data.local_challenges_other.trim()}`
              : c
          )
        : null;
    const payload = {
      first_name: data.first_name.trim(),
      email: data.email.trim(),
      city: data.city as "Lagos" | "Abuja" | "Other",
      travel_frequency: data.travel_frequency || null,
      travel_pain_point: painPoint,
      travel_personality: data.travel_personality || null,
      local_frequency: data.local_frequency || null,
      local_challenges: localChallenges,
      local_methods: data.local_methods.length ? data.local_methods : null,
      use_cases: data.use_cases.length ? data.use_cases : null,
      budget_level: data.budget_level || null,
      host_interest: data.host_interest || null,
    };
    const { error } = await supabase.from("waitlist_signups").insert(payload);
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        setServerMsg("This email is already on the waitlist. Check your inbox for updates from us!");
        setDone(true);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      setServerMsg("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
    localStorage.removeItem(STORAGE_KEY);
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-card p-8 sm:p-10 shadow-[var(--shadow-soft)] border text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
          <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden />
        </div>
        <h3 className="mt-5 font-display text-3xl font-semibold text-primary">🎉 You're In!</h3>
        <p className="mt-3 text-foreground">
          {serverMsg ?? "Thanks for joining! Check your email for updates and a special surprise soon."}
        </p>
      </div>
    );
  }

  return (
    <div ref={formRef} className="rounded-2xl bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)] border space-y-6">
      <Progress step={step} />
      {resumed && step > 1 && (
        <p className="text-xs text-muted-foreground -mt-2">Resuming from step {step}…</p>
      )}

      {step === 1 && (
        <StepWrap title="Help us get started">
          <Field label="First Name" error={errors.first_name} htmlFor="first_name" required>
            <Input
              id="first_name"
              value={data.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              placeholder="Your first name"
              aria-invalid={!!errors.first_name}
            />
          </Field>
          <Field label="Email" error={errors.email} htmlFor="email" required>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field label="City of Interest" error={errors.city} htmlFor="city" required>
            <Select value={data.city} onValueChange={(v) => update("city", v as FormState["city"])}>
              <SelectTrigger id="city" aria-invalid={!!errors.city}>
                <SelectValue placeholder="Choose a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja</SelectItem>
                <SelectItem value="Other">Other (please specify)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {data.city === "Other" && (
            <Field label="Specify your city" error={errors.city_other} htmlFor="city_other" required>
              <Input
                id="city_other"
                value={data.city_other}
                onChange={(e) => update("city_other", e.target.value)}
                placeholder="Enter your city name"
                aria-invalid={!!errors.city_other}
                maxLength={100}
              />
            </Field>
          )}
        </StepWrap>
      )}

      {step === 2 && (
        <StepWrap title="Help us understand how you travel">
          <RadioGroup
            label="How often do you travel for experiences (trips to other cities/countries)?"
            required
            options={TRAVEL_FREQUENCY}
            value={data.travel_frequency}
            onChange={(v) => update("travel_frequency", v)}
            error={errors.travel_frequency}
          />
          <RadioGroup
            label="What's your biggest frustration when planning a trip?"
            required
            options={TRAVEL_PAIN_POINTS}
            value={data.travel_pain_point}
            onChange={(v) => update("travel_pain_point", v)}
            error={errors.travel_pain_point}
          />
          {data.travel_pain_point === "Other" && (
            <Field label="Tell us your pain point" htmlFor="travel_pain_point_other">
              <Input
                id="travel_pain_point_other"
                value={data.travel_pain_point_other}
                onChange={(e) => update("travel_pain_point_other", e.target.value)}
                placeholder="Type your pain point"
                maxLength={100}
              />
            </Field>
          )}
          <RadioGroup
            label="What's your travel personality?"
            options={TRAVEL_PERSONALITY}
            value={data.travel_personality}
            onChange={(v) => update("travel_personality", v)}
          />
        </StepWrap>
      )}

      {step === 3 && (
        <StepWrap title="Now tell us about discovering experiences locally">
          <RadioGroup
            label="How often do you explore/discover new experiences in your current city?"
            required
            options={LOCAL_FREQUENCY}
            value={data.local_frequency}
            onChange={(v) => update("local_frequency", v)}
            error={errors.local_frequency}
            help="This helps us understand local discovery demand"
          />
          <CheckboxGroup
            label="What's your biggest challenge when finding things to do locally?"
            options={LOCAL_CHALLENGES}
            values={data.local_challenges}
            onToggle={(v) => toggleArray("local_challenges", v, 3)}
            help="Select up to 3 that apply (optional)"
          />
          {data.local_challenges.includes("Other") && (
            <Field label="Tell us your challenge" htmlFor="local_challenges_other">
              <Input
                id="local_challenges_other"
                value={data.local_challenges_other}
                onChange={(e) => update("local_challenges_other", e.target.value)}
                placeholder="Type your challenge"
                maxLength={100}
              />
            </Field>
          )}
          <CheckboxGroup
            label="Where do you currently discover things to do in your city?"
            options={LOCAL_METHODS}
            values={data.local_methods}
            onToggle={(v) => toggleArray("local_methods", v)}
            help="Select all that apply"
          />
        </StepWrap>
      )}

      {step === 4 && (
        <StepWrap title="Optional: Help us personalize your experience (takes 30 seconds)">
          <CheckboxGroup
            label="Would you use MyJourny for...?"
            options={USE_CASES}
            values={data.use_cases}
            onToggle={(v) => toggleArray("use_cases", v)}
            help="Select all that apply"
          />
          <RadioGroup
            label="What's your typical daily budget for experiences?"
            options={BUDGETS}
            value={data.budget_level}
            onChange={(v) => update("budget_level", v)}
          />
          <RadioGroup
            label="Are you interested in offering experiences (locally or when traveling)?"
            options={HOST_INTEREST}
            value={data.host_interest}
            onChange={(v) => update("host_interest", v)}
          />
          {data.host_interest === "Yes, I'm interested" && (
            <p className="rounded-lg bg-primary-soft text-primary px-4 py-3 text-sm">
              Great! We'll contact you separately about hosting opportunities.
            </p>
          )}
        </StepWrap>
      )}

      {serverMsg && !done && <p className="text-sm text-destructive">{serverMsg}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={back} disabled={submitting}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          size={step === TOTAL_STEPS ? "lg" : "default"}
          onClick={next}
          disabled={submitting}
          className={step === TOTAL_STEPS ? "h-12 px-7 text-base shadow-[var(--shadow-glow)]" : ""}
        >
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining…</>
          ) : step === TOTAL_STEPS ? (
            "Join the Waitlist"
          ) : (
            <>Next <ArrowRight className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        No spam. We'll only email you about MyJourny.
      </p>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-medium text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs text-muted-foreground">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const n = i + 1;
          const isDone = n < step;
          const isActive = n === step;
          return (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                isDone || isActive ? "bg-primary" : "bg-muted"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function StepWrap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  htmlFor,
  required,
  help,
  children,
}: {
  label: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && <p className="text-sm text-destructive">⚠ {error}</p>}
    </div>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
  required,
  error,
  help,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  help?: string;
}) {
  return (
    <Field label={label} required={required} error={error} help={help}>
      <div className="grid gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                active
                  ? "bg-primary-soft border-primary text-foreground"
                  : "bg-background hover:bg-primary-soft/40 hover:border-primary/30"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-primary" : "border-muted-foreground/30"
                }`}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function CheckboxGroup({
  label,
  options,
  values,
  onToggle,
  help,
}: {
  label: string;
  options: readonly string[];
  values: string[];
  onToggle: (v: string) => void;
  help?: string;
}) {
  return (
    <Field label={label} help={help}>
      <div className="grid gap-2">
        {options.map((opt) => {
          const active = values.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onToggle(opt)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                active
                  ? "bg-primary-soft border-primary text-foreground"
                  : "bg-background hover:bg-primary-soft/40 hover:border-primary/30"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                  active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                }`}
              >
                {active && <Check className="h-3.5 w-3.5" />}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </Field>
  );
}
