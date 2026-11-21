import * as React from "react";
import { cn } from "../lib/cn";

export type ToastVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type ToastSize = "sm" | "md" | "lg";

const variantClasses: Record<ToastVariant, string> = {
  default: "ui-toast--default",
  muted: "ui-toast--muted",
  outline: "ui-toast--outline",
  ghost: "ui-toast--ghost",
  destructive: "ui-toast--destructive",
};

const sizeClasses: Record<ToastSize, string> = {
  sm: "ui-toast--sm",
  md: "ui-toast--md",
  lg: "ui-toast--lg",
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  size?: ToastSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Toast primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-toast", variantClasses[variant], sizeClasses[size], disabled && "ui-toast--disabled", className);
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

Toast.displayName = "Toast";

export function isToastVariant(value: unknown): value is ToastVariant {
  return typeof value === "string" && value in variantClasses;
}

export function toastClassName(variant: ToastVariant = "default", size: ToastSize = "md"): string {
  return cn("ui-toast", variantClasses[variant], sizeClasses[size]);
}
