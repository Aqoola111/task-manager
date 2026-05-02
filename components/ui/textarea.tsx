import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border-0 bg-muted/60 px-3 py-2.5 text-base font-medium text-foreground shadow-inner transition-[box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border focus-visible:border-primary/35 focus-visible:bg-background focus-visible:shadow-[var(--shadow-glow-primary)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border aria-invalid:border-destructive/40 md:text-sm dark:bg-muted/40 dark:focus-visible:bg-card",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
