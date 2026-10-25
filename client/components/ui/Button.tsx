import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "stepper" | "quiet";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  variant?: ButtonVariant;
}

export function Button({
  label,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = ["ui-button", `ui-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {label}
    </button>
  );
}