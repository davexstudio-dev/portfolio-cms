import * as React from "react";
import { cn } from "../lib/cn";

export type DialogVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type DialogSize = "sm" | "md" | "lg";

const variantClasses: Record<DialogVariant, string> = {
  default: "ui-dialog--default",
  muted: "ui-dialog--muted",
  outline: "ui-dialog--outline",
  ghost: "ui-dialog--ghost",
  destructive: "ui-dialog--destructive",
};

const sizeClasses: Record<DialogSize, string> = {
  sm: "ui-dialog--sm",
  md: "ui-dialog--md",
  lg: "ui-dialog--lg",
};

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DialogVariant;
  size?: DialogSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Dialog primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-dialog", variantClasses[variant], sizeClasses[size], disabled && "ui-dialog--disabled", className);
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

Dialog.displayName = "Dialog";

export function isDialogVariant(value: unknown): value is DialogVariant {
  return typeof value === "string" && value in variantClasses;
}

export function dialogClassName(variant: DialogVariant = "default", size: DialogSize = "md"): string {
  return cn("ui-dialog", variantClasses[variant], sizeClasses[size]);
}
