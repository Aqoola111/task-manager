import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border-0 bg-muted/60 px-3 py-1.5 text-base text-foreground shadow-inner transition-[box-shadow,background-color] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border focus-visible:border-primary/35 focus-visible:bg-background focus-visible:shadow-[var(--shadow-glow-primary)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border aria-invalid:border-destructive/40 aria-invalid:ring-2 aria-invalid:ring-destructive/25 md:text-sm dark:bg-muted/40 dark:focus-visible:bg-card",
        className
      )}
      {...props}
    />
  )
}

export { Input }
