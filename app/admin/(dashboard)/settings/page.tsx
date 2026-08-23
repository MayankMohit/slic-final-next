import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { hasStoredPassword } from "@/lib/auth";
import { PasswordForm } from "./password-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  // False means the bootstrap ADMIN_PASSWORD_HASH is still in force, which is
  // worth saying out loud: that value sits in the environment where a developer
  // can read it, and only changing the password here retires it.
  const usingStoredPassword = await hasStoredPassword();

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </Link>

      <div className="max-w-md">
        <div className="mb-6 flex items-center gap-2.5">
          <KeyRound className="h-4 w-4 text-primary" />
          <h1 className="text-base font-semibold text-foreground">Change password</h1>
        </div>

        {!usingStoredPassword && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-relaxed text-foreground/70">
            You are still signed in with the password set up during
            installation, which is stored in the site&apos;s environment
            configuration. Changing it here moves it into the database, where
            only you can change it again.
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/2 p-5">
          <PasswordForm />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-foreground/40">
          Changing the password signs out every other device immediately. You
          will stay signed in here.
        </p>
      </div>
    </>
  );
}
