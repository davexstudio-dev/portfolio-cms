import * as React from "react";
import { cn } from "../lib/cn";

export type TabsVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type TabsSize = "sm" | "md" | "lg";

const variantClasses: Record<TabsVariant, string> = {
  default: "ui-tabs--default",
  muted: "ui-tabs--muted",
  outline: "ui-tabs--outline",
  ghost: "ui-tabs--ghost",
  destructive: "ui-tabs--destructive",
};

const sizeClasses: Record<TabsSize, string> = {
  sm: "ui-tabs--sm",
  md: "ui-tabs--md",
  lg: "ui-tabs--lg",
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TabsVariant;
  size?: TabsSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Tabs primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-tabs", variantClasses[variant], sizeClasses[size], disabled && "ui-tabs--disabled", className);
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

Tabs.displayName = "Tabs";

export function isTabsVariant(value: unknown): value is TabsVariant {
  return typeof value === "string" && value in variantClasses;
}

export function tabsClassName(variant: TabsVariant = "default", size: TabsSize = "md"): string {
  return cn("ui-tabs", variantClasses[variant], sizeClasses[size]);
}
