import React, { ButtonHTMLAttributes } from "react";
import NavButton from "./navButton";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

// Same visual as the navbar CTA — NavButton owns the styling so the two
// never drift apart.
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children = "Book A Strategy Call",
  ...props
}) => {
  return <NavButton {...props}>{children}</NavButton>;
};

export default PrimaryButton;
