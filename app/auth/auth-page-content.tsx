"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  authSignInSchema,
  authSignUpSchema,
  type AuthSignInInput,
  type AuthSignUpInput,
} from "@/lib/validation/auth";
import { cn } from "@/lib/utils";

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [tab, setTab] = useState("signin");

  const signInForm = useForm<AuthSignInInput>({
    resolver: zodResolver(authSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<AuthSignUpInput>({
    resolver: zodResolver(authSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSignIn = signInForm.handleSubmit(async (data) => {
    signInForm.clearErrors("root");
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: callbackUrl,
    });
    if (result.error) {
      signInForm.setError("root", {
        message: result.error.message ?? "Sign in failed",
      });
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  });

  const onSignUp = signUpForm.handleSubmit(async (data) => {
    signUpForm.clearErrors("root");
    const result = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: callbackUrl,
    });
    if (result.error) {
      signUpForm.setError("root", {
        message: result.error.message ?? "Sign up failed",
      });
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  });

  function handleTabChange(next: string) {
    setTab(next);
    signInForm.clearErrors();
    signUpForm.clearErrors();
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-x-hidden overflow-y-auto border-b border-border bg-background px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:p-6">
      <Card className="w-full max-w-md border-2 border-border bg-neo-pink backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">
            Welcome
          </CardTitle>
          <CardDescription className="font-semibold">
            Sign in to your workspace or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent className="pt-6" value="signin">
              <form onSubmit={onSignIn} className="space-y-4" noValidate>
                {signInForm.formState.errors.root ? (
                  <p
                    className="rounded-sm border-2 border-destructive bg-destructive/15 px-3 py-2 text-sm font-bold text-destructive"
                    role="alert"
                  >
                    {signInForm.formState.errors.root.message}
                  </p>
                ) : null}
                <FieldGroup className="gap-4">
                  <Controller
                    name="email"
                    control={signInForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="font-bold"
                          htmlFor="signin-email"
                        >
                          Email
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signin-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={signInForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="font-bold"
                          htmlFor="signin-password"
                        >
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signin-password"
                          type="password"
                          autoComplete="current-password"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signInForm.formState.isSubmitting}
                >
                  {signInForm.formState.isSubmitting
                    ? "Please wait…"
                    : "Sign in"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent className="pt-6" value="signup">
              <form onSubmit={onSignUp} className="space-y-4" noValidate>
                {signUpForm.formState.errors.root ? (
                  <p
                    className="rounded-sm border-2 border-destructive bg-destructive/15 px-3 py-2 text-sm font-bold text-destructive"
                    role="alert"
                  >
                    {signUpForm.formState.errors.root.message}
                  </p>
                ) : null}
                <FieldGroup className="gap-4">
                  <Controller
                    name="name"
                    control={signUpForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="font-bold"
                          htmlFor="signup-name"
                        >
                          Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={signUpForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="font-bold"
                          htmlFor="signup-email"
                        >
                          Email
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={signUpForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="font-bold"
                          htmlFor="signup-password"
                        >
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-password"
                          type="password"
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpForm.formState.isSubmitting}
                >
                  {signUpForm.formState.isSubmitting
                    ? "Please wait…"
                    : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t-2 border-border">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-muted-foreground",
            )}
          >
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
