import { createHash } from "node:crypto";
import type { JoinApplication } from "./join-schema";
import { SITE_URL } from "./site";

/**
 * Renders the "new application" notification email.
 *
 * Email clients are not browsers: no flexbox/grid, no external CSS, no custom
 * fonts, and Outlook renders through Word. So this is table-based markup with
 * fully inline styles, sized to 600px, using system fonts. The palette is
 * lifted from app/globals.css (the oklch tokens converted to hex, since no
 * mail client supports oklch) so it reads as the same brand as the site.
 *
 * Server-only: it imports node:crypto and is reached from app/api/join/route.ts
 * alone. Do not import it into a Client Component.
 */

// Site design tokens, converted to hex for mail-client support.
//
// Three colours carry the whole layout, the same rule the site follows: purple
// for anything that means something, white for the name, grey for everything
// else. The teal that used to sit on the accent bar and on two of the pills
// came from --accent, a leftover shadcn default that nothing on slic.agency
// uses, so the email was the only surface showing a colour the brand does not
// have.
const C = {
  page: "#070b12", // --background
  card: "#0f1520", // --card, lifted slightly for separation
  panel: "#141b28", // --secondary
  border: "#1f2937", // --border, lifted for visibility on dark
  // --brand / --primary. A FILL colour: button grounds, rules, left borders,
  // and the one solid pill. At 2.80:1 on this page ground it fails WCAG AA for
  // text, which is why primaryText exists rather than this being used for both.
  primary: "#6e23db",
  primaryEdge: "rgba(145,121,255,0.35)", // --brand-alt at low alpha, chip borders
  // --brand-alt. The same hue two steps lighter, 6.11:1 on the page ground.
  // Every brand-coloured word in this email uses this, per the fill/text split
  // documented in app/globals.css.
  primaryText: "#9179ff",
  primaryTextRule: "rgba(145,121,255,0.4)", // underlines beneath primaryText links
  text: "#f8f8f8", // --foreground
  muted: "#9aa3b4", // --muted-foreground, lifted for email legibility
  faint: "#6d7277", // --muted-foreground as authored
};

// The site's button gradient, read off slic.agency rather than re-derived.
const BUTTON_GRADIENT =
  "linear-gradient(325deg,#6e23db 0%,#9179ff 55%,#6e23db 90%)";

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

/**
 * "siddhartha aryan" to "Siddhartha Aryan", and "SIDDHARTHA ARYAN" likewise.
 *
 * Done here rather than with CSS text-transform for two reasons: text-transform
 * cannot reach the subject line, which is where a lowercase name is most
 * visible, and `capitalize` would render "O'brien" and "Mary-jane" because it
 * only touches the first letter of a whitespace-delimited word. Capitalising
 * after apostrophes and hyphens as well fixes both of those.
 *
 * The word-by-word pass exists because lower-casing everything first, which is
 * what makes the all-caps case work, would otherwise destroy the names that
 * carry a capital in the middle: McCarthy, MacLeod, DeVito. Those arrive
 * already correct and there is no rule that can rebuild them once flattened, so
 * a word that is already mixed case is taken as deliberate and left alone.
 *
 * What it cannot do is invent case that was never typed. "mccarthy" in, and
 * "Mccarthy" out, because nothing in the input distinguishes it from "mcadam"
 * spelled by someone who does not capitalise. Same for particles: "van der
 * berg" becomes "Van Der Berg". Both need a name database rather than a rule,
 * and both only affect people who typed their own name in lower case.
 */
function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      /[a-z]/.test(word) && /[A-Z]/.test(word)
        ? word
        : word
            .toLowerCase()
            .replace(
              /(^|['-])([a-z])/g,
              (_match, separator: string, char: string) =>
                separator + char.toUpperCase(),
            ),
    )
    .join(" ");
}

/**
 * "0-1 years" to "0 to 1 years".
 *
 * The schema stores the hyphenated form because that is what the select on
 * /join renders. Spelling it out matches how every other range on the site
 * reads ("48 to 72 hours", "4 to 6 concepts") and keeps a stray dash out of an
 * email whose brief was largely about removing them.
 */
function spellRange(value: string) {
  return value.replace(/(\d)\s*-\s*(\d)/g, "$1 to $2");
}

/**
 * Label for a portfolio link: protocol dropped, leading www dropped, trailing
 * slash dropped, truncated past 45 characters. The full URL still goes in the
 * href, so shortening the label loses nothing.
 */
