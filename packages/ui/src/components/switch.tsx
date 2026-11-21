import * as React from "react";
import { cn } from "../lib/cn";

export type SwitchVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type SwitchSize = "sm" | "md" | "lg";

const variantClasses: Record<SwitchVariant, string> = {
  default: "ui-switch--default",
  muted: "ui-switch--muted",
  outline: "ui-switch--outline",
  ghost: "ui-switch--ghost",
  destructive: "ui-switch--destructive",
};

const sizeClasses: Record<SwitchSize, string> = {
  sm: "ui-switch--sm",
  md: "ui-switch--md",
  lg: "ui-switch--lg",
};

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SwitchVariant;
  size?: SwitchSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Switch primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(function Switch(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-switch", variantClasses[variant], sizeClasses[size], disabled && "ui-switch--disabled", className);
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

Switch.displayName = "Switch";

export function isSwitchVariant(value: unknown): value is SwitchVariant {
  return typeof value === "string" && value in variantClasses;
}

export function switchClassName(variant: SwitchVariant = "default", size: SwitchSize = "md"): string {
  return cn("ui-switch", variantClasses[variant], sizeClasses[size]);
}
