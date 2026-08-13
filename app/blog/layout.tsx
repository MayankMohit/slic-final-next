import { SanityLive } from "@/lib/sanity.live";

/**
 * SanityLive opens a live-content subscription, so it only belongs on the
 * routes that actually read from Sanity. Mounting it in the root layout put
 * that client component on all 13 routes, including the fully static marketing
 * pages that never call sanityFetch.
 */
export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <SanityLive />
    </>
  );
}
