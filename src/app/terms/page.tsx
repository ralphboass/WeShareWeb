import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of WeShare Ride, the student ride-sharing marketplace in Los Angeles, including pricing, payments, cancellations and liability.",
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
        Last updated {LAST_UPDATED}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        These terms are an agreement between you and WeShare Ride
        (&quot;WeShare&quot;), based in Los Angeles, California. They apply to the
        weshare-ride.com website and the WeShare Ride iOS app. By creating an
        account, posting a ride or booking a seat, you accept these terms. If you
        do not agree, please do not use WeShare.
      </p>

      <Section title="1. Eligibility">
        <p>
          You must be at least 18 years old to use WeShare. The service is built
          for students in the Los Angeles area; signing up with a university
          (.edu) email adds a verified-student badge to your profile, but a
          student email is not required. You must provide accurate information,
          keep one account only, and keep your login credentials confidential.
        </p>
      </Section>

      <Section title="2. WeShare is a marketplace, not a carrier">
        <p>
          WeShare is a technology platform that connects drivers who have empty
          seats on a trip they were already making with passengers travelling the
          same way. WeShare{" "}
          <strong className="text-ink">
            is not a transportation carrier, taxi service, charter or broker
          </strong>
          , does not own or operate vehicles, and does not employ drivers. Drivers
          are independent individuals who decide their own routes, times and
          whether to accept a request. Any transport arrangement is between the
          driver and the passenger.
        </p>
      </Section>

      <Section title="3. Driver obligations">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Hold a valid, unrestricted driver&apos;s licence and be legally
            permitted to drive in California.
          </li>
          <li>
            Maintain at least the minimum auto insurance required by California
            law, covering the vehicle you use for the trip.
          </li>
          <li>
            Use a registered, roadworthy vehicle with current registration, valid
            smog compliance where applicable, and working seat belts for every
            passenger.
          </li>
          <li>
            Never drive under the influence of alcohol, drugs or medication that
            impairs driving; never drive while fatigued or distracted.
          </li>
          <li>
            Only carry the number of passengers your vehicle is legally rated for,
            and only the passengers whose requests you have accepted.
          </li>
          <li>
            Do not use WeShare to operate a commercial transportation business or
            to profit from driving. Seat prices must reflect cost sharing.
          </li>
        </ul>
      </Section>

      <Section title="4. Passenger conduct">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Be at the agreed pickup point on time and wear your seat belt for the
            whole trip.
          </li>
          <li>
            Treat the driver, the vehicle and other passengers with respect. No
            smoking, vaping, alcohol or illegal substances without the
            driver&apos;s explicit agreement.
          </li>
          <li>
            You are responsible for any damage you cause to the vehicle and for
            your own belongings.
          </li>
          <li>
            Bring only luggage the driver has agreed to; pets and oversized items
            need prior approval.
          </li>
        </ul>
      </Section>

      <Section title="5. Pricing and the service fee">
        <p>
          Drivers set a price per seat. That price must be limited to sharing the
          real costs of the trip — fuel, tolls, parking and wear — and must not be
          set to generate profit. WeShare may reject or cap listings whose pricing
          looks commercial.
        </p>
        <p>
          Passengers pay the seat price multiplied by the number of seats booked,
          plus a <strong className="text-ink">5% WeShare service fee</strong>{" "}
          shown before you confirm. The service fee covers payment processing,
          support and operating the platform, and is non-refundable once a ride has
          been completed.
        </p>
      </Section>

      <Section title="6. Payment authorization and capture">
        <p>
          Payments are handled by Stripe. When you request a seat, your card is{" "}
          <strong className="text-ink">authorized</strong> for the total amount — a
          hold, not a charge. The amount is{" "}
          <strong className="text-ink">
            captured only after the ride has been completed
          </strong>
          . If the driver declines your request, the ride is cancelled, or the trip
          does not take place, the authorization is released and no charge is made;
          your bank may take a few business days to show the release.
        </p>
        <p>
          Drivers receive their earnings through Stripe payouts to the bank account
          connected to their Stripe account after the trip is completed, less the
          platform, processing and transaction fees disclosed in the app. Drivers
          are solely responsible for reporting and paying any taxes on amounts they
          receive.
        </p>
      </Section>

      <Section title="7. Cancellations and the 2-hour cutoff">
        <p>
          Both sides can cancel free of charge up to{" "}
          <strong className="text-ink">
            2 hours before the scheduled departure
          </strong>
          . Within that 2-hour window a booking can no longer be cancelled
          online, because the other party is already planning around the trip —
          message them directly and contact <MailLink /> if there is an emergency.
          If a driver cancels, every affected passenger has their authorization
          released in full.
        </p>
      </Section>

      <Section title="8. No-shows">
        <p>
          If a passenger does not arrive at the agreed pickup point, the driver
          should wait a reasonable time and then report a no-show; the trip may be
          charged in full. If a driver does not show up, report it and the
          passenger&apos;s authorization is released. Repeated no-shows may lead to
          suspension.
        </p>
      </Section>

      <Section title="9. Ratings and reviews">
        <p>
          After a completed trip, drivers and passengers can rate each other.
          Ratings must be honest, first-hand and free of harassment, personal data
          or discriminatory content. We may remove reviews that break these rules
          and may suspend accounts whose rating falls persistently low.
        </p>
      </Section>

      <Section title="10. Prohibited use">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Transporting anything illegal, hazardous, or forbidden by law, and
            using WeShare for any unlawful purpose.
          </li>
          <li>
            Harassment, threats, discrimination, hate speech or sexual conduct of
            any kind.
          </li>
          <li>
            Arranging payment outside the platform to avoid fees, or creating fake
            rides, accounts, requests or reviews.
          </li>
          <li>
            Scraping, reverse engineering, overloading or otherwise interfering
            with the service, or bypassing its security.
          </li>
          <li>
            Commercial passenger transport, courier or delivery services, and
            advertising unrelated products to other users.
          </li>
        </ul>
        <p>
          We may suspend or terminate any account that breaks these terms, with or
          without notice where necessary to protect users.
        </p>
      </Section>

      <Section title="11. Disclaimers and limitation of liability">
        <p>
          WeShare is provided &quot;as is&quot; and &quot;as available&quot;. We do
          not screen, background-check or endorse users beyond the limited
          verification described in the app, and we do not guarantee that a ride
          will happen, that a driver or passenger will behave appropriately, or
          that any listing is accurate. You use WeShare and travel with other users
          at your own risk.
        </p>
        <p>
          To the maximum extent permitted by law, WeShare is not liable for
          indirect, incidental, special, consequential or punitive damages, or for
          loss of profits, data, injury or property damage arising from a trip
          arranged through the platform. Our total aggregate liability to you for
          any claim is limited to the greater of the WeShare service fees you paid
          in the twelve months before the claim, or USD 100. Nothing here limits
          liability that cannot be limited under California law.
        </p>
      </Section>

      <Section title="12. Indemnity">
        <p>
          You agree to indemnify and hold WeShare harmless from claims, damages,
          losses and reasonable legal costs arising from your use of the service,
          your breach of these terms, or your interactions with other users.
        </p>
      </Section>

      <Section title="13. Changes to the service and these terms">
        <p>
          We may modify or discontinue features at any time, and we may update
          these terms. Material changes will be announced in the app or by email
          before they take effect. Continuing to use WeShare after the effective
          date means you accept the updated terms.
        </p>
      </Section>

      <Section title="14. Governing law and disputes">
        <p>
          These terms are governed by the laws of the State of California,
          excluding its conflict-of-law rules. You and WeShare agree to the
          exclusive jurisdiction of the state and federal courts located in Los
          Angeles County, California. Before filing anything, please email us —
          almost every dispute is resolved faster that way.
        </p>
      </Section>

      <Section title="15. Contact">
        <p>
          WeShare Ride, Los Angeles, California, United States.
          <br />
          <MailLink />
        </p>
      </Section>
    </div>
  );
}
