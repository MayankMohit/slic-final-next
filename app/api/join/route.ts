import { NextResponse } from "next/server";
import { joinApplicationSchema } from "@/lib/join-schema";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
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

  const { name, email, phone, role, experience, portfolio, message } = parsed.data;

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Role", role],
    ["Experience", experience],
    ["Portfolio", portfolio || "—"],
  ];

  const html = `
    <h2>New application to join SLIC</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:bold;border:1px solid #ddd">${label}</td><td style="border:1px solid #ddd">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <h3>Message</h3>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.JOIN_FROM_EMAIL || "SLIC Careers <onboarding@resend.dev>",
      to: [process.env.JOIN_NOTIFY_EMAIL || "mayankmohitagarwal7@gmail.com"],
      reply_to: email,
      subject: `Join application — ${name} (${role})`,
      html,
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
