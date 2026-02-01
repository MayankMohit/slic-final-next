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
      <button {...props}>
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    padding: 17px 40px;
    border-radius: 50px;
    cursor: pointer;
    border: 0;
    background-color: #F78379;
    box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-size: 15px;
    color: rgb(0, 0, 0);
    transition: all 0.5s ease;
  }

  button:hover {
    letter-spacing: 3px;
    background-color: white;
    color: #894943;
    box-shadow: hsl(214deg 75% 45% / 40%) 0px 7px 29px 0px;
  }

  button:active {
    letter-spacing: 3px;
    background-color: hsl(214deg 75% 50%);
    color: hsl(0, 0%, 100%);
    box-shadow: hsl(214deg 75% 45% / 30%) 0px 0px 0px 0px;
    transform: translateY(6px);
    transition: 100ms;
  }
`;

export default PrimaryButton;
