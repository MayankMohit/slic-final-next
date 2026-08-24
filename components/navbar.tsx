"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavButton from "@/components/ui/navButton";

const navLinks = [
  { name: "Work", href: "/work" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Join Us", href: "/join" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /*
      A plain header, not motion.header, and no useIsMobile.

      This component used to open with `if (isMobile === null) return null`.
      useIsMobile only resolves inside an effect, so on the server it is always
      null and the entire header - the logo, all five nav links and the booking
      CTA - was absent from the rendered HTML of every page. The site's primary
      navigation existed only for clients that ran JavaScript, which on an
      SEO-driven site is the wrong half of the audience to serve it to.

      The guard was buying one thing: isMobile decided whether the bar carries
      a solid background. That is a media query, so it is now expressed as one.
      Below md the bar is always solid; from md up it is transparent until
      isScrolled flips, which is genuine client state and degrades to "solid"
      rather than "missing".

      The entrance animation moved to CSS for the same reason. Framer Motion's
      `initial={{ y: -100 }}` is serialised into the server HTML as an inline
      transform and only cleared on hydration, so a header that did render
      would still have been parked above the viewport until the bundle
      arrived. See .animate-nav-in in app/globals.css.

      border-b is always applied and only its colour changes, so scrolling past
      the threshold does not add a pixel of height and shift the page under it.
    */
    <header
      className={`animate-nav-in fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 bg-background/80 backdrop-blur-xl border-border/50 ${
        isScrolled
          ? ""
          : "md:bg-transparent md:backdrop-blur-none md:border-transparent"
      }`}
    >
      <nav className="container-tight flex items-center justify-between h-16 md:h-[7.5vh]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/icons/sm_logo.png"
            alt="SLIC logo"
            width={120}
            height={32}
            className="h-[2.5vh] w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[2.8vw]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[1vw] font-semibold transition-colors hover:text-brand-alt ${
                pathname === link.href ? "text-brand-alt" : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <NavButton href="/book" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container-tight py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-md font-semibold py-2 transition-colors hover:text-brand-alt ml-4 ${
                    pathname === link.href
                      ? "text-brand-alt"
                      : "text-foreground/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* asChild so this is a real anchor: the mobile CTA is the same
                  destination as the desktop one and should behave like a link,
                  not a button that happens to navigate. */}
              <Button asChild className="bg-gradient-primary w-full text-md">
                <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                  Book A Call
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
