import React, { ButtonHTMLAttributes } from "react";
import NavButton from "./navButton";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Render as a link. See the note on NavButton's href. */
  href?: string;
}

// Same visual as the navbar CTA — NavButton owns the styling so the two
// never drift apart.
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children = "Book A Strategy Call",
  className,
  ...props
}) => {
  return (
    <NavButton className={`uppercase ${className ?? ""}`} {...props}>
      {children}
    </NavButton>
  );
};

export default PrimaryButton;
