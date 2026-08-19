import { css } from "styled-components";

/**
 * Geometry and typography shared by the primary button (navButton.tsx) and the
 * secondary button (secondaryBtn.tsx).
 *
 * The two render side by side in the hero, approach, case-studies and about
 * sections, so any drift between them is immediately visible. Both import this
 * fragment rather than restating the values, which makes a mismatch impossible
 * instead of merely unlikely. Colour, fill, border and shadow are what
 * distinguish the two, and those stay in each button's own file.
 *
 * line-height and box-sizing are pinned rather than inherited: the buttons sit
 * inside containers with different `leading-*` utilities, and an inherited
 * line-height would size the two differently depending on the section.
 *
 * Sizing is driven entirely by font-size. padding, gap and border-radius are
 * all expressed in em, so the whole button scales from that one value rather
 * than needing a breakpoint per property.
 *
 * The clamp keeps it in step with the rest of the page, which is sized in vw
 * (.heading is 3vw, .desc is 0.8vw), without inheriting that approach's two
 * failure modes: raw vw would render a ~7px label at the md breakpoint and a
 * ~31px one on a 4K display. The bounds hold it between 14px and 18px, so it
 * tracks the viewport across every real desktop width and pins to a legible
 * size outside that range.
 *
 * The preferred value matches .desc exactly, so the label sits at the same
 * optical size as the body copy it appears beside.
 */
export const buttonBase = css`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  padding: 0.45em 1.5em;

  /* Floors, not sizes — the button outgrows both once font-size passes ~17.6px.
     They exist to keep the tap target usable on narrow screens, where the clamp
     bottoms out. */
  min-width: 120px;
  min-height: 44px;

  font-size: var(--size, clamp(0.875rem, 0.8vw, 1.125rem));
  line-height: 1.5;
  text-transform: uppercase;
  text-decoration: none;

  cursor: pointer;
  user-select: none;
  border-radius: var(--radii, 0.5em);
  transition: 0.8s;
`;
