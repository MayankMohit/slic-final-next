import React, { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import styled from "styled-components";
import { buttonBase } from "./buttonBase";

interface SecondaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  /** Renders a next/link instead of a button when provided. */
  href?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  href,
  ...props
}) => {
  return (
    <StyledWrapper>
      {href ? (
        <Link href={href} className="secondary-btn">
          {children}
        </Link>
      ) : (
        <button className="secondary-btn" {...props}>
          {children}
        </button>
      )}
    </StyledWrapper>
  );
};

/* Size and type come from buttonBase, shared with .btn-donate in navButton.tsx.
   What's left here is only what makes this button secondary: the blue fill
   becomes a white sheen over a transparent base, and a border stands in for the
   edge the primary gets for free from its solid fill. The sweep itself is the
   same mechanism as the primary — a 280%-wide gradient whose position shifts on
   hover — because a fully transparent background has nothing to animate. */
const StyledWrapper = styled.div`
  .secondary-btn {
    ${buttonBase}

    --btn-sheen-edge: hsla(0 0% 100% / 0.03);
    --btn-sheen-peak: hsla(0 0% 100% / 0.18);
    --btn-border: hsla(0 0% 100% / 0.35);
    --radii: 0.5em;

    background-color: transparent;
    background-size: 280% auto;
    background-image: linear-gradient(
      325deg,
      var(--btn-sheen-edge) 0%,
      var(--btn-sheen-peak) 55%,
      var(--btn-sheen-edge) 90%
    );
    border: 1px solid var(--btn-border);
    color: hsla(0 0% 100% / 0.85);
    box-shadow:
      0px 0px 20px rgba(255, 255, 255, 0.08),
      0px 5px 5px -1px rgba(0, 0, 0, 0.25),
      inset 4px 4px 8px rgba(255, 255, 255, 0.08),
      inset -4px -4px 8px rgba(255, 255, 255, 0.02);
  }

  .secondary-btn:hover {
    background-position: right top;
    border-color: hsla(0 0% 100% / 0.6);
    color: hsla(0 0% 100% / 1);
  }

  .secondary-btn:is(:focus, :focus-visible, :active) {
    outline: none;
    box-shadow:
      0 0 0 3px hsla(0 0% 100% / 0.85),
      0 0 0 6px hsla(0 0% 100% / 0.25);
  }

  @media (prefers-reduced-motion: reduce) {
    .secondary-btn {
      transition: linear;
    }
  }
`;

export default SecondaryButton;
