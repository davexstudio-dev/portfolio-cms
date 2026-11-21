import * as React from "react";
import { cn } from "../lib/cn";

export type SeparatorVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type SeparatorSize = "sm" | "md" | "lg";

const variantClasses: Record<SeparatorVariant, string> = {
  default: "ui-separator--default",
  muted: "ui-separator--muted",
  outline: "ui-separator--outline",
  ghost: "ui-separator--ghost",
  destructive: "ui-separator--destructive",
};

const sizeClasses: Record<SeparatorSize, string> = {
  sm: "ui-separator--sm",
  md: "ui-separator--md",
  lg: "ui-separator--lg",
};

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SeparatorVariant;
  size?: SeparatorSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Separator primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-separator", variantClasses[variant], sizeClasses[size], disabled && "ui-separator--disabled", className);
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

Separator.displayName = "Separator";

export function isSeparatorVariant(value: unknown): value is SeparatorVariant {
  return typeof value === "string" && value in variantClasses;
}

export function separatorClassName(variant: SeparatorVariant = "default", size: SeparatorSize = "md"): string {
  return cn("ui-separator", variantClasses[variant], sizeClasses[size]);
}
