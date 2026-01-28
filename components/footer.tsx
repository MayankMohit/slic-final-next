"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
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
    icon: Instagram,
    href: "https://www.instagram.com/slic.media/",
    label: "Instagram",
  },
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
    <footer className="relative bg-black/70 border-t border-border/50 backdrop-blur-sm">
      <div className="px-[10vw] py-8 text-[0.8vw]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 max-w-[25vw] space-y-4">
            <Link href="/" className="flex items-center gap-1">
          <img
            src="/icons/sm_logo.png"
            alt="Logo"
            className="h-[3vh] w-auto"
          />
        </Link>

            <p className="text-muted-foreground text-[0.8vw] mb-[1vw] max-w-[40vw]">
              Performance video ads for DTC brands scaling on Facebook, TikTok,
              and YouTube. Research-driven creative that lowers CPA and improves
              ROAS.
            </p>

            <div className="flex gap-4">
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
            <h4 className="font-display font-semibold text-foreground mb-[1vw]">
              Work
            </h4>
            <ul className="space-y-[0.8vw]">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className=" ">
            <h4 className="font-display font-semibold text-foreground mb-[1vw]">
              Company
            </h4>
            <ul className="space-y-[0.8vw]">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    window.location.href = "/?scroll=faqs";
                  }}
                  className="text-muted-foreground/80 hover:text-primary transition-colors"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="">
            <h4 className="font-display font-semibold text-foreground mb-[1vw]">
              Contact
            </h4>

            <ul className="space-y-[0.8vw] mb-3">
              <li className="flex items-start gap-[0.8vw] text-muted-foreground/80">
                <Mail className="w-4 h-4 mt-[0.4vw] shrink-0" />
                <a
                  href="mailto:slicmedia.business@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  slicmedia.business@gmail.com
                </a>
              </li>
            </ul>

            {/* Subtle CTA Button */}
            <button
              onClick={openCalendly}
              className=" px-[1.5vw] py-[1vw] rounded-sm border border-border hover:bg-white/10 text-muted-foreground transition-all duration-200 inline-flex text-[0.8vw] font-bold uppercase hover:text-white"
            >
              Book A Strategy Call
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-4 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.8vw] text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SLIC Media. All rights reserved.
          </p>
          <div className="flex gap-6">
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
