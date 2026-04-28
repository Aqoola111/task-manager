"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AccountSettingsForm() {
  const { data: session, isPending: sessionPending, refetch } =
    authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const n = session?.user?.name;
    if (n !== undefined && n !== null) {
      setName(n);
    }
  }, [session?.user?.name]);

  const currentEmail = session?.user?.email ?? "";

  async function onSaveName(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setProfileError("Name cannot be empty.");
      return;
    }
    setSavingName(true);
    const res = await authClient.updateUser({ name: trimmed });
    setSavingName(false);
    if (res.error) {
      setProfileError(res.error.message ?? "Could not update name.");
      return;
    }
    setProfileMessage("Name updated.");
    await refetch();
  }

  async function onChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailMessage(null);
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) {
      setEmailError("Enter a new email address.");
      return;
    }
    if (trimmed === currentEmail.toLowerCase()) {
      setEmailError("That is already your email.");
      return;
    }
    setSavingEmail(true);
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const res = await authClient.changeEmail({
      newEmail: trimmed,
      callbackURL: `${origin}/dashboard/settings`,
    });
    setSavingEmail(false);
    if (res.error) {
      setEmailError(res.error.message ?? "Could not change email.");
      return;
    }
    setEmailMessage(
      "Request processed. If your account uses email verification, check your inbox or the server logs in development.",
    );
    setNewEmail("");
    await refetch();
  }

  if (sessionPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-sm" />
        <Skeleton className="h-56 w-full rounded-sm" />
        <Skeleton className="h-40 w-full rounded-sm" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <p className="text-sm font-semibold text-muted-foreground">
        Sign in to manage settings.
      </p>
    );
  }

  const themeOptions = [
    { id: "light" as const, icon: Sun, label: "Light" },
    { id: "dark" as const, icon: Moon, label: "Dark" },
    { id: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Your display name as shown in the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSaveName} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="settings-name">Name</FieldLabel>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Your name"
                />
              </Field>
            </FieldGroup>
            {profileError ? (
              <FieldError>{profileError}</FieldError>
            ) : null}
            {profileMessage ? (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {profileMessage}
              </p>
            ) : null}
            <Button type="submit" disabled={savingName}>
              {savingName ? "Saving…" : "Save name"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-2 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Email</CardTitle>
          <CardDescription>
            Current address:{" "}
            <span className="font-bold text-foreground">{currentEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onChangeEmail} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="settings-new-email">New email</FieldLabel>
                <Input
                  id="settings-new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <FieldDescription>
                  Changing email may send a confirmation link if your account
                  is verified.
                </FieldDescription>
              </Field>
            </FieldGroup>
            {emailError ? <FieldError>{emailError}</FieldError> : null}
            {emailMessage ? (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {emailMessage}
              </p>
            ) : null}
            <Button type="submit" variant="outline" disabled={savingEmail}>
              {savingEmail ? "Sending…" : "Change email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-2 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
          <CardDescription>
            Choose light, dark, or match your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!mounted ? (
            <Skeleton className="h-11 w-full max-w-md rounded-sm" />
          ) : (
            <div
              className="flex max-w-md flex-col gap-2 sm:flex-row sm:flex-wrap"
              role="radiogroup"
              aria-label="Theme"
            >
              {themeOptions.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={theme === id}
                  onClick={() => setTheme(id)}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-border px-4 py-2.5 text-sm font-bold transition-all sm:flex-initial",
                    theme === id
                      ? "bg-neo-yellow text-foreground shadow-[3px_3px_0_0_var(--border)]"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
