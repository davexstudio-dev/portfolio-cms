import * as React from "react";
import { cn } from "../lib/cn";

export type TooltipVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type TooltipSize = "sm" | "md" | "lg";

const variantClasses: Record<TooltipVariant, string> = {
  default: "ui-tooltip--default",
  muted: "ui-tooltip--muted",
  outline: "ui-tooltip--outline",
  ghost: "ui-tooltip--ghost",
  destructive: "ui-tooltip--destructive",
};

const sizeClasses: Record<TooltipSize, string> = {
  sm: "ui-tooltip--sm",
  md: "ui-tooltip--md",
  lg: "ui-tooltip--lg",
};

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TooltipVariant;
  size?: TooltipSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Tooltip primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-tooltip", variantClasses[variant], sizeClasses[size], disabled && "ui-tooltip--disabled", className);
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

Tooltip.displayName = "Tooltip";

export function isTooltipVariant(value: unknown): value is TooltipVariant {
  return typeof value === "string" && value in variantClasses;
}

export function tooltipClassName(variant: TooltipVariant = "default", size: TooltipSize = "md"): string {
  return cn("ui-tooltip", variantClasses[variant], sizeClasses[size]);
}
