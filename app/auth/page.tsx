import { Suspense } from "react";

import { AuthPageContent } from "@/app/auth/auth-page-content";

function AuthFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthPageContent />
    </Suspense>
  );
}
