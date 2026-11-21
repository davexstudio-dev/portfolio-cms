import * as React from "react";
import { cn } from "../lib/cn";

export type BreadcrumbVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type BreadcrumbSize = "sm" | "md" | "lg";

const variantClasses: Record<BreadcrumbVariant, string> = {
  default: "ui-breadcrumb--default",
  muted: "ui-breadcrumb--muted",
  outline: "ui-breadcrumb--outline",
  ghost: "ui-breadcrumb--ghost",
  destructive: "ui-breadcrumb--destructive",
};

const sizeClasses: Record<BreadcrumbSize, string> = {
  sm: "ui-breadcrumb--sm",
  md: "ui-breadcrumb--md",
  lg: "ui-breadcrumb--lg",
};

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BreadcrumbVariant;
  size?: BreadcrumbSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Breadcrumb primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(function Breadcrumb(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-breadcrumb", variantClasses[variant], sizeClasses[size], disabled && "ui-breadcrumb--disabled", className);
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

Breadcrumb.displayName = "Breadcrumb";

export function isBreadcrumbVariant(value: unknown): value is BreadcrumbVariant {
  return typeof value === "string" && value in variantClasses;
}

export function breadcrumbClassName(variant: BreadcrumbVariant = "default", size: BreadcrumbSize = "md"): string {
  return cn("ui-breadcrumb", variantClasses[variant], sizeClasses[size]);
}
