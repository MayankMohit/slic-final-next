import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children = "Book A Strategy Call",
  ...props
}) => {
  return (
    <StyledWrapper>
      <button id="btn" {...props}>
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    padding: 10px 20px;
    text-transform: uppercase;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 500;
    color: #ffffff80;
    text-shadow: none;
    background: transparent;
    cursor: pointer;
    box-shadow: transparent;
    border: 1px solid #ffffff80;
    transition: 0.5s ease;
    user-select: none;
  }

  #btn:hover,
  :focus {
    color: #ffffff;
    background: #118aeb;
    border: 1px solid #0ef;
    text-shadow: 0 0 5px #ffffff;
    box-shadow: 0 0 3px #118aeb, 0 0 10px #118aeb, 0 0 25px #118aeb, 0 0 50px #118aeb;
    scale: 1.1;
  }

  #btn:active {
    transform: scale(0.8);
  }`;

export default PrimaryButton;
