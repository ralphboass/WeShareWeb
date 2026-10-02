import type { Metadata } from "next";
import { MapPin, Mail, User, Car } from "lucide-react";
import { Badge } from "@/components/ui";
import { SUPPORT_EMAIL } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about WeShare Ride — the student ride-sharing platform built for Los Angeles. Meet the founder and get in touch.",
};

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
          <Icon className="size-5 text-brand-600" />
        </span>
        <h2 className="text-base font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <Badge>About WeShare</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Built by a student, for students
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
            WeShare Ride is a ride-sharing marketplace connecting students across
            Southern California — making every drive cheaper, more social, and
            better for the planet.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-12 space-y-6">

        {/* Mission */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
              <Car className="size-5 text-brand-600" />
            </span>
            <h2 className="text-base font-bold text-ink">Our mission</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Students in Los Angeles drive the same routes every week — to campus,
            to the airport, home for the holidays — with empty seats next to them.
            WeShare fills those seats. Drivers cover their fuel. Passengers skip
            the bus. Together, fewer cars end up on the freeway.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            We built WeShare around trust: every account is verified with a
            real email, payments are held until the trip is complete, and ratings
            keep the community accountable. The result is a ride-sharing
            experience that actually works for students.
          </p>
        </div>

        {/* Founder */}
        <Section title="Founder" icon={User}>
          <p>
            <span className="font-semibold text-ink">Ralph Boas Stücher</span>
          </p>
          <p className="mt-1">
            WeShare was founded to solve a problem Ralph saw first-hand as a
            student in Los Angeles: too many cars, not enough affordable and
            convenient ways to share them. He built the iOS app and web platform
            from the ground up, combining his background in software engineering
            with a focus on community-driven transportation.
          </p>
        </Section>

        {/* Mailing address */}
        <Section title="Mailing address" icon={MapPin}>
          <address className="not-italic">
            <span className="font-semibold text-ink">WeShare Ride</span>
            <br />
            1575 Westwood Blvd STE 302
            <br />
            Los Angeles, CA 90024
            <br />
            United States
          </address>
        </Section>

        {/* Contact */}
        <Section title="Contact us" icon={Mail}>
          <p>
            Questions, feedback, or partnership inquiries? We read every email.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-block font-semibold text-brand-600 hover:text-brand-700"
          >
            {SUPPORT_EMAIL}
          </a>
        </Section>

      </div>
    </div>
  );
}
