import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WeShare Ride collects, uses and protects your personal data, including ride history, messages and Stripe-processed payments.",
};

const LAST_UPDATED = "September 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

function MailLink() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="font-semibold text-brand-600 hover:text-brand-700"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
        Last updated {LAST_UPDATED}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        WeShare Ride (&quot;WeShare&quot;, &quot;we&quot;, &quot;us&quot;)
        operates the WeShare Ride website and iOS app, a ride-sharing
        marketplace for students in Los Angeles, California. This policy explains
        what personal data we collect, why we collect it, who processes it on our
        behalf and the choices you have. Questions? Email <MailLink />.
      </p>

      <Section title="1. Data we collect">
        <p>
          <strong className="text-ink">Account details.</strong> Your first and
          last name, email address, phone number, password (stored only as a hash
          by our authentication provider), and optionally a profile photo, short
          biography, home area and vehicle details if you drive.
        </p>
        <p>
          <strong className="text-ink">Ride and booking history.</strong> Rides
          you post or search for, pickup and drop-off locations, departure times,
          seat requests, seat prices, cancellations, completed trips, ratings and
          reviews you give or receive.
        </p>
        <p>
          <strong className="text-ink">Messages.</strong> The in-app chat between
          a driver and their passengers, so both sides can coordinate a pickup and
          so we can investigate safety reports.
        </p>
        <p>
          <strong className="text-ink">Payment data.</strong> Payments are
          processed by Stripe. Full card details are entered directly into
          Stripe&apos;s secure fields and{" "}
          <strong className="text-ink">never touch WeShare servers</strong>. We
          store only non-sensitive references such as a Stripe customer or account
          ID, the card brand and last four digits, and the amount and status of
          each transaction.
        </p>
        <p>
          <strong className="text-ink">Technical data.</strong> Device and browser
          type, app version, approximate region, crash reports and basic usage
          events, used to keep the service reliable and secure.
        </p>
        <p>
          <strong className="text-ink">Student verification.</strong> If you sign
          up with a university (.edu) email address, we record that your email
          domain is a recognised campus so we can show a verified-student badge.
          We do not access university records.
        </p>
      </Section>

      <Section title="2. How we use your data">
        <ul className="list-disc space-y-2 pl-5">
          <li>To create and maintain your account and profile.</li>
          <li>
            To match passengers with drivers, show ride listings and share the
            details each side needs to complete a trip.
          </li>
          <li>
            To authorize, capture and refund payments and to pay drivers out.
          </li>
          <li>
            To send transactional notifications about requests, acceptances,
            messages, cancellations and receipts.
          </li>
          <li>
            To keep the community safe: detecting fraud, investigating reports,
            and enforcing our Terms of Service.
          </li>
          <li>To comply with legal, tax and accounting obligations.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not use your messages for
          advertising.
        </p>
      </Section>

      <Section title="3. What other users can see">
        <p>
          Other users see your name, profile photo, ratings, number of trips,
          verified-student badge and any biography or vehicle details you add.
          Your phone number and exact pickup address are shared with the other
          party only once a seat request has been accepted, so the trip can go
          ahead.
        </p>
      </Section>

      <Section title="4. Processors we rely on">
        <p>
          We use a small number of vendors who process data strictly on our
          instructions:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Google Firebase / Google Cloud</strong> —
            authentication, database (Firestore), file storage, hosting, push
            notifications and crash reporting.
          </li>
          <li>
            <strong className="text-ink">Stripe, Inc.</strong> — card
            authorization and capture, driver payouts and fraud prevention. Stripe
            acts as an independent controller for payment data under its own
            privacy policy.
          </li>
          <li>
            <strong className="text-ink">Apple</strong> — App Store distribution
            and push notification delivery for the iOS app.
          </li>
        </ul>
        <p>
          Data may be stored on servers in the United States. Where required, we
          rely on standard contractual clauses for international transfers.
        </p>
      </Section>

      <Section title="5. Retention">
        <p>
          We keep your account data for as long as your account is active. Ride,
          booking and payment records are retained for up to seven years after a
          trip, because we need them for accounting, tax and dispute resolution.
          Chat messages are retained while the related ride record exists. Deleted
          accounts are removed or irreversibly anonymised within 30 days, except
          for records we are legally required to keep.
        </p>
      </Section>

      <Section title="6. Your rights">
        <p>
          You can access and correct most of your information directly in your
          profile. You also have the right to request a copy of your data, to ask
          us to correct or delete it, to object to certain processing and to
          withdraw consent where we rely on it. California residents have
          additional rights under the CCPA/CPRA, including the right to know and
          the right to delete; we do not sell or share personal information for
          cross-context behavioural advertising.
        </p>
        <p>
          To exercise any of these rights, email <MailLink /> from the address on
          your account. We respond within 30 days and will never charge you or
          degrade your service for making a request.
        </p>
      </Section>

      <Section title="7. Cookies and local storage">
        <p>
          WeShare uses cookies and browser local storage for essential purposes
          only: keeping you signed in, remembering your session and recent search
          preferences, and security checks performed by Firebase and Stripe. We do
          not use advertising or cross-site tracking cookies. Clearing this
          storage will sign you out.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          Data is encrypted in transit with TLS and at rest by our cloud
          providers. Database access is restricted by security rules so users can
          only read the records that relate to them. No system is perfectly
          secure, so please use a strong, unique password and tell us immediately
          if you suspect unauthorised access.
        </p>
      </Section>

      <Section title="9. Children">
        <p>
          WeShare is not intended for anyone under 18. We do not knowingly collect
          data from children. If you believe a minor has created an account,
          contact us and we will remove it.
        </p>
      </Section>

      <Section title="10. Changes to this policy">
        <p>
          We may update this policy as the service evolves. We will change the
          &quot;last updated&quot; date above and, for material changes, notify
          you in the app or by email before they take effect.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          WeShare Ride, Los Angeles, California, United States.
          <br />
          <MailLink />
        </p>
      </Section>
    </div>
  );
}
