import type { JoinApplication } from "./join-schema";

/**
 * Renders the "new application" notification email.
 *
 * Email clients are not browsers: no flexbox/grid, no external CSS, no custom
 * fonts, and Outlook renders through Word. So this is table-based markup with
 * fully inline styles, sized to 600px, using system fonts. The palette is
 * lifted from app/globals.css (the oklch tokens converted to hex, since no
 * mail client supports oklch) so it reads as the same brand as the site.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://slic.agency";

// Site design tokens, converted to hex for mail-client support.
const C = {
  page: "#070b12", // --background
  card: "#0f1520", // --card, lifted slightly for separation
  panel: "#141b28", // --secondary
  border: "#1f2937", // --border, lifted for visibility on dark
  primary: "#3b82f6", // --primary (already hex in globals.css)
  primaryDeep: "#2563eb",
  accent: "#00aba3", // --accent
  text: "#f8f8f8", // --foreground
  muted: "#9aa3b4", // --muted-foreground, lifted for email legibility
  faint: "#6d7277", // --muted-foreground as authored
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimestamp(date: Date) {
  // The team is India-based; show local time rather than the server's UTC.
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/** A label/value row in the details table. */
function detailRow(label: string, valueHtml: string, isLast = false) {
  const border = isLast ? "none" : `1px solid ${C.border}`;
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:${border};font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.faint};white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
      <td style="padding:14px 0 14px 16px;border-bottom:${border};font-family:${FONT};font-size:15px;font-weight:600;color:${C.text};vertical-align:top;word-break:break-word;">${valueHtml}</td>
    </tr>`;
}

/** Small rounded chip, used for role and experience. */
function chip(text: string, accent: boolean) {
  const bg = accent ? "rgba(59,130,246,0.16)" : "rgba(0,171,163,0.14)";
  const fg = accent ? C.primary : C.accent;
  const bd = accent ? "rgba(59,130,246,0.35)" : "rgba(0,171,163,0.32)";
  return `<span style="display:inline-block;padding:6px 14px;margin:0 6px 6px 0;border:1px solid ${bd};border-radius:999px;background:${bg};font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${fg};">${escapeHtml(text)}</span>`;
}

export function buildJoinEmail(data: JoinApplication, now = new Date()) {
  const { name, email, phone, role, experience, portfolio, message } = data;

  const subject = `New application — ${name} · ${role}`;

  // Shown as the preview line in the inbox list, before the body is opened.
  const preheader = `${role} · ${experience}${phone ? ` · ${phone}` : ""}`;

  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    `Re: your application to SLIC — ${role}`,
  )}`;

  const portfolioHtml = portfolio
    ? `<a href="${escapeHtml(portfolio)}" style="color:${C.primary};text-decoration:none;border-bottom:1px solid rgba(59,130,246,0.4);">${escapeHtml(portfolio)}</a>`
    : `<span style="color:${C.faint};font-weight:500;">Not provided</span>`;

  const phoneHtml = phone
    ? `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:${C.text};text-decoration:none;">${escapeHtml(phone)}</a>`
    : `<span style="color:${C.faint};font-weight:500;">Not provided</span>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.page};">
  <!-- Inbox preview line, hidden in the rendered body -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

          <!-- Brand bar -->
          <tr>
            <td style="padding:0 4px 20px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:${FONT};font-size:20px;font-weight:700;letter-spacing:0.18em;color:${C.text};">SLIC</td>
                  <td align="right" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};">Careers</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td bgcolor="${C.card}" style="background-color:${C.card};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">

              <!-- Gradient hairline, mirrors the site's primary gradient -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="3" bgcolor="${C.primary}" style="height:3px;line-height:3px;font-size:0;background-color:${C.primary};background-image:linear-gradient(90deg,${C.primary},${C.accent});">&nbsp;</td>
                </tr>
              </table>

              <!-- Heading -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:32px 32px 0 32px;">
                    <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${C.primary};margin-bottom:10px;">New Application</div>
                    <div style="font-family:${FONT};font-size:28px;line-height:1.2;font-weight:700;color:${C.text};margin-bottom:16px;">${escapeHtml(name)}</div>
                    <div>${chip(role, true)}${chip(experience, false)}</div>
                  </td>
                </tr>

                <!-- Details -->
                <tr>
                  <td style="padding:24px 32px 0 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.border};">
                      ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${C.primary};text-decoration:none;border-bottom:1px solid rgba(59,130,246,0.4);">${escapeHtml(email)}</a>`)}
                      ${detailRow("Phone", phoneHtml)}
                      ${detailRow("Portfolio", portfolioHtml, true)}
                    </table>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding:28px 32px 0 32px;">
                    <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.faint};margin-bottom:12px;">Why they want to join</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.panel}" style="background-color:${C.panel};border-radius:12px;border-left:3px solid ${C.primary};">
                      <tr>
                        <td style="padding:18px 20px;font-family:${FONT};font-size:14px;line-height:1.65;color:${C.muted};white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Reply button -->
                <tr>
                  <td style="padding:28px 32px 32px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="${C.primary}" style="background-color:${C.primary};background-image:linear-gradient(135deg,${C.primary},${C.primaryDeep});border-radius:10px;">
                          <a href="${replyHref}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;text-decoration:none;">Reply to ${escapeHtml(name.split(" ")[0] || name)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 4px 0 4px;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.faint};">
              Submitted ${escapeHtml(formatTimestamp(now))} IST via
              <a href="${SITE_URL}/join" style="color:${C.faint};text-decoration:underline;">${SITE_URL.replace(/^https?:\/\//, "")}/join</a><br>
              Reply directly to this email to reach the applicant.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Plain-text alternative. Sending multipart materially improves inbox
  // placement — HTML-only mail scores worse with most spam filters.
  const text = [
    `NEW APPLICATION — ${name}`,
    "",
    `Role:        ${role}`,
    `Experience:  ${experience}`,
    `Email:       ${email}`,
    `Phone:       ${phone || "Not provided"}`,
    `Portfolio:   ${portfolio || "Not provided"}`,
    "",
    "WHY THEY WANT TO JOIN",
    message,
    "",
    "---",
    `Submitted ${formatTimestamp(now)} IST via ${SITE_URL}/join`,
    "Reply directly to this email to reach the applicant.",
  ].join("\n");

  return { subject, html, text };
}
