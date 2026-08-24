import type { StaticImageData } from "next/image";

import blackbox from "@/public/brandLogos/blackbox.png";
import lokt from "@/public/brandLogos/lokt.png";
import loop from "@/public/brandLogos/loop.png";
import maybelline from "@/public/brandLogos/maybelline.png";
import nb from "@/public/brandLogos/nb.png";
import nexa from "@/public/brandLogos/nexa.png";
import unscrptd from "@/public/brandLogos/unscrptd.png";

/**
 * The client logos, imported rather than referenced by path.
 *
 * A static import gives next/image the file's real width and height at build
 * time. Passing the string path instead means the component has to be told
 * those numbers by hand, and the numbers that were there did not match the
 * files: every logo declared `height={50}` against a width chosen to look
 * right, so blackbox.png was described as 230x50 when it is 4151x899.
 *
 * That is not only a console warning. The browser uses the declared width and
 * height to reserve space before the bytes arrive, so a wrong ratio reserves a
 * box of the wrong height and the row jumps when the image lands. Reading the
 * dimensions from the file makes that impossible to get wrong, and impossible
 * to break later by swapping a logo for one of a different shape.
 *
 * Display size stays where it was, as CSS on the element, because it differs
 * per surface: the marquee and the case study cards render the same file at
 * different widths.
 */
export const BRAND_LOGOS = {
  "blackbox.png": blackbox,
  "lokt.png": lokt,
  "loop.png": loop,
  "maybelline.png": maybelline,
  "nb.png": nb,
  "nexa.png": nexa,
  "unscrptd.png": unscrptd,
} satisfies Record<string, StaticImageData>;

/** Keys of BRAND_LOGOS, so a typo in a data array fails the build. */
export type BrandLogoFile = keyof typeof BRAND_LOGOS;

// Matches MOBILE_BREAKPOINT in hooks/use-isMobile.ts, which is Tailwind's md.
const MOBILE_BREAKPOINT = 768;

/**
 * Props for rendering one logo, given the width it occupies on screen.
 *
 * No width or height is passed. The static import already carries the file's
 * real dimensions, and stating them by hand was the original bug: every logo
 * declared `height={50}` against a width chosen to look right, so blackbox.png
 * was described as 230x50 when the file is 4151x899. That is not only a console
 * warning — the browser reserves space from the declared ratio before the bytes
 * arrive, so a wrong ratio reserves a box of the wrong height and the row jumps
 * when the image lands.
 *
 * Deriving the height from the file instead is not sufficient either, which is
 * the subtle part. next/image compares the declared height against the rendered
 * one as integers, and a rendered height is rarely a whole number: blackbox at
 * 230px wide computes to 49.81, so whichever way that is rounded it can
 * disagree with the declared value and the warning returns for that one logo.
 * Leaving the intrinsic dimensions in place sidesteps the comparison entirely,
 * because then both axes differ from the rendered size and next/image reads
 * that as a deliberate CSS resize, which it is.
 *
 * `sizes` is what keeps the download small once the intrinsic width is what is
 * declared. Without it next/image builds its srcset as roughly
 * [width, width * 2], so the intrinsic 1168 of unscrptd.png would ask the
 * optimizer for a 3840px-wide render of a logo occupying 200px. With it, the
 * srcset is the full candidate list and the browser picks against these
 * hints instead.
 */
export function brandLogo(
  file: BrandLogoFile,
  width: number,
  mobileWidth: number = width,
) {
  return {
    src: BRAND_LOGOS[file],
    sizes:
      mobileWidth === width
        ? `${width}px`
        : `(max-width: ${MOBILE_BREAKPOINT - 1}px) ${mobileWidth}px, ${width}px`,
  };
}
