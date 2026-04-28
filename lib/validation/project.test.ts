import { describe, expect, it } from "vitest";

import { createProjectSchema } from "./project";

describe("createProjectSchema", () => {
  it("accepts valid boundary name and planning status", () => {
    const parsed = createProjectSchema.parse({
      name: "A",
      status: "planning",
    });
    expect(parsed.name).toBe("A");
    expect(parsed.status).toBe("planning");
  });

  it("trims whitespace in name", () => {
    const parsed = createProjectSchema.parse({
      name: "  roadmap  ",
      status: "active",
    });
    expect(parsed.name).toBe("roadmap");
  });

  it("rejects empty name after trim", () => {
    expect(() =>
      createProjectSchema.parse({
        name: "   ",
        status: "active",
      }),
    ).toThrow();
  });

  it("rejects name over max length", () => {
    expect(() =>
      createProjectSchema.parse({
        name: "x".repeat(121),
        status: "active",
      }),
    ).toThrow();
  });

  it("accepts max length name", () => {
    const parsed = createProjectSchema.parse({
      name: "x".repeat(120),
      status: "archived",
    });
    expect(parsed.name.length).toBe(120);
  });

  it("rejects invalid status enum", () => {
    expect(() =>
      createProjectSchema.parse({
        name: "Ok",
        status: "deleted",
      }),
    ).toThrow();
  });
});
