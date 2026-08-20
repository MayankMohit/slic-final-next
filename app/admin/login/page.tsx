import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Someone arriving with a live session has no business seeing a login form.
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-[0.18em] text-foreground">SLIC</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-foreground/40">
            Blog admin
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/2 p-6 backdrop-blur-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-foreground/35">
          Sessions last 7 days on this device.
        </p>
      </div>
    </main>
  );
}
