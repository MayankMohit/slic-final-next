"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "../actions";

function SubmitButton() {
  // useFormStatus reads the enclosing form's pending state, which is why this
  // is a child component rather than a branch inside LoginForm.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Sign in
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-foreground/70"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-xs text-red-400">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
