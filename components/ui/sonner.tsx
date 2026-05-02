"use client";

import type { CSSProperties } from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" aria-hidden />,
        info: <InfoIcon className="size-4" aria-hidden />,
        warning: <TriangleAlertIcon className="size-4" aria-hidden />,
        error: <OctagonXIcon className="size-4" aria-hidden />,
        loading: <Loader2Icon className="size-4 animate-spin" aria-hidden />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-2xl border-[0.5px] border-border/80 bg-card/95 text-card-foreground shadow-cozy-md backdrop-blur-xl font-medium",
          title: "font-medium text-foreground",
          description: "text-sm font-medium text-muted-foreground",
          actionButton:
            "rounded-lg border-[0.5px] border-border/60 bg-primary/15 px-2 py-1 font-medium text-foreground",
          cancelButton: "font-medium text-muted-foreground",
          closeButton:
            "rounded-lg border-[0.5px] border-border/60 bg-muted/50 text-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
