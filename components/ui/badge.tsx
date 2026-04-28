import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border-2 border-border px-2 py-0.5 text-xs font-bold whitespace-nowrap shadow-[2px_2px_0_0_var(--border)] transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-neo-yellow text-foreground [a]:hover:translate-x-px [a]:hover:translate-y-px [a]:hover:shadow-[1px_1px_0_0_var(--border)]",
        secondary:
          "bg-neo-mint text-foreground [a]:hover:translate-x-px [a]:hover:translate-y-px",
        destructive:
          "border-destructive bg-red-200 text-foreground dark:bg-red-950/65 dark:text-red-50",
        outline:
          "border-border bg-background text-foreground",
        ghost:
          "border-transparent shadow-none hover:border-border hover:bg-neo-pink/50",
        link: "border-0 font-bold text-primary shadow-none underline decoration-2 underline-offset-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
