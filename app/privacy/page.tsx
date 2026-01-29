import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "SLIC Media's Privacy Policy - Learn how we collect, use, and protect your personal information.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: {currentDate}
              </p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-8 text-muted-foreground leading-relaxed">
                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    1. Information We Collect
                  </h2>
                  <p>
                    At SLIC Media, we collect information you provide directly
                    to us, such as when you fill out a contact form, schedule a
                    consultation, or communicate with us via email. This may
                    include your name, email address, phone number, company
                    name, and any other information you choose to provide.
                  </p>
                  <p>
                    We also automatically collect certain information when you
                    visit our website, including your IP address, browser type,
                    operating system, referring URLs, and information about how
                    you interact with our website.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>
                      Respond to your inquiries and provide customer service
                    </li>
                    <li>
                      Send you marketing communications (with your consent)
                    </li>
                    <li>Improve our website and services</li>
                    <li>Analyze usage patterns and trends</li>
                    <li>Protect against fraud and unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    3. Information Sharing
                  </h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties without your consent, except as
                    necessary to provide our services, comply with the law, or
                    protect our rights. We may share information with trusted
                    third-party service providers who assist us in operating our
                    website and conducting our business.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    4. Data Security
                  </h2>
                  <p>
                    We implement appropriate technical and organizational
                    measures to protect the security of your personal
                    information. However, please note that no method of
                    transmission over the Internet or electronic storage is 100%
                    secure.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    5. Your Rights
                  </h2>
                  <p>
                    Depending on your location, you may have certain rights
                    regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>The right to access your personal information</li>
                    <li>The right to correct inaccurate information</li>
                    <li>The right to delete your personal information</li>
                    <li>The right to opt-out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    6. Cookies
                  </h2>
                  <p>
                    Our website uses cookies to enhance your browsing
                    experience. You can set your browser to refuse all or some
                    cookies, or to alert you when cookies are being sent. If you
                    disable cookies, some parts of our website may not function
                    properly.
                  </p>
                </section>

                <section>
                  <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                    7. Contact Us
                  </h2>
                  <p>
                    If you have any questions about this Privacy Policy, please
                    contact us at{" "}
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
