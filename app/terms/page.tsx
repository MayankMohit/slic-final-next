import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "SLIC Media's Terms of Service - Review the terms and conditions for using our video content creation services.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        <section className="section-padding">
          <div className="container-tight max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: {currentDate}
              </p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-8 text-muted-foreground leading-relaxed">
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    1. Agreement to Terms
                  </h2>
                  <p>
                    By accessing or using SLIC Media&apos;s website and
                    services, you agree to be bound by these Terms of Service
                    and all applicable laws and regulations. If you do not agree
                    with any of these terms, you are prohibited from using or
                    accessing our services.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    2. Services
                  </h2>
                  <p>
                    SLIC Media provides video content creation, editing, and
                    marketing services. Our services include but are not limited
                    to video production, ad creative development, social media
                    content, and brand storytelling. The specific scope of
                    services will be outlined in individual project agreements.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    3. Intellectual Property
                  </h2>
                  <p>Unless otherwise agreed in writing:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>
                      All content created by SLIC Media remains our intellectual
                      property until full payment is received
                    </li>
                    <li>
                      Upon full payment, clients receive a license to use the
                      deliverables for the agreed purposes
                    </li>
                    <li>
                      We reserve the right to use completed work in our
                      portfolio and marketing materials
                    </li>
                    <li>
                      Client-provided materials remain the property of the
                      client
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    4. Payment Terms
                  </h2>
                  <p>
                    Payment terms will be specified in individual project
                    proposals or contracts. Generally, we require a deposit
                    before work begins, with the balance due upon project
                    completion or according to an agreed milestone schedule.
                    Late payments may incur additional fees.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    5. Revisions and Approvals
                  </h2>
                  <p>
                    Our project proposals include a specified number of revision
                    rounds. Additional revisions beyond the agreed scope may
                    incur additional charges. Client approval is required at key
                    project milestones, and delays in providing feedback may
                    affect project timelines.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    6. Confidentiality
                  </h2>
                  <p>
                    We maintain strict confidentiality regarding client
                    information, strategies, and materials. We will not disclose
                    confidential information to third parties without your
                    consent, except as required by law.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    7. Limitation of Liability
                  </h2>
                  <p>
                    SLIC Media shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages arising out of
                    or related to your use of our services. Our total liability
                    shall not exceed the amount paid for the specific services
                    giving rise to the claim.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    8. Termination
                  </h2>
                  <p>
                    Either party may terminate a project with written notice. In
                    the event of termination, the client is responsible for
                    payment of all work completed up to the termination date.
                    Any deposits paid are non-refundable unless otherwise
                    agreed.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    9. Changes to Terms
                  </h2>
                  <p>
                    We reserve the right to modify these terms at any time. We
                    will notify clients of any material changes. Your continued
                    use of our services after such modifications constitutes
                    acceptance of the updated terms.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    10. Contact Us
                  </h2>
                  <p>
                    If you have any questions about these Terms of Service,
                    please contact us at{" "}
                    <a
                      href="mailto:hello@slicmedia.com"
                      className="text-primary hover:underline"
                    >
                      hello@slicmedia.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
