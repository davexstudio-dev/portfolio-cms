import * as React from "react";
import { cn } from "../lib/cn";

export type SkeletonVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type SkeletonSize = "sm" | "md" | "lg";

const variantClasses: Record<SkeletonVariant, string> = {
  default: "ui-skeleton--default",
  muted: "ui-skeleton--muted",
  outline: "ui-skeleton--outline",
  ghost: "ui-skeleton--ghost",
  destructive: "ui-skeleton--destructive",
};

const sizeClasses: Record<SkeletonSize, string> = {
  sm: "ui-skeleton--sm",
  md: "ui-skeleton--md",
  lg: "ui-skeleton--lg",
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Skeleton primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-skeleton", variantClasses[variant], sizeClasses[size], disabled && "ui-skeleton--disabled", className);
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

Skeleton.displayName = "Skeleton";

export function isSkeletonVariant(value: unknown): value is SkeletonVariant {
  return typeof value === "string" && value in variantClasses;
}

export function skeletonClassName(variant: SkeletonVariant = "default", size: SkeletonSize = "md"): string {
  return cn("ui-skeleton", variantClasses[variant], sizeClasses[size]);
}
