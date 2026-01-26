'use client';

import React from "react"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useCalendly } from "@/hooks/use-calendly";

const footerLinks = {
  explore: [
    { name: "Our Work", href: "/work" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blog", href: "/blog" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "FAQs", href: "/#faqs", isAnchor: true },
    { name: "Contact", href: "#", isCalendly: true },
  ],
  support: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/slic.media/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/slic-media/", label: "LinkedIn" },
];

export function Footer() {
  const { openCalendly } = useCalendly();
  const router = useRouter();

  const handleLinkClick = (link: { name: string; href: string; isAnchor?: boolean; isCalendly?: boolean }, e: React.MouseEvent) => {
    if (link.isCalendly) {
      e.preventDefault();
      openCalendly();
    } else if (link.isAnchor) {
      e.preventDefault();
      router.push('/');
      setTimeout(() => {
        const faqSection = document.getElementById('faqs');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="relative bg-black/70 border-t border-border/50 backdrop-blur-sm">
      <div className="container-tight py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-1 font-display text-xl font-bold mb-4">
              <span className="text-foreground">SLIC</span>
              <span className="text-gradient">Media</span>
            </Link>

            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              We create high-converting video content that scales brands.
              Trusted by DTC founders and global companies worldwide.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground/80 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.isCalendly ? (
                    <button
                      type="button"
                      onClick={(e) => handleLinkClick(link, e)}
                      className="text-muted-foreground/80 hover:text-primary text-sm transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(link, e)}
                      className="text-muted-foreground/80 hover:text-primary text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground/80">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="mailto:slicmedia.business@gmail.com" className="hover:text-primary transition-colors">
                  slicmedia.business@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground/80">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="tel:+919876540451" className="hover:text-primary transition-colors">
                  +91 9876540451
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Tower B, Oberoi Sky City, Borivali - E</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SLIC Media. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.support.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
