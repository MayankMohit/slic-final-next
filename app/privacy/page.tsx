import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "SLIC Privacy Policy. Learn how we collect, use, and protect your personal information when you visit slic.agency or use our services.",
  alternates: {
    canonical: "https://slic.agency/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        <section className="section-padding">
          <div className="container-tight max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last Updated: March 2026
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-10 text-muted-foreground leading-relaxed">

                {/* Introduction */}
                <section>
                  <p>
                    SLIC ("we," "us," or "our") is committed to protecting your
                    privacy. This Privacy Policy explains how we collect, use,
                    and safeguard your information when you visit slic.agency or
                    engage our services.
                  </p>
                  <p>
                    By using our website or services, you agree to this Privacy
                    Policy.
                  </p>
                </section>

                {/* Information We Collect */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Information We Collect
                  </h2>

                  <h3 className="font-semibold text-foreground mb-2">
                    Information You Provide
                  </h3>
                  <p>
                    When you contact us, book a call, or work with us, we may collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and email address</li>
                    <li>Company name and website</li>
                    <li>Project details and brand assets</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h3 className="font-semibold text-foreground mt-6 mb-2">
                    Information Collected Automatically
                  </h3>
                  <p>
                    When you visit our website, we may collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring URLs</li>
                    <li>Device information</li>
                  </ul>

                  <p className="mt-4">
                    We use cookies and similar technologies to improve your
                    experience and analyze website traffic.
                  </p>
                </section>

                {/* How We Use Info */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    How We Use Your Information
                  </h2>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respond to inquiries and deliver our services</li>
                    <li>Send relevant communications (with your consent)</li>
                    <li>Improve our website and user experience</li>
                    <li>Protect against fraud and unauthorized access</li>
                  </ul>
                  <p className="mt-4">
                    We do not sell or rent your personal information to third
                    parties.
                  </p>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Cookies
                  </h2>
                  <p>Our website uses cookies to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Remember your preferences</li>
                    <li>Analyze website traffic</li>
                    <li>Improve our services</li>
                  </ul>
                  <p className="mt-4">
                    You can control cookies through your browser settings.
                    Disabling certain cookies may affect website functionality.
                  </p>
                </section>

                {/* Data Sharing */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Data Sharing
                  </h2>
                  <p>
                    We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Service providers who help operate our website and services</li>
                    <li>Legal authorities when required by law</li>
                    <li>Business transfers or acquisitions</li>
                  </ul>
                  <p className="mt-4">
                    We do not share your information with third parties for
                    marketing purposes.
                  </p>
                </section>

                {/* Data Security */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Data Security
                  </h2>
                  <p>
                    We implement appropriate security measures to protect your
                    information. However, no method of transmission over the
                    internet is completely secure.
                  </p>
                </section>

                {/* Rights */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Your Rights
                  </h2>
                  <p>
                    Depending on your location, you may have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, contact us at{" "}
                    <a
                      href="mailto:hello@slic.agency"
                      className="text-primary hover:underline"
                    >
                      hello@slic.agency
                    </a>
                    .
                  </p>
                </section>

                {/* International Transfers */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    International Transfers
                  </h2>
                  <p>
                    Our services are operated from India. By using our services,
                    you consent to the transfer of your information to countries
                    that may have different data protection laws.
                  </p>
                </section>

                {/* Third Party */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Third-Party Links
                  </h2>
                  <p>
                    Our website may contain links to third-party websites. We
                    are not responsible for their privacy practices.
                  </p>
                </section>

                {/* Children */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Children's Privacy
                  </h2>
                  <p>
                    Our services are not directed to individuals under 18. We do
                    not knowingly collect information from children.
                  </p>
                </section>

                {/* Changes */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Changes to This Policy
                  </h2>
                  <p>
                    We may update this Privacy Policy from time to time. Changes
                    will be posted on this page with an updated date.
                  </p>
                </section>

                {/* Contact */}
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    Contact Us
                  </h2>
                  <p>
                    Questions about this Privacy Policy? Contact us at{" "}
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