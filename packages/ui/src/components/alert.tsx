import * as React from "react";
import { cn } from "../lib/cn";

export type AlertVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type AlertSize = "sm" | "md" | "lg";

const variantClasses: Record<AlertVariant, string> = {
  default: "ui-alert--default",
  muted: "ui-alert--muted",
  outline: "ui-alert--outline",
  ghost: "ui-alert--ghost",
  destructive: "ui-alert--destructive",
};

const sizeClasses: Record<AlertSize, string> = {
  sm: "ui-alert--sm",
  md: "ui-alert--md",
  lg: "ui-alert--lg",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: AlertSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Alert primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-alert", variantClasses[variant], sizeClasses[size], disabled && "ui-alert--disabled", className);
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

Alert.displayName = "Alert";

export function isAlertVariant(value: unknown): value is AlertVariant {
  return typeof value === "string" && value in variantClasses;
}

export function alertClassName(variant: AlertVariant = "default", size: AlertSize = "md"): string {
  return cn("ui-alert", variantClasses[variant], sizeClasses[size]);
}
