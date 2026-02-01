import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface NavButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  children = "Book A Call",
  ...props
}) => {
  return (
    <StyledWrapper>
      <button {...props}>
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    outline: none;
    cursor: pointer;
    border: none;
    padding: 0.5rem 2rem;
    margin: 0;
    position: relative;
    display: inline-block;
    letter-spacing: 0.05rem;
    border-radius: 500px;
    overflow: hidden;
    background: #ffffff;
    color: #000000;
  }

  button span {
    position: relative;
    z-index: 10;
    transition: color 0.4s ease;
  }

  button:hover span {
    color: #ffffff;
  }

  button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -10%;
    height: 100%;
    width: 120%;
    background: hsl(216, 85%, 39%);
    transform: skew(30deg) translateX(-100%);
    transition: transform 0.5s cubic-bezier(0.3, 1, 0.8, 1);
    z-index: 0;
  }

  button:hover::before {
    transform: skew(30deg) translateX(0%);
  }
`;

export default NavButton;
