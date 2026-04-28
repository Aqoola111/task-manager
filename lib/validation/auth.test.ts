import { describe, expect, it } from "vitest";

import { authSignInSchema, authSignUpSchema } from "./auth";

describe("authSignInSchema", () => {
  it("accepts valid email and password", () => {
    const parsed = authSignInSchema.parse({
      email: "user@example.com",
      password: "secret",
    });
    expect(parsed.email).toBe("user@example.com");
  });

  it("trims email", () => {
    const parsed = authSignInSchema.parse({
      email: "  user@example.com  ",
      password: "x",
    });
    expect(parsed.email).toBe("user@example.com");
  });

  it("rejects invalid email format", () => {
    expect(() =>
      authSignInSchema.parse({
        email: "not-an-email",
        password: "secret",
      }),
    ).toThrow();
  });

  it("rejects empty password", () => {
    expect(() =>
      authSignInSchema.parse({
        email: "a@b.co",
        password: "",
      }),
    ).toThrow();
  });
});

describe("authSignUpSchema", () => {
  it("rejects password shorter than 8 chars", () => {
    expect(() =>
      authSignUpSchema.parse({
        name: "User",
        email: "user@example.com",
        password: "1234567",
      }),
    ).toThrow();
  });

  it("accepts password of exactly 8 chars", () => {
    const parsed = authSignUpSchema.parse({
      name: "User",
      email: "user@example.com",
      password: "12345678",
    });
    expect(parsed.password).toBe("12345678");
  });

  it("rejects empty trimmed name", () => {
    expect(() =>
      authSignUpSchema.parse({
        name: "   ",
        email: "user@example.com",
        password: "12345678",
      }),
    ).toThrow();
  });
});
