import * as React from "react";
import { cn } from "../lib/cn";

export type BadgeVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type BadgeSize = "sm" | "md" | "lg";

const variantClasses: Record<BadgeVariant, string> = {
  default: "ui-badge--default",
  muted: "ui-badge--muted",
  outline: "ui-badge--outline",
  ghost: "ui-badge--ghost",
  destructive: "ui-badge--destructive",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "ui-badge--sm",
  md: "ui-badge--md",
  lg: "ui-badge--lg",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Badge primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-badge", variantClasses[variant], sizeClasses[size], disabled && "ui-badge--disabled", className);
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

Badge.displayName = "Badge";

export function isBadgeVariant(value: unknown): value is BadgeVariant {
  return typeof value === "string" && value in variantClasses;
}

export function badgeClassName(variant: BadgeVariant = "default", size: BadgeSize = "md"): string {
  return cn("ui-badge", variantClasses[variant], sizeClasses[size]);
}
