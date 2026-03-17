import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | SLIC",
  description:
    "SLIC Terms of Service. Review the terms governing use of slic.agency and our performance creative services.",
  alternates: {
    canonical: "https://slic.agency/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        <section className="section-padding">
          <div className="container-tight max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last Updated: March 2026
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-10 text-muted-foreground leading-relaxed">

                {/* Agreement */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Agreement to Terms
                  </h2>
                  <p>
                    These Terms of Service ("Terms") govern your use of slic.agency and our creative services. By accessing our website or engaging our services, you agree to these Terms.
                  </p>
                </section>

                {/* Services */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Our Services
                  </h2>
                  <p>
                    SLIC provides performance creative services for DTC brands, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Creative research and strategy</li>
                    <li>Video ad scripting</li>
                    <li>Video editing and production</li>
                    <li>Creative testing frameworks</li>
                  </ul>
                  <p className="mt-4">
                    Specific deliverables, timelines, and pricing are outlined in individual service agreements.
                  </p>
                </section>

                {/* Client Responsibilities */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Client Responsibilities
                  </h2>
                  <p>
                    When working with us, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate information about your brand and needs</li>
                    <li>Supply necessary assets and materials on time</li>
                    <li>Review and provide feedback within agreed timelines</li>
                    <li>Ensure you have rights to materials you provide</li>
                    <li>Pay invoices according to agreed terms</li>
                  </ul>
                  <p className="mt-4">
                    Delays in providing materials or feedback may impact project timelines.
                  </p>
                </section>

                {/* IP */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Intellectual Property
                  </h2>

                  <h3 className="font-semibold text-foreground mb-2">
                    Your Content
                  </h3>
                  <p>
                    You retain ownership of all materials you provide to us. You grant us a limited license to use your content solely to deliver our services.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6 mb-2">
                    Our Deliverables
                  </h3>
                  <p>
                    Upon full payment, you own the final deliverables we create for you.
                  </p>
                  <p>
                    We retain the right to showcase completed work in our portfolio and marketing materials unless you request otherwise in writing.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6 mb-2">
                    Our Methods
                  </h3>
                  <p>
                    Our proprietary processes, frameworks, and tools remain our intellectual property.
                  </p>
                </section>

                {/* Payment */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Payment Terms
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Invoices are due within the timeframe specified in your agreement</li>
                    <li>Late payments may incur additional fees</li>
                    <li>We may pause work on accounts with overdue payments</li>
                    <li>Fees are non-refundable unless otherwise specified</li>
                  </ul>
                </section>

                {/* Confidentiality */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Confidentiality
                  </h2>
                  <p>
                    We treat all client information as confidential. We will not disclose your information to third parties without consent, except as required by law.
                  </p>
                  <p>
                    You agree to keep confidential any proprietary information about our processes and methods.
                  </p>
                </section>

                {/* Liability */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Limitation of Liability
                  </h2>

                  <h3 className="font-semibold text-foreground mb-2">
                    Results
                  </h3>
                  <p>
                    We apply our expertise to create high-performing video ads, but we cannot guarantee specific business outcomes including ROAS, CPA, or revenue. Ad performance depends on many factors outside our control.
                  </p>
                  <p>
                    Case studies on our website represent actual results but are not guarantees of future performance.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6 mb-2">
                    Liability Cap
                  </h3>
                  <p>
                    Our total liability for any claims shall not exceed the fees you paid us in the six months preceding the claim.
                  </p>
                  <p>
                    We are not liable for indirect, incidental, special, or consequential damages.
                  </p>
                </section>

                {/* Indemnification */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Indemnification
                  </h2>
                  <p>You agree to indemnify SLIC from claims arising from:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Your breach of these Terms</li>
                    <li>Your violation of third-party rights</li>
                    <li>Materials you provide that infringe intellectual property</li>
                    <li>Claims related to your products or services</li>
                  </ul>
                </section>

                {/* Termination */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Termination
                  </h2>
                  <p>
                    You may terminate services by providing written notice as specified in your agreement.
                  </p>
                  <p>
                    We may terminate if you breach these Terms, fail to pay invoices, or engage in harmful conduct.
                  </p>
                  <p>
                    Upon termination, you remain responsible for payment of completed work.
                  </p>
                </section>

                {/* Disputes */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Dispute Resolution
                  </h2>
                  <p>
                    Disputes shall be resolved through good faith negotiation, then mediation if necessary. These Terms are governed by the laws of India with proceedings in Mumbai, India.
                  </p>
                </section>

                {/* Website Use */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Website Use
                  </h2>
                  <p>
                    When using our website, you agree not to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violate any laws or regulations</li>
                    <li>Infringe intellectual property</li>
                    <li>Transmit malicious code</li>
                    <li>Attempt unauthorized access</li>
                  </ul>
                  <p className="mt-4">
                    Our website is provided "as is" without warranties.
                  </p>
                </section>

                {/* Changes */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Changes to Terms
                  </h2>
                  <p>
                    We may update these Terms from time to time. Continued use of our website or services after changes constitutes acceptance.
                  </p>
                </section>

                {/* Contact */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Contact Us
                  </h2>
                  <p>
                    Questions about these Terms? Contact us:{" "}
                    <a
                      href="mailto:hello@slic.agency"
                      className="text-primary hover:underline"
                    >
                      hello@slic.agency
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