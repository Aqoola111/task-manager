import { describe, expect, it } from "vitest";

import {
  accountDisplayNameSchema,
  changeEmailFormSchema,
} from "./settings";

describe("accountDisplayNameSchema", () => {
  it("accepts trimmed non-empty name", () => {
    expect(accountDisplayNameSchema.parse({ name: "Ada" }).name).toBe("Ada");
  });

  it("rejects empty string after trim", () => {
    expect(() => accountDisplayNameSchema.parse({ name: "   " })).toThrow();
  });

  it("rejects overly long name", () => {
    expect(() =>
      accountDisplayNameSchema.parse({ name: "x".repeat(121) }),
    ).toThrow();
  });
});

describe("changeEmailFormSchema", () => {
  it("rejects same email as current (case-insensitive)", () => {
    const schema = changeEmailFormSchema("User@Example.com");
    expect(() =>
      schema.parse({ newEmail: "user@example.com" }),
    ).toThrow();
  });

  it("accepts different email", () => {
    const schema = changeEmailFormSchema("old@example.com");
    const parsed = schema.parse({ newEmail: "new@example.com" });
    expect(parsed.newEmail).toBe("new@example.com");
  });

  it("rejects invalid email format", () => {
    const schema = changeEmailFormSchema("a@b.co");
    expect(() => schema.parse({ newEmail: "not-email" })).toThrow();
  });
});
