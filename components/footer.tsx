"use client";

import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { useCalendly } from "@/hooks/use-calendly";
import { createLucideIcon } from "lucide-react";

const footerLinks = {
  explore: [
    { name: "Our Work", href: "/work" },
    { name: "Case Studies", href: "/case-studies" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
  ],
  support: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const XIcon = createLucideIcon("CustomXIcon", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
      key: "x-path",
    },
  ],
]);

const socialLinks = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/slic-media/",
    label: "LinkedIn",
  },
  {
    icon: XIcon,
    href: "https://x.com/slic_media",
    label: "CustomXIcon",
  },
];

export function Footer() {
  const { openCalendly } = useCalendly();

  return (
    <footer className="md:rounded-t-6xl relative w-full mx-auto flex flex-col md:items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/18%),theme(backgroundColor.black/68%))]  lg:pt-8">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />
      <div className="md:px-[10vw] md:pb-8 pt-8 pb-3 md:text-[0.8vw] ml-10 md:ml-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 md:max-w-[25vw] space-y-4">
            <Link href="/" className="flex items-center gap-1">
              <img
                src="/icons/sm_logo.png"
                alt="Logo"
                className="md:h-[2.5vh] h-[3.5vh] w-auto"
              />
            </Link>

            <p className="text-muted-foreground text-xs md:text-[0.8vw] mb-[1vw] md:max-w-[40vw] max-w-[80vw] font-semibold">
              Performance video ads for DTC brands scaling on Facebook, TikTok,
              and YouTube. Research-driven creative that lowers CPA and improves
              ROAS.
            </p>

            <div className="flex gap-4 mt-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Work */}
          <div className=" ">
            <h4 className="font-sans font-bold text-foreground mb-[1vw]">
              Work
            </h4>
            <ul className="space-y-[0.8vw]">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground/80 hover:text-primary transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="">
            <h4 className="font-sans font-bold text-foreground mb-[1vw]">
              Company
            </h4>
            <ul className="space-y-[0.8vw]">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground/80 hover:text-primary transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="">
            <h4 className="font-sans font-bold text-foreground mb-[1vw]">
              Get Started
            </h4>

            {/* Subtle CTA Button */}
            <button
              onClick={openCalendly}
              className=" md:px-[1.4vw] md:pt-[0.7vw] md:pb-[0.8vw] p-3 rounded-sm border border-border hover:bg-white/10 text-muted-foreground transition-all duration-200 inline-flex md:text-[0.8vw] font-bold uppercase hover:text-white"
            >
              Book A Strategy Call
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 md:pt-4 mr-8 md:mr-0 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-[0.8vw] text-muted-foreground font-semibold">
          <p>
            &copy; {new Date().getFullYear()} SLIC. All rights reserved.
          </p>
          <div className="flex gap-10">
            {footerLinks.support.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
