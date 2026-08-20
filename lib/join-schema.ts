import { z } from "zod";

// Listed in pipeline order — research feeds the script, the script feeds the
// edit, the edit feeds the test — because the Open Roles cards on /join are
// numbered 01-04 off this array and read as that sequence.
export const JOIN_ROLES = [
  "Creative Researcher",
  "Scriptwriter",
  "Video Editor",
  "Creative Strategist",
] as const;

export const JOIN_EXPERIENCE_LEVELS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
] as const;

export const JOIN_AVAILABILITY = [
  "Full-time",
  "Part-time",
  "Project-based",
] as const;

// z.string().url() only checks that `new URL()` parses, which happily accepts
// javascript:, data: and vbscript: URLs. The portfolio link is rendered as a
// clickable anchor in the notification email, so restrict it to real web URLs.
const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

// Control characters in a value that reaches an email header (the subject line
// is built from `name`) are the classic header-injection vector. Built via the
// RegExp constructor so the source file stays pure ASCII.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001f\\u007f]");
const noControlChars = (value: string) => !CONTROL_CHARS.test(value);

export const joinApplicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100)
    .refine(noControlChars, "Please enter a valid name"),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(noControlChars, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  role: z.enum(JOIN_ROLES, { message: "Please pick a role" }),
  experience: z.enum(JOIN_EXPERIENCE_LEVELS, {
    message: "Please pick your experience level",
  }),
  availability: z.enum(JOIN_AVAILABILITY, {
    message: "Please pick your availability",
  }),
  // Required, not optional: the page leads with "portfolio first, everything
  // else second", and an application with no work to look at cannot be read.
  portfolio: z
    .string()
    .trim()
    .min(1, "Please add a link to your portfolio or reel")
    .max(300)
    .refine(isHttpUrl, "Please enter a valid link (https://...)"),
  // The "pick an ad you'd have made better" answer.
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more — a few lines is enough")
    .max(3000),
  // Honeypot — real users never see or fill this field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type JoinApplication = z.infer<typeof joinApplicationSchema>;
