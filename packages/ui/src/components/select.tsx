import * as React from "react";
import { cn } from "../lib/cn";

export type SelectVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type SelectSize = "sm" | "md" | "lg";

const variantClasses: Record<SelectVariant, string> = {
  default: "ui-select--default",
  muted: "ui-select--muted",
  outline: "ui-select--outline",
  ghost: "ui-select--ghost",
  destructive: "ui-select--destructive",
};

const sizeClasses: Record<SelectSize, string> = {
  sm: "ui-select--sm",
  md: "ui-select--md",
  lg: "ui-select--lg",
};

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SelectVariant;
  size?: SelectSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Select primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-select", variantClasses[variant], sizeClasses[size], disabled && "ui-select--disabled", className);
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

Select.displayName = "Select";

export function isSelectVariant(value: unknown): value is SelectVariant {
  return typeof value === "string" && value in variantClasses;
}

export function selectClassName(variant: SelectVariant = "default", size: SelectSize = "md"): string {
  return cn("ui-select", variantClasses[variant], sizeClasses[size]);
}
