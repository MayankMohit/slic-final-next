import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { buttonBase } from "./buttonBase";

interface NavButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  children = "Book A Call",
  className,
  ...props
}) => {
  return (
    <StyledWrapper>
      <button className={`btn-donate ${className ?? ""}`} {...props}>
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
 .btn-donate {
    ${buttonBase}

    /* Every colour here derives from --brand in globals.css, so the CTA
       follows the theme instead of pinning its own blue. The four shadow
       layers used to be literal rgba blues; they are now the same tint and
       shade the gradient is built from, at the alphas they always had. */
    --btn-bg-1: var(--brand-alt);
    --btn-bg-2: var(--brand);
    /* Label colour follows --brand-on, not a hardcoded white: on a bright
       accent (a lime green scores 1.31:1) white type disappears entirely. */
    --btn-bg-color: var(--brand-on);
    --radii: 0.5em;

    background-size: 280% auto;
    background-image: linear-gradient(
      325deg,
      var(--btn-bg-2) 0%,
      var(--btn-bg-1) 55%,
      var(--btn-bg-2) 90%
    );
    border: none;
    color: var(--btn-bg-color);
    box-shadow:
      0px 0px 20px color-mix(in srgb, var(--brand-alt) 50%, transparent),
      0px 5px 5px -1px color-mix(in srgb, var(--brand-deep) 30%, transparent),
      inset 4px 4px 8px color-mix(in srgb, var(--brand-light) 55%, transparent),
      inset -4px -4px 8px color-mix(in srgb, var(--brand-deep) 40%, transparent);
  }

  .btn-donate:hover {
    background-position: right top;
  }

  .btn-donate:is(:focus, :focus-visible, :active) {
    outline: none;
    box-shadow:
      0 0 0 3px var(--btn-bg-color),
      0 0 0 6px var(--btn-bg-2);
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-donate {
      transition: linear;
    }
  }`;

export default NavButton;
