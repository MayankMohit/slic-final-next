"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-isMobile";
import { motion } from "framer-motion";

export default function MobileBackground() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ willChange: "transform" }}
        animate={{ x: ["-3%", "3%", "-3%"] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/bg/mobile-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>
    </div>
  );
}
