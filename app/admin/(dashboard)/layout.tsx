import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "../actions";

/**
 * The auth gate for everything under /admin except the login page.
 *
 * A layout is the right place for the redirect because it runs on the server
 * before any child page renders, so no post data is ever fetched for an
 * unauthenticated request. It is not the *only* place: every server action and
 * the upload route assert for themselves, since a layout guard protects the
 * page render and nothing else.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-baseline gap-3">
          <Link
            href="/admin"
            className="text-lg font-bold tracking-[0.18em] text-foreground"
          >
            SLIC
          </Link>
          <span className="text-xs uppercase tracking-[0.16em] text-foreground/40">
            Blog admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-white/30 hover:text-foreground"
          >
            View blog
          </Link>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            New post
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="grid h-[34px] w-[34px] place-items-center rounded-lg border border-white/15 text-foreground/60 transition-colors hover:border-white/30 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
}
