import * as React from "react";
import { cn } from "../lib/cn";

export type CardVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type CardSize = "sm" | "md" | "lg";

const variantClasses: Record<CardVariant, string> = {
  default: "ui-card--default",
  muted: "ui-card--muted",
  outline: "ui-card--outline",
  ghost: "ui-card--ghost",
  destructive: "ui-card--destructive",
};

const sizeClasses: Record<CardSize, string> = {
  sm: "ui-card--sm",
  md: "ui-card--md",
  lg: "ui-card--lg",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Card primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-card", variantClasses[variant], sizeClasses[size], disabled && "ui-card--disabled", className);
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

Card.displayName = "Card";

export function isCardVariant(value: unknown): value is CardVariant {
  return typeof value === "string" && value in variantClasses;
}

export function cardClassName(variant: CardVariant = "default", size: CardSize = "md"): string {
  return cn("ui-card", variantClasses[variant], sizeClasses[size]);
}
