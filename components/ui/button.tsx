import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sketch text-sm font-noto font-light transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[var(--accent-green)] focus-visible:ring-[var(--accent-green)]/30 focus-visible:ring-[2px] aria-invalid:ring-[var(--accent-brown)]/20 aria-invalid:border-[var(--accent-brown)] border-[1.5px] hover:transform hover:translate-y-[-0.5px] hover:shadow-[0_2px_4px_var(--shadow-soft)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-green)] text-[var(--background)] border-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] hover:border-[var(--accent-green-hover)]",
        destructive:
          "bg-[var(--accent-brown)] text-[var(--background)] border-[var(--accent-brown)] hover:bg-[var(--accent-brown-hover)] hover:border-[var(--accent-brown-hover)]",
        outline:
          "border-[var(--border-soft)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent-lighter)] hover:text-[var(--foreground)]",
        secondary:
          "bg-[var(--accent-light)] text-[var(--foreground)] border-[var(--border-soft)] hover:bg-[var(--accent-lighter)]",
        ghost:
          "border-transparent text-[var(--foreground)] hover:bg-[var(--accent-lighter)] hover:text-[var(--foreground)]",
        link: "text-[var(--accent-green)] underline-offset-4 hover:underline border-transparent font-normal",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
