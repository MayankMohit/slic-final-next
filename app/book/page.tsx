import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE_HOST, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book A Strategy Call",
  description:
    "Book a 30-minute strategy call with SLIC. We'll look at your current creative, your numbers, and where performance video could move them.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book A Strategy Call | SLIC",
    description:
      "A 30-minute call about your creative, your numbers, and what performance video could do for them.",
    url: absoluteUrl("/book"),
  },
};

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

/**
 * The scheduling URL as Calendly's own widget script builds it.
 *
 * `embed_type=Inline` drops Calendly's page chrome so only the picker renders,
 * and `embed_domain` is what their analytics attributes the booking to. These
 * are the same two parameters assets.calendly.com/widget.js appends — building
 * them here means the iframe is in the served HTML and starts fetching while
 * the parser is still working, instead of waiting for a third-party script to
 * download, execute, and inject it.
 */
const embedUrl = CALENDLY_URL
  ? `${CALENDLY_URL}${CALENDLY_URL.includes("?") ? "&" : "?"}embed_domain=${SITE_HOST}&embed_type=Inline`
  : null;

export default function BookPage() {
  return (
    <main className="min-h-screen font-sans">
      <Navbar />

      <div className="pt-20">
        <section className="section-padding">
          <div className="container-tight">
            <div className="text-center mb-8 md:mb-10">
              <span className="tag">Book A Call</span>
              <h1 className="heading">
                Let&apos;s talk about your{" "}
                <span className="text-brand-alt">creative</span>
              </h1>
              <p className="desc max-w-2xl mx-auto">
                Thirty minutes. We&apos;ll go through what you&apos;re running
                now, what your numbers look like, and where performance video
                could move them. No pitch deck.
              </p>
            </div>

            {embedUrl ? (
              <>
                {/*
                  Nothing is painted behind the frame. Calendly renders its
                  own surface, so a bordered card and a skeleton underneath
                  it only showed through as a second box around the widget.
                  This div is now purely the sizing box the iframe fills.
                */}
                <div className="h-[78vh] min-h-[640px] max-h-[900px] w-full overflow-hidden rounded-xl">
                  <iframe
                    src={embedUrl}
                    title="Book a strategy call with SLIC"
                    // Eager is the default, but the whole point of this page is
                    // that the request starts now — worth stating so nobody
                    // "optimises" it to lazy later.
                    loading="eager"
                    className="h-full w-full border-0"
                  />
                </div>

                {/*
                  Covers every way the frame can fail — a blocked third-party
                  frame, an extension, a corporate proxy — without needing to
                  detect any of them. It is a plain link, so it works with
                  JavaScript off.
                */}
                <p className="mt-4 text-center text-xs text-foreground/45">
                  Calendar not loading?{" "}
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-alt underline underline-offset-2 hover:text-brand-alt/80"
                  >
                    Open the booking page directly
                  </a>
                  .
                </p>
              </>
            ) : (
              /*
                NEXT_PUBLIC_CALENDLY_URL is unset. An empty framed box would
                read as a broken page on the one route whose entire job is
                converting, so fall back to the address we do have.
              */
              <div className="mx-auto max-w-lg rounded-xl border border-border/50 bg-card/60 p-8 text-center">
                <p className="desc mb-4">
                  Our booking calendar is temporarily unavailable. Email us and
                  we&apos;ll get a time in the diary.
                </p>
                <a
                  href="mailto:hello@slic.agency?subject=Strategy%20call"
                  className="text-brand-alt underline underline-offset-2 hover:text-brand-alt/80"
                >
                  hello@slic.agency
                </a>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
