import * as React from "react";
import { cn } from "../lib/cn";

export type TableVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type TableSize = "sm" | "md" | "lg";

const variantClasses: Record<TableVariant, string> = {
  default: "ui-table--default",
  muted: "ui-table--muted",
  outline: "ui-table--outline",
  ghost: "ui-table--ghost",
  destructive: "ui-table--destructive",
};

const sizeClasses: Record<TableSize, string> = {
  sm: "ui-table--sm",
  md: "ui-table--md",
  lg: "ui-table--lg",
};

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TableVariant;
  size?: TableSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Table primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Table = React.forwardRef<HTMLDivElement, TableProps>(function Table(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-table", variantClasses[variant], sizeClasses[size], disabled && "ui-table--disabled", className);
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

Table.displayName = "Table";

export function isTableVariant(value: unknown): value is TableVariant {
  return typeof value === "string" && value in variantClasses;
}

export function tableClassName(variant: TableVariant = "default", size: TableSize = "md"): string {
  return cn("ui-table", variantClasses[variant], sizeClasses[size]);
}
