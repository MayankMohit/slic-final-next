import { NextResponse } from "next/server";
import { joinApplicationSchema } from "@/lib/join-schema";
import { buildJoinEmail } from "@/lib/join-email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Sending mail costs Resend quota and floods the careers inbox, so cap how
// often one client can submit. Generous enough that a person correcting a
// typo and resubmitting never notices.
const LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

/**
 * Resend's shared sandbox domain. Every free-tier account sends from it, so its
 * reputation belongs to all of them and none of them: Gmail is increasingly
 * hostile to shared sending domains, and applications start landing in spam
 * with nothing to tell you it is happening. It is also visibly a third-party
 * test address to anyone who checks the sender.
 *
 * It survives here only as the fallback below, never as the intended sender.
 */
const SANDBOX_FROM = "SLIC Careers <onboarding@resend.dev>";

/**
 * Requires slic.agency to be verified in Resend with SPF, DKIM and a DMARC
 * record. Until that is done this address is rejected and the fallback fires.
 */
const FROM =
  process.env.JOIN_FROM_EMAIL || "SLIC Careers <careers@slic.agency>";

/**
 * Where a reply from the careers inbox goes.
 *
 * Deliberately the shared inbox rather than the applicant: the email now has a
 * prefilled "Reply to <name>" button for writing to the candidate, so plain
 * Reply is free to mean "discuss this internally" instead. hello@ is used
 * because it is the address the site actually publishes, in the footer, the
 * privacy policy and the Organization schema.
 */
const REPLY_TO = process.env.JOIN_REPLY_TO || "hello@slic.agency";

type Mail = { subject: string; html: string; text: string };

async function sendViaResend(
  apiKey: string,
  from: string,
  to: string,
  mail: Mail,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: REPLY_TO,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }),
  });
  return { response, body: response.ok ? "" : await response.text() };
}

export async function POST(request: Request) {
  const throttle = rateLimit(`join:${clientIp(request)}`, LIMIT);
  if (!throttle.ok) {
    return NextResponse.json(
      {
        error:
          "Too many applications from this connection. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(throttle.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = joinApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // Bots that filled the honeypot get a fake success and no email.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — join application not sent");
    return NextResponse.json(
      {
        error:
          "Applications are temporarily unavailable. Please email us directly.",
      },
      { status: 503 },
    );
  }

  const to = process.env.JOIN_NOTIFY_EMAIL || "mayankmohitagarwal7@gmail.com";
  const { subject, html, text, applicationId } = buildJoinEmail(parsed.data);

  let { response, body: errorBody } = await sendViaResend(apiKey, FROM, to, {
    subject,
    html,
    text,
  });

  // Resend answers 403 when the from-domain is not verified on the account.
  // Retrying on the sandbox rather than surfacing the error is the deliberate
  // choice: this endpoint is the only way a job application reaches anyone, and
  // losing one to a DNS record that has not propagated yet is worse than
  // sending it from a shared domain. The log line is the signal that the domain
  // still needs finishing — it should stop appearing once it does.
  if (response.status === 403 && FROM !== SANDBOX_FROM) {
    console.error(
      `Resend rejected "${FROM}" (403) — verify slic.agency in Resend. Falling back to the sandbox sender.`,
      errorBody,
    );
    ({ response, body: errorBody } = await sendViaResend(
      apiKey,
      SANDBOX_FROM,
      to,
      {
        subject,
        html,
        text,
      },
    ));
  }

  if (!response.ok) {
    console.error("Resend error:", response.status, errorBody);
    return NextResponse.json(
      { error: "Could not send your application. Please try again later." },
      { status: 502 },
    );
  }

  // No PII, just the reference. It means an application can still be traced
  // through the logs if the mail itself is lost or filed somewhere odd.
  console.log(`Join application sent: ${applicationId} (${parsed.data.role})`);

  return NextResponse.json({ ok: true });
}
