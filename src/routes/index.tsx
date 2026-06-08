import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/WaitlistForm";
import heroImg from "@/assets/hero-travel.jpg";
import {
  Compass,
  Sparkles,
  MapPin,
  ListChecks,
  XCircle,
  EyeOff,
  UserCircle2,
  Wand2,
  HeartHandshake,
  ClipboardList,
  LayoutGrid,
  Plane,
  ShieldCheck,
  Brain,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyJourny — Travel Experiences Tailored to You" },
      {
        name: "description",
        content:
          "MyJourny learns who you are and curates authentic travel experiences that match your vibe — not what's popular. Join the waitlist.",
      },
      { property: "og:title", content: "MyJourny — Travel Experiences Tailored to You" },
      {
        property: "og:description",
        content:
          "Personality-driven travel discovery. Authentic local experiences in Lagos & Abuja. Join the waitlist.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-display font-semibold text-lg">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Compass className="h-4 w-4" />
      </span>
      MyJourny
    </a>
  );
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

type Card = { icon: React.ComponentType<{ className?: string }>; title: string; copy: string };

function CardGrid({ cards, tone }: { cards: Card[]; tone: "muted" | "primary" }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ icon: Icon, title, copy }) => (
        <div
          key={title}
          className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              tone === "primary"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground/70"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">{copy}</p>
        </div>
      ))}
    </div>
  );
}

function Landing() {
  return (
    <main id="top" className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Logo />
          <Button asChild size="sm" className="rounded-full">
            <a href="#waitlist">Join the Waitlist</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Now in private beta — Lagos & Abuja
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Travel experiences <span className="text-primary">tailored to you</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Stop scrolling through generic recommendations. MyJourny learns who you are and
              curates experiences you'll genuinely enjoy — not what's popular.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 px-6 rounded-full shadow-[var(--shadow-glow)]"
              >
                <a href="#waitlist">Join the Waitlist</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-full">
                <a href="#how">How it works</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary/50"
                  />
                ))}
              </div>
              Early travelers from Lagos, Abuja & beyond already on the list.
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" aria-hidden />
            <img
              src={heroImg}
              alt="Diverse travelers experiencing authentic local culture — food markets, artisans, and landscapes"
              width={1280}
              height={1280}
              className="relative rounded-[1.5rem] shadow-[var(--shadow-glow)] object-cover aspect-square w-full"
            />
          </div>
        </div>
      </section>

      {/* Problem */}
      <Section
        id="problem"
        eyebrow="The problem"
        title="Travel discovery is broken"
        subtitle="The way we discover places hasn't kept up with who we are."
      >
        <CardGrid
          tone="muted"
          cards={[
            {
              icon: ListChecks,
              title: "Decision overload",
              copy: "Hundreds of generic 'top 10' lists that don't reflect who you are or what you want.",
            },
            {
              icon: XCircle,
              title: "Wrong recommendations",
              copy: "Platforms recommend based on popularity and proximity, not your personality, energy level, or vibe.",
            },
            {
              icon: EyeOff,
              title: "Authentic experiences hidden",
              copy: "Local guides with niche, immersive experiences are buried under generic listings and ads.",
            },
          ]}
        />
      </Section>

      {/* Solution */}
      <Section
        id="solution"
        eyebrow="The solution"
        title="Meet MyJourny: travel that fits you"
        subtitle="A new way to discover where to go, what to do, and who to do it with."
        className="bg-surface"
      >
        <CardGrid
          tone="primary"
          cards={[
            {
              icon: UserCircle2,
              title: "Personality, not popularity",
              copy: "Answer 5 quick questions about your travel style, and we curate experiences that match your vibe.",
            },
            {
              icon: Wand2,
              title: "Recommendations that fit you",
              copy: "Each experience shows you exactly why it's recommended — based on your interests, energy, and intent.",
            },
            {
              icon: HeartHandshake,
              title: "Authentic local gems",
              copy: "Connect with vetted local hosts offering genuine, immersive experiences you won't find in generic guides.",
            },
          ]}
        />
      </Section>

      {/* How it works */}
      <Section
        id="how"
        eyebrow="How it works"
        title="Three simple steps"
        subtitle="From signup to your first authentic experience — in minutes."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: ClipboardList,
              title: "Tell us about you",
              copy: "Quick 3-minute preference onboarding. Share your travel energy, interests, budget, and vibe.",
            },
            {
              n: "02",
              icon: LayoutGrid,
              title: "Get a personalized feed",
              copy: "For any destination, see curated experiences ranked by fit — not popularity.",
            },
            {
              n: "03",
              icon: Plane,
              title: "Book & explore",
              copy: "Save experiences to your itinerary, book directly, and enjoy authentic travel.",
            },
          ].map(({ n, icon: Icon, title, copy }) => (
            <div
              key={n}
              className="relative rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
            >
              <span className="absolute -top-3 left-7 rounded-full bg-foreground text-background px-3 py-1 text-xs font-mono">
                {n}
              </span>
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why travelers love it */}
      <Section
        eyebrow="What makes us different"
        title="Built for travelers like you"
        className="bg-surface"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Brain,
              title: "AI that learns you",
              copy: "Personalization that improves with every trip.",
            },
            {
              icon: ShieldCheck,
              title: "Transparent & safe",
              copy: "Curated hosts, trust badges, and clear safety info.",
            },
            {
              icon: MapPin,
              title: "Local-first",
              copy: "Authentic experiences from authentic hosts.",
            },
            {
              icon: Users,
              title: "Flexible itinerary",
              copy: "Drag-and-drop planning with smart suggestions.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-2xl border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Waitlist */}
      <section id="waitlist" className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              Limited beta access
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Be first to experience MyJourny
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Join our waitlist. We'll notify you when we launch in your city.
            </p>
          </div>
          <div className="mt-10">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/80">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-display font-semibold text-background text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Compass className="h-4 w-4" />
                </span>
                MyJourny
              </div>
              <p className="mt-2 text-sm">Travel that fits you.</p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm">
              <a href="#problem" className="hover:text-background transition-colors">
                The problem
              </a>
              <a href="#solution" className="hover:text-background transition-colors">
                Solution
              </a>
              <a href="#how" className="hover:text-background transition-colors">
                How it works
              </a>
              <a
                href="mailto:hello@myjourny.app"
                className="hover:text-background transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="mt-10 pt-6 border-t border-background/15 flex flex-col sm:flex-row sm:justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} MyJourny. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-background transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
