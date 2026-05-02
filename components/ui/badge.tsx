import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border-0 px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm transition-colors [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-foreground [a]:hover:bg-primary/22",
        secondary:
          "bg-secondary/80 text-secondary-foreground [a]:hover:bg-secondary",
        destructive:
          "bg-destructive/15 text-destructive dark:bg-red-950/50 dark:text-red-50",
        outline:
          "border-[0.5px] border-border/70 bg-background text-foreground",
        ghost:
          "shadow-none hover:bg-muted/60",
        link: "border-0 font-medium text-primary shadow-none underline decoration-2 underline-offset-2",
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
