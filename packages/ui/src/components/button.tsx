import * as React from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  default: "ui-button--default",
  muted: "ui-button--muted",
  outline: "ui-button--outline",
  ghost: "ui-button--ghost",
  destructive: "ui-button--destructive",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "ui-button--sm",
  md: "ui-button--md",
  lg: "ui-button--lg",
};

export interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Button primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Button = React.forwardRef<HTMLDivElement, ButtonProps>(function Button(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-button", variantClasses[variant], sizeClasses[size], disabled && "ui-button--disabled", className);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
    });
  }
  return (
    <div ref={ref} className={classes} aria-disabled={disabled || undefined} data-variant={variant} data-size={size} {...rest}>
      {children}
    </div>
  );
});

Button.displayName = "Button";

export function isButtonVariant(value: unknown): value is ButtonVariant {
  return typeof value === "string" && value in variantClasses;
}

export function buttonClassName(variant: ButtonVariant = "default", size: ButtonSize = "md"): string {
  return cn("ui-button", variantClasses[variant], sizeClasses[size]);
}
