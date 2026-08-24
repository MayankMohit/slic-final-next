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
 *
 * The three colours are the loading state.
 *
 * Nothing is painted behind the frame, so between the request starting and
 * Calendly's first paint the iframe is its default white — a full-height white
 * slab flashing into the middle of a near-black page. A skeleton underneath is
 * the usual fix, but that is what was removed here: Calendly draws its own
 * surface, so anything behind it showed through as a second box around the
 * widget. Handing Calendly the page's own colours means the frame is dark from
 * its first frame, which removes the flash instead of covering it.
 *
 * Hex without the leading #, which is the format their parameters take. The
 * values are app/globals.css's --background, --foreground and --brand,
 * converted out of oklch the same way lib/join-email.ts converts them, because
 * a URL parameter cannot carry a CSS variable.
 *
 * Worth knowing: Calendly only honours these on its paid tiers. On the free
 * plan they are ignored rather than rejected, so the embed still works and the
 * white flash simply stays — which is the same behaviour as before this, not a
 * regression.
 */
const EMBED_PARAMS = [
  `embed_domain=${SITE_HOST}`,
  "embed_type=Inline",
  "background_color=070b12",
  "text_color=f8f8f8",
  "primary_color=6e23db",
].join("&");

const embedUrl = CALENDLY_URL
  ? `${CALENDLY_URL}${CALENDLY_URL.includes("?") ? "&" : "?"}${EMBED_PARAMS}`
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
                  The spinner sits BEHIND the frame, not in place of it.

                  The skeleton that used to be here was a sibling that had to
                  be hidden once the widget arrived, and being a card in its
                  own right it showed through as a second box around Calendly.
                  This is the opposite arrangement: one layer, underneath, that
                  the widget covers by simply painting over it. An iframe
                  renders nothing until its document arrives, so the spinner is
                  visible through it for exactly as long as there is nothing to
                  see, and is occluded the moment there is.

                  No state, no onLoad, no client boundary. The page stays a
                  Server Component, and the spinner works with JavaScript off.

                  If the frame never loads at all - a blocked third party, an
                  extension, a corporate proxy - this does keep spinning. That
                  case is what the "Calendar not loading?" link below is for.
                */}
                <div className="relative h-[78vh] min-h-[640px] max-h-[900px] w-full overflow-hidden rounded-xl">
                  {/*
                    aria-hidden because it stays in the DOM after the widget
                    covers it. Without it a screen reader would keep offering
                    "Loading the calendar" long after the calendar had loaded;
                    the iframe's own title is the accessible name that matters.
                  */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-brand-alt" />
                    <p className="text-xs text-foreground/40">
                      Loading the calendar
                    </p>
                  </div>

                  {/*
                    `relative` with no z-index is enough to put the frame over
                    the spinner: both are positioned, so document order decides,
                    and the iframe comes second.
                  */}
                  <iframe
                    src={embedUrl}
                    title="Book a strategy call with SLIC"
                    // Eager is the default, but the whole point of this page is
                    // that the request starts now — worth stating so nobody
                    // "optimises" it to lazy later.
                    loading="eager"
                    className="relative h-full w-full border-0"
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
