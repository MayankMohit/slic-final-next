'use client';

import { useCallback } from "react";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL!;

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
      window.open(CALENDLY_URL, "_blank");
    }
  }, []);

  return { openCalendly, calendlyUrl: CALENDLY_URL };
};
