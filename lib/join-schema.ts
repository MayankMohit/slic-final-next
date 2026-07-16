import { z } from "zod";

export const JOIN_ROLES = [
  "Video Editor",
  "Motion Designer",
  "Creative Strategist",
  "Copywriter",
  "Performance Marketer",
  "Other",
] as const;

export const JOIN_EXPERIENCE_LEVELS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
] as const;

export const joinApplicationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  role: z.enum(JOIN_ROLES, { message: "Please pick a role" }),
  experience: z.enum(JOIN_EXPERIENCE_LEVELS, {
    message: "Please pick your experience level",
  }),
  portfolio: z
    .string()
    .trim()
    .url("Please enter a valid link (https://...)")
    .max(300)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more — at least a couple of sentences")
    .max(3000),
  // Honeypot — real users never see or fill this field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type JoinApplication = z.infer<typeof joinApplicationSchema>;
