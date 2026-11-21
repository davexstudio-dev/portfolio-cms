import * as React from "react";
import { cn } from "../lib/cn";

export type InputVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type InputSize = "sm" | "md" | "lg";

const variantClasses: Record<InputVariant, string> = {
  default: "ui-input--default",
  muted: "ui-input--muted",
  outline: "ui-input--outline",
  ghost: "ui-input--ghost",
  destructive: "ui-input--destructive",
};

const sizeClasses: Record<InputSize, string> = {
  sm: "ui-input--sm",
  md: "ui-input--md",
  lg: "ui-input--lg",
};

export interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: InputVariant;
  size?: InputSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Input primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Input = React.forwardRef<HTMLDivElement, InputProps>(function Input(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-input", variantClasses[variant], sizeClasses[size], disabled && "ui-input--disabled", className);
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

Input.displayName = "Input";

export function isInputVariant(value: unknown): value is InputVariant {
  return typeof value === "string" && value in variantClasses;
}

export function inputClassName(variant: InputVariant = "default", size: InputSize = "md"): string {
  return cn("ui-input", variantClasses[variant], sizeClasses[size]);
}
