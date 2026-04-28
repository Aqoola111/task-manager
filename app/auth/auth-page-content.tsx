"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await authClient.signIn.email({
      email: signInEmail,
      password: signInPassword,
      callbackURL: callbackUrl,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? "Sign in failed");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await authClient.signUp.email({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      callbackURL: callbackUrl,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? "Sign up failed");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-x-hidden overflow-y-auto border-b border-border bg-background px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:p-6">
      <Card className="w-full max-w-md border-2 border-border bg-neo-pink backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">Welcome</CardTitle>
          <CardDescription className="font-semibold">
            Sign in to your workspace or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p
              className="mb-4 rounded-sm border-2 border-destructive bg-destructive/15 px-3 py-2 text-sm font-bold text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent className="pt-6" value="signin">
              <form onSubmit={onSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    className="font-bold"
                    htmlFor="signin-email"
                  >
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="font-bold"
                    htmlFor="signin-password"
                  >
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent className="pt-6" value="signup">
              <form onSubmit={onSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold" htmlFor="signup-name">
                    Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold" htmlFor="signup-email">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold" htmlFor="signup-password">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait…" : "Create account"}
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
