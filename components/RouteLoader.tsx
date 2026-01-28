"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

let externalTrigger: (() => void) | null = null;

export function triggerLoader() {
  if (externalTrigger) externalTrigger();
}

export default function RouteLoader() {
  const [active, setActive] = useState(true);
    const [showLogo, setShowLogo] = useState(true);
    const [hideCircle, setHideCircle] = useState(false);


  useEffect(() => {
    externalTrigger = () => {
      setActive(true);
      setShowLogo(true);

      // Remove logo when expansion finishes
      setTimeout(() => {
        setShowLogo(false);
      }, 3000);

      // Hide loader
      setTimeout(() => {
        setActive(false);
      }, 4000);
    };

    // First load
    setTimeout(() => {
      setShowLogo(false);
    }, 3000);

    setTimeout(() => {
      setActive(false);
    }, 4000);
  }, []);

    
    useEffect(() => {
  if (!showLogo) {
    const timer = setTimeout(() => {
      setHideCircle(true);
    }, 700);

    return () => clearTimeout(timer);
  } else {
    setHideCircle(false);
  }
}, [showLogo]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-999 flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        showLogo ? "bg-black" : "bg-transparent"
      }`}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <div className="relative flex items-center justify-center">
        {showLogo && (
          <Image
            src="/icons/sm_blue_logo.png"
            alt="Slic Media"
            width={660}
            height={240}
            className="object-contain"
          />
        )}

        <motion.div
          key={active ? "run" : "idle"}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: [1, 1.3, 1, 1.3, 1, 90, 0],
            opacity: [1, 1, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration: 3.5,
            times: [0, 0.18, 0.28, 0.45, 0.55, 0.85, 1],
            ease: [
              [0.3, 0.0, 0.1, 1.0],
              [0.4, 0.0, 0.2, 1.0],
              [0.3, 0.0, 0.1, 1.0],
              [0.4, 0.0, 0.2, 1.0],
              [0.76, 0, 0.24, 1],
              [0.4, 0.0, 0.2, 1.0],
            ],
          }}
          className={`right-0 bottom-0 w-16 h-16 bg-[#3394cd] rounded-full ${
            hideCircle ? "hidden" : "absolute"
          }`}
        />
      </div>
    </motion.div>
  );
}
