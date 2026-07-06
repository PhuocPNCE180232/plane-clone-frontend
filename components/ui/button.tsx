import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white shadow hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700": variant === "default",
            "border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800": variant === "outline",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800": variant === "ghost",
            "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700": variant === "secondary",
            "text-blue-600 underline-offset-4 hover:underline dark:text-blue-500": variant === "link",
          }[variant],
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          }[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
