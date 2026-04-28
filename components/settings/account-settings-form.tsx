"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import {
  accountDisplayNameSchema,
  changeEmailFormSchema,
  type AccountDisplayNameInput,
  type ChangeEmailFormInput,
} from "@/lib/validation/settings";
import { cn } from "@/lib/utils";

export function AccountSettingsForm() {
  const { data: session, isPending: sessionPending, refetch } =
    authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentEmail = session?.user?.email ?? "";

  const emailSchema = useMemo(
    () => changeEmailFormSchema(currentEmail),
    [currentEmail],
  );

  const nameForm = useForm<AccountDisplayNameInput>({
    resolver: zodResolver(accountDisplayNameSchema),
    defaultValues: { name: "" },
  });

  const emailForm = useForm<ChangeEmailFormInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: "" },
  });

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const n = session?.user?.name;
    if (n !== undefined && n !== null) {
      nameForm.reset({ name: n });
    }
  }, [session?.user?.name, nameForm.reset]);

  async function onSaveName(data: AccountDisplayNameInput) {
    setProfileMessage(null);
    nameForm.clearErrors("root");
    const res = await authClient.updateUser({ name: data.name });
    if (res.error) {
      nameForm.setError("root", {
        message: res.error.message ?? "Could not update name.",
      });
      return;
    }
    setProfileMessage("Name updated.");
    await refetch();
  }

  async function onChangeEmail(data: ChangeEmailFormInput) {
    setEmailMessage(null);
    emailForm.clearErrors("root");
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const res = await authClient.changeEmail({
      newEmail: data.newEmail.trim().toLowerCase(),
      callbackURL: `${origin}/dashboard/settings`,
    });
    if (res.error) {
      emailForm.setError("root", {
        message: res.error.message ?? "Could not change email.",
      });
      return;
    }
    setEmailMessage(
      "Request processed. If your account uses email verification, check your inbox or the server logs in development.",
    );
    emailForm.reset({ newEmail: "" });
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
          <form
            className="space-y-4"
            onSubmit={nameForm.handleSubmit(onSaveName)}
            noValidate
          >
            {nameForm.formState.errors.root ? (
              <FieldError>{nameForm.formState.errors.root.message}</FieldError>
            ) : null}
            <FieldGroup>
              <Controller
                name="name"
                control={nameForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="settings-name"
                      autoComplete="name"
                      placeholder="Your name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </FieldGroup>
            {profileMessage ? (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {profileMessage}
              </p>
            ) : null}
            <Button type="submit" disabled={nameForm.formState.isSubmitting}>
              {nameForm.formState.isSubmitting ? "Saving…" : "Save name"}
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
          <form
            className="space-y-4"
            onSubmit={emailForm.handleSubmit(onChangeEmail)}
            noValidate
          >
            {emailForm.formState.errors.root ? (
              <FieldError>{emailForm.formState.errors.root.message}</FieldError>
            ) : null}
            <FieldGroup>
              <Controller
                name="newEmail"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-new-email">New email</FieldLabel>
                    <Input
                      {...field}
                      id="settings-new-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Changing email may send a confirmation link if your account
                      is verified.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </FieldGroup>
            {emailMessage ? (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {emailMessage}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="outline"
              disabled={emailForm.formState.isSubmitting}
            >
              {emailForm.formState.isSubmitting ? "Sending…" : "Change email"}
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