function linkLabel(url: string, max = 45) {
  const trimmed = url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

/**
 * A short, stable reference for one application, so it can be named in a
 * conversation and so two applications from the same person stay distinct.
 *
 * There is no applications table to take a row ID from, because the form sends
 * mail and keeps nothing, so it is derived from the submission itself. The
 * property that matters is determinism: the same submission yields the same ID
 * forever, and it can be recomputed later from the email if the thread is lost.
 *
 * Five base32 characters is roughly 33 million values, which stays
 * collision-free well past any volume this form will see, and it is short
 * enough to read aloud. I, O and U are folded out because they are the
 * characters people misread when retyping a code.
 */
function applicationId(seed: string) {
  const digest = createHash("sha256").update(seed).digest("hex").slice(0, 12);
  const code = parseInt(digest, 16)
    .toString(32)
    .toUpperCase()
    .replace(/[IOU]/g, "X")
    .slice(-5)
    .padStart(5, "0");
  return `#A-${code}`;
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
function detailRow(label: string, valueHtml: string, breakAll = false) {
  // break-all rather than break-word for the two fields that can hold a single
  // unbroken 60-character token. break-word will not split inside a "word", so
  // a long address or URL pushes the table past 600px and takes the layout
  // with it.
  const wrap = breakAll ? "break-all" : "break-word";
  return `
    <tr>
      <td style="padding:9px 0;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.faint};white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
      <td style="padding:9px 0 9px 16px;font-family:${FONT};font-size:15px;font-weight:600;color:${C.text};vertical-align:top;word-break:${wrap};">${valueHtml}</td>
    </tr>`;
}

/**
 * The three pills, ranked by how much each one drives a decision.
 *
 * Role is the field you filter on, so it is the only solid fill and the only
 * one readable at a glance while scrolling an inbox. Experience is a secondary
 * signal, so it is outlined in brand colour. Availability is context rather
 * than a decision input, so it is grey. Previously all three looked roughly
 * equal, which meant none of them did any work.
 */
function pill(text: string, rank: "primary" | "secondary" | "tertiary") {
  const style = {
    primary: `background-color:${C.primary};border:1px solid ${C.primary};border-radius:999px;color:#ffffff;`,
    secondary: `border:1px solid ${C.primaryEdge};border-radius:6px;color:${C.primaryText};`,
    tertiary: `border:1px solid ${C.border};border-radius:6px;color:${C.muted};`,
  }[rank];
  return `<span style="display:inline-block;padding:7px 15px;margin:0 8px 8px 0;${style}font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">${escapeHtml(text)}</span>`;
}

export function buildJoinEmail(data: JoinApplication, now = new Date()) {
  const { email, phone, role, availability, portfolio, message } = data;

  const name = titleCase(data.name);
  const firstName = name.split(" ")[0] || name;
  const experience = spellRange(data.experience);

  // Plain punctuation. The previous subject used an em dash and a middle dot,
  // the two characters that most reliably read as machine-generated, and it
  // printed the name exactly as it was typed.
  const subject = `New application: ${name}, ${role}`;

  // The grey line Gmail shows next to the subject in the inbox list. Left
  // unset it fills with whatever text happens to come first in the body, so
  // this was free triage space being thrown away. Everything needed to decide
  // whether to open the mail now fits in it.
  const preheader = `${role} · ${experience} · ${availability} · portfolio attached`;

  const id = applicationId(
    `${data.name}|${email}|${role}|${now.toISOString()}`,
  );
  const submittedAt = formatTimestamp(now);

  const replyHref = `mailto:${escapeHtml(email)}?subject=${encodeURIComponent(
    `Your SLIC application ${role}`,
  )}`;

  const phoneRow = phone
    ? detailRow(
        "Phone",
        `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:${C.text};text-decoration:none;">${escapeHtml(phone)}</a>`,
      )
    : // The field is optional on the form. A row rendered with nothing beside
      // it reads as a bug, so it comes out entirely.
      "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(subject)}</title>
<style>
  /* Outlook ignores this block wholesale, which is why nothing in it is load
     bearing. It only handles the narrow viewport, in the clients that do
     support media queries, which is every mobile client that matters. */
  @media only screen and (max-width:620px) {
    .shell { width:100% !important; }
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .stack { display:block !important; width:100% !important; }
    .stack-gap { padding:0 0 12px 0 !important; }
    .btn { display:block !important; text-align:center !important; }
    .name { font-size:26px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${C.page};">
  <!-- Inbox preview line, hidden in the rendered body -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">${escapeHtml(preheader)}</div>
  <!-- Filler that stops Gmail appending body text to the preview above -->
  <div style="display:none;max-height:0;overflow:hidden;">${"&#847;&zwnj;&nbsp;".repeat(60)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="shell" style="width:100%;max-width:600px;">

          <!-- Brand bar -->
          <tr>
            <td style="padding:0 4px 18px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:${FONT};font-size:20px;font-weight:700;letter-spacing:0.18em;color:${C.text};">SLIC<span style="color:${C.primaryText};">.</span></td>
                  <td align="right" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};">Careers</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td bgcolor="${C.card}" style="background-color:${C.card};border:1px solid ${C.border};border-radius:16px;">

              <!-- Accent bar. Outlook drops the gradient and keeps the bgcolor. -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="3" bgcolor="${C.primary}" style="height:3px;line-height:3px;font-size:0;background-color:${C.primary};background-image:${BUTTON_GRADIENT};">&nbsp;</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Heading -->
                <tr>
                  <td class="pad" style="padding:30px 32px 0 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${C.primaryText};">New Application</td>
                        <td align="right" style="font-family:${FONT};font-size:12px;color:${C.faint};white-space:nowrap;">${escapeHtml(submittedAt)}</td>
                      </tr>
                    </table>
                    <div class="name" style="font-family:${FONT};font-size:30px;line-height:1.2;font-weight:700;color:${C.text};padding:10px 0 18px 0;">${escapeHtml(name)}</div>
                    <div>${pill(role, "primary")}${pill(experience, "secondary")}${pill(availability, "tertiary")}</div>
                  </td>
                </tr>

                <!-- Details -->
                <tr>
                  <td class="pad" style="padding:22px 32px 0 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.border};">
                      <tr><td colspan="2" height="10" style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr>
                      ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${C.primaryText};text-decoration:none;border-bottom:1px solid ${C.primaryTextRule};">${escapeHtml(email)}</a>`, true)}
                      ${phoneRow}
                      ${detailRow("Portfolio", `<a href="${escapeHtml(portfolio)}" style="color:${C.primaryText};text-decoration:none;border-bottom:1px solid ${C.primaryTextRule};">${escapeHtml(linkLabel(portfolio))}</a>`, true)}
                    </table>
                  </td>
                </tr>

                <!-- Pitch -->
                <tr>
                  <td class="pad" style="padding:26px 32px 0 32px;">
                    <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.faint};padding-bottom:12px;">An ad they&#39;d have made better</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.panel}" style="background-color:${C.panel};border-radius:12px;border-left:3px solid ${C.primary};">
                      <tr>
                        <td style="padding:18px 22px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.muted};white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Actions. The reel is the application for an editor or a
                     motion designer, so opening it is a button, not a text
                     link buried in the rows above. -->
                <tr>
                  <td class="pad" style="padding:26px 32px 32px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td class="stack stack-gap" align="left" valign="top" style="padding:0 12px 0 0;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="stack">
                            <tr>
                              <td bgcolor="${C.primary}" class="stack" style="background-color:${C.primary};background-image:${BUTTON_GRADIENT};border-radius:8px;">
                                <a href="${replyHref}" class="btn" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">Reply to ${escapeHtml(firstName)}</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="stack" align="left" valign="top" style="padding:0;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="stack">
                            <tr>
                              <td class="stack" style="border:1px solid ${C.border};border-radius:8px;">
                                <a href="${escapeHtml(portfolio)}" class="btn" style="display:inline-block;padding:14px 29px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.text};text-decoration:none;">Open portfolio</a>
                              </td>
                            </tr>
                          </table>
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
            <td style="padding:18px 4px 0 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:${FONT};font-size:11px;color:${C.faint};">
                    Submitted via <a href="${SITE_URL}/join" style="color:${C.muted};text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}/join</a>
                  </td>
                  <td align="right" style="font-family:${FONT};font-size:11px;color:${C.faint};white-space:nowrap;">Application ${escapeHtml(id)}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Plain-text alternative. Sending multipart materially improves inbox
  // placement, because HTML-only mail scores worse with most spam filters.
  const text = [
    `NEW APPLICATION: ${name}`,
    "",
    `Role:         ${role}`,
    `Experience:   ${experience}`,
    `Availability: ${availability}`,
    `Email:        ${email}`,
    ...(phone ? [`Phone:        ${phone}`] : []),
    `Portfolio:    ${portfolio}`,
    "",
    "AN AD THEY'D HAVE MADE BETTER",
    message,
    "",
    "---",
    `Submitted ${submittedAt} IST via ${SITE_URL}/join`,
    `Application ${id}`,
  ].join("\n");

  return { subject, html, text, applicationId: id };
}
