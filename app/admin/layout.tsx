import type { Metadata } from "next";

/**
 * Wraps both the login page and the dashboard.
 *
 * There is no auth check here on purpose: /admin/login lives inside this
 * segment too, and guarding at this level would redirect the login page to
 * itself. The guard sits one level down, in (dashboard)/layout.tsx.
 */
/**
 * Every admin route is rendered per request, never prerendered.
 *
 * Without this the build evaluated the guard in (dashboard)/layout.tsx once, at
 * build time, where there is no cookie — and cached the resulting redirect as a
 * static 307. /admin/new shipped as a permanent bounce to /admin/login even for
 * a signed-in editor. The redirect() throw short-circuits the render before
 * Next notices the cookies() call, so the usual "reading cookies opts you into
 * dynamic" inference never fires and it has to be stated outright.
 *
 * It sits on this layout rather than the inner one so /admin/login is covered
 * too: that page redirects an already-authenticated visitor to /admin, which is
 * the same trap in reverse.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | SLIC Admin",
  },
  // Belt and braces alongside the fact that every admin page is behind a
  // cookie: nothing here should ever surface in search or in a crawler cache.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-background/80">{children}</div>;
}
