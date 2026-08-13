import { NextResponse } from "next/server";
import { joinApplicationSchema } from "@/lib/join-schema";
import { buildJoinEmail } from "@/lib/join-email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Sending mail costs Resend quota and floods the careers inbox, so cap how
// often one client can submit. Generous enough that a person correcting a
// typo and resubmitting never notices.
const LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const throttle = rateLimit(`join:${clientIp(request)}`, LIMIT);
  if (!throttle.ok) {
    return NextResponse.json(
      { error: "Too many applications from this connection. Please try again later." },
      { status: 429, headers: { "Retry-After": String(throttle.retryAfterSeconds) } },
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
      { error: "Applications are temporarily unavailable. Please email us directly." },
      { status: 503 },
    );
  }

  const { subject, html, text } = buildJoinEmail(parsed.data);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.JOIN_FROM_EMAIL || "SLIC Careers <onboarding@resend.dev>",
      to: [process.env.JOIN_NOTIFY_EMAIL || "mayankmohitagarwal7@gmail.com"],
      reply_to: parsed.data.email,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    console.error("Resend error:", response.status, await response.text());
    return NextResponse.json(
      { error: "Could not send your application. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
