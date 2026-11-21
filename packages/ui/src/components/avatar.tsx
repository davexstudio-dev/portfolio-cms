import * as React from "react";
import { cn } from "../lib/cn";

export type AvatarVariant = "default" | "muted" | "outline" | "ghost" | "destructive";
export type AvatarSize = "sm" | "md" | "lg";

const variantClasses: Record<AvatarVariant, string> = {
  default: "ui-avatar--default",
  muted: "ui-avatar--muted",
  outline: "ui-avatar--outline",
  ghost: "ui-avatar--ghost",
  destructive: "ui-avatar--destructive",
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "ui-avatar--sm",
  md: "ui-avatar--md",
  lg: "ui-avatar--lg",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AvatarVariant;
  size?: AvatarSize;
  /** Renders the element as its single child instead of a wrapper div. */
  asChild?: boolean;
  disabled?: boolean;
}

/**
 * Avatar primitive. Uses design tokens only (see styles/tokens.css); never hardcode colors or spacing here.
 * Touch targets stay at 44px minimum on small screens.
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { variant = "default", size = "md", asChild = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = cn("ui-avatar", variantClasses[variant], sizeClasses[size], disabled && "ui-avatar--disabled", className);
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

Avatar.displayName = "Avatar";

export function isAvatarVariant(value: unknown): value is AvatarVariant {
  return typeof value === "string" && value in variantClasses;
}

export function avatarClassName(variant: AvatarVariant = "default", size: AvatarSize = "md"): string {
  return cn("ui-avatar", variantClasses[variant], sizeClasses[size]);
}
