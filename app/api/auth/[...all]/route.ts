import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/auth";

let cached: ReturnType<typeof toNextJsHandler> | null = null;

async function handlers() {
  if (!cached) {
    const auth = await getAuth();
    cached = toNextJsHandler(auth);
  }
  return cached;
}

export async function GET(request: Request) {
  return (await handlers()).GET(request);
}

export async function POST(request: Request) {
  return (await handlers()).POST(request);
}

export async function PATCH(request: Request) {
  return (await handlers()).PATCH(request);
}

export async function PUT(request: Request) {
  return (await handlers()).PUT(request);
}

export async function DELETE(request: Request) {
  return (await handlers()).DELETE(request);
}
