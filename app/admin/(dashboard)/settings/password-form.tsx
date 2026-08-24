"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { changePasswordAction, type PasswordState } from "../../actions";

// The shared field skin from app/globals.css, the same one /join uses. The
// string that was here focused with ring-primary, which is --brand at 2.80:1
// against this ground and effectively invisible as a focus indicator, and sat
// at 14px, below the size at which iOS Safari stops zooming the viewport on
// focus. .field fixes both and carries the select chevron and hover state too.
const inputClasses = "field";

const labelClasses =
  "block mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/70";

// Mirrors MIN_PASSWORD_LENGTH in lib/auth.ts, which is the real check.
const MIN_LENGTH = 12;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Update password
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<PasswordState, FormData>(
    changePasswordAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) return;
    toast.success("Password changed. Other devices have been signed out.");
    // Clear the fields so the new password is not left sitting in the DOM.
    formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="current" className={labelClasses}>
          Current password
        </label>
        <input
          id="current"
          name="current"
          type="password"
          required
          autoComplete="current-password"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="next" className={labelClasses}>
          New password
        </label>
        <input
          id="next"
          name="next"
          type="password"
          required
          minLength={MIN_LENGTH}
          autoComplete="new-password"
          className={inputClasses}
        />
        <p className="mt-1.5 text-xs text-foreground/45">
          At least {MIN_LENGTH} characters.
        </p>
      </div>

      <div>
        <label htmlFor="confirm" className={labelClasses}>
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={MIN_LENGTH}
          autoComplete="new-password"
          className={inputClasses}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-xs text-red-400">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="flex items-center gap-1.5 text-xs text-primary">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Password updated.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
