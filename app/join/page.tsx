import type { Metadata } from "next";
import { JoinPageContent } from "./join-content";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Join SLIC — a performance creative agency producing video ads for DTC brands. We're looking for editors, strategists, and creatives who care about results.",
  alternates: {
    canonical: "/join",
  },
  openGraph: {
    title: "Join SLIC | Careers at a Performance Creative Agency",
    description:
      "Work on performance video ads for DTC brands scaling on Meta, TikTok, and YouTube. Tell us about yourself and let's talk.",
    url: "https://slic.agency/join",
  },
};

export default function JoinPage() {
  return <JoinPageContent />;
}
