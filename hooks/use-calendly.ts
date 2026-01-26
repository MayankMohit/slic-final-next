'use client';

import { useCallback } from "react";

const CALENDLY_URL = "https://calendly.com/mayankmohitagarwal7/30min";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export const useCalendly = () => {
  const openCalendly = useCallback(() => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      // Fallback: open in new tab if widget not loaded
      window.open(CALENDLY_URL, "_blank");
    }
  }, []);

  return { openCalendly, calendlyUrl: CALENDLY_URL };
};
