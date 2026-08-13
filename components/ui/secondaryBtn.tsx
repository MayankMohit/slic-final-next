import React, { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import styled from "styled-components";

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
        <Link href={href} className="secondary-btn text-sm md:text-[0.8vw]">
          {children}
        </Link>
      ) : (
        <button className="secondary-btn text-sm md:text-[0.8vw]" {...props}>
          {children}
        </button>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding: 10px 20px;
    text-transform: uppercase;
    border-radius: 8px;
    color: #ffffff80;
    text-shadow: none;
    background: transparent;
    cursor: pointer;
    border: 1px solid #ffffff80;
    transition: 0.5s ease;
    user-select: none;
  }

  .secondary-btn:hover,
  .secondary-btn:focus-visible {
    color: #ffffff;
    background: #118aeb;
    border: 1px solid #0ef;
    text-shadow: 0 0 5px #ffffff;
    box-shadow:
      0 0 3px #118aeb,
      0 0 10px #118aeb,
      0 0 25px #118aeb,
      0 0 50px #118aeb;
    scale: 1.1;
    outline: none;
  }

  .secondary-btn:active {
    transform: scale(0.8);
  }
`;

export default SecondaryButton;
